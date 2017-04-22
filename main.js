$(document).ready(function() {
  console.log("js connected")
  drawWindow()

  $('#gameWindow').click(function(event){
    console.log(event.target.id);
  })


})

//set game variables
var roomSize = 20,
  gridSize = 35,
  turnNumber = 0;

//game step engine variables
var timestep = 1000/5, //this sets the speed to 30 fps
    delta = 0,
    lastFrameTimeMs = 0, // The timestamp in milliseconds of the last time the main loop was run.
    maxFPS = 5;

requestAnimationFrame(mainLoop);
//main game loop and engine
function mainLoop(timestamp) {
  // Throttle the frame rate.
  if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
      requestAnimationFrame(mainLoop);
      return;
  }
  // Track the accumulated time that hasn't been simulated yet
  delta += timestamp - lastFrameTimeMs; // note += here
  lastFrameTimeMs = timestamp;

  // Simulate the total elapsed time in fixed-size chunks
  while (delta >= timestep) {
      //the following is done every "step"
      document.onkeydown = function() {
        switch (event.keyCode) {
        case 38:
            console.log("Up key is pressed");
            movePlayer('up')
            break;
        case 40:
            console.log("Down key is pressed");
            movePlayer('down')
            break;
        case 37:
            console.log("left key is pressed");
            movePlayer('left')
            break;
        case 39:
            console.log("Right key is pressed");
            movePlayer('right')
            break;
        }
      }
      delta -= timestep;
  }

  requestAnimationFrame(mainLoop);
}

//move player and run a single gaem step
function movePlayer(direction){
  //add to turns
  turnNumber += 1
  $('#turnText').text(turnNumber)

  //move enemies
  gameStep()

  //get player's new div
  let currentDiv = $('#player').parent()
  let divId = currentDiv[0].id
  let divPos = getPos(divId)

  let newY = Number(divPos[0])
  let newX = Number(divPos[1])
  switch(direction){
    case "up":
      newY -= 1
      break;
    case "down":
      newY += 1
      break;
    case "right":
      newX += 1
      break;
    case "left":
      newX -= 1
      break;
  }

  //move player to new div
  var player = $('#player')
  $('#'+newY+"_"+newX).append(player)
  console.log(player);
  console.log(newY+"_"+newX);
}

//run a game step
function gameStep(){
  //spawn enemies
  if(turnNumber % 5 === 0){
    foodSpawn()
    enemySpawn('row')
  } else if (turnNumber % 7 === 0) {
    enemySpawn('col')
  }

  //move enemies
  let rowClass = document.getElementsByClassName('enemyRow')
  let colClass = document.getElementsByClassName('enemyCol')
  if(rowClass.length){
    for (var i = 0; i < rowClass.length; i++) {
      let enemy = rowClass[i].parentElement
      let enemyPos = getPos(enemy.id)
      let move = rowClass[i].name
      //console.log(enemyPos);
      console.log(rowClass[i]);
      let oldDiv = $('#'+enemyPos[0]+"_"+enemyPos[1])
      let newX = enemyPos[0]
      let newY = Number(enemyPos[1]) + Number(move)
      console.log(newX);
      console.log(newY);
      $('#'+newX+"_"+newY).append(rowClass[i])
      console.log(oldDiv);
      //console.log(newDiv);
      //newDiv.appendChild(rowClass[i])
    }
  }

}

//spawn food
function foodSpawn() {
    // Randomly position the food, not on the perimeter
    let x = Math.floor(Math.random() * (roomSize-2)) + 1
    let y = Math.floor(Math.random() * (roomSize-2)) + 1

    let tempFood = document.createElement('div')
    tempFood.className = 'food'
    $('#' + x + '_' + y).append(tempFood)
}

//spawn an enemy
function enemySpawn(dir){
  min = Math.ceil(1);
  max = Math.floor(roomSize-1);
  let pos = Math.floor(Math.random() * (max - min)) + min;
  if(pos % 2 === 0){
    dir += 'A'
  } else {
    dir += 'B'
  }
  let tempEnemy = document.createElement('div')
  //attmpted to set an increasing age of each enemy to know if they had just spawned
  //tempEnemy.setAttribute('age', 0)
  switch(dir){
    case 'rowA':
      tempEnemy.className = 'enemyRow'
      tempEnemy.name = 1
      $('#'+pos+"_0").append(tempEnemy)
      break;
    case 'rowB':
      tempEnemy.className = 'enemyRow'
      tempEnemy.name = -1
      $('#'+pos+"_"+(roomSize-1)).append(tempEnemy)
      break;
    case 'colA':
      tempEnemy.className = 'enemyCol'
      tempEnemy.name = 1
      $('#0_'+pos).append(tempEnemy)
      break;
    case 'colB':
      tempEnemy.className = 'enemyCol'
      tempEnemy.name = -1
      $('#'+(roomSize-1)+'_'+pos).append(tempEnemy)
      break;
  }
}

//find a div's position by its assigned ID
function getPos(id){
  let arr = []
  for(let i =0; i< id.length; i ++){
    if(id.charAt(i) === "_"){
      arr.push(id.substring(0, i))
      arr.push(id.substring(i +1, id.length))
      return arr
    }
  }
}

//initialize the game
function drawWindow(){
  let window = $('#gameWindow')
  for(let x = 0;x < roomSize; x++){
    for(let y = 0;y < roomSize; y++){
      let tempDiv = document.createElement('div')
      tempDiv.className = 'gridBox'
      tempDiv.id = x +"_"+ y
      // tempDiv.style.width = gridSize = "px"
      // tempDiv.style.height = gridSize + "px"
      window.append(tempDiv)
    }
  }
  var player = document.createElement('div')
  player.id = 'player'
  $('#6_10').append(player)

}
