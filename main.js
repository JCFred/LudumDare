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
  turnNumber = 0,
  hunger = 200;

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
            //up key pressed, turn player sprite and move
            playerSprite = "url(./Public/Sprites/phyto_up.png)"
            decrementHunger(1)
            movePlayer('up')
            break;
        case 40:
            //down key pressed, turn player sprite and move
            playerSprite = "url(./Public/Sprites/phyto_down.png)"
            decrementHunger(1)
            movePlayer('down')
            break;
        case 37:
            //left key pressed, turn player sprite and move
            playerSprite = "url(./Public/Sprites/phyto_left.png)"
            decrementHunger(1)
            movePlayer('left')
            break;
        case 39:
            //right key pressed, turn player sprite and move
            playerSprite = "url(./Public/Sprites/phyto_right.png) "
            decrementHunger(1)
            movePlayer('right')
            break;
        }
      }
      delta -= timestep;
  }

  // Reduce hunger
  decrementHunger(1)

  requestAnimationFrame(mainLoop);
}

function decrementHunger(amount) {
    hunger -= amount
    $('#hunger').css('width', hunger + 'px')
}

//move player and run a single gaem step
function movePlayer(direction){
  //add to turns
  turnNumber += 1
  $('#turnText').text(turnNumber)

  //move enemies
  gameStep()

  //get player's new div and position
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


  // Remove food div if player moves into food, reload page if player moves into enemy
  if($('#'+newY+"_"+newX).has('.food').length){
      hunger += 20
      $('#'+newY+"_"+newX).children('.food').remove()
  }
  if($('#'+newY+"_"+newX).has('.shrimpRow').length || $('#'+newY+"_"+newX).has('.shrimpCol').length){
      location.reload()
  }

  //move player to new div
  var player = $('#player')
  $('#'+newY+"_"+newX).append(player)
}

//run a game step
function gameStep(){
  //run every 3 steps
  if(turnNumber % 3 === 0){

  //run every 5 steps
  } else if(turnNumber % 5 === 0){
    snailSpawn()
    foodSpawn()
    enemySpawn('row')
  //run every 7 steps
  } else if (turnNumber % 7 === 0) {
    enemySpawn('col')
  }
  moveEnemies()
}

//run each enemy step
function moveEnemies(){
  //move row shrimps
  let rowClass = document.getElementsByClassName('shrimpRow')
  if(rowClass.length){
    for (var i = 0; i < rowClass.length; i++) {
      let enemy = rowClass[i].parentElement
      let enemyPos = getPos(enemy.id)
      let move = rowClass[i].name
      let oldDiv = $('#'+enemyPos[0]+"_"+enemyPos[1])
      let newX = enemyPos[0]
      let newY = Number(enemyPos[1]) + Number(move)
      if(newY === 0 || newY === roomSize -1){
        //oldDiv.removeChild(rowClass[i])
        rowClass[i].remove()
      } else {
        $('#'+newX+"_"+newY).append(rowClass[i])
      }
    }
  }
  //move column shrimps
  let colClass = document.getElementsByClassName('shrimpCol')
  if(colClass.length){
    for (var i = 0; i < colClass.length; i++) {
      let enemy = colClass[i].parentElement
      let enemyPos = getPos(enemy.id)
      let move = colClass[i].name
      let oldDiv = $('#'+enemyPos[0]+"_"+enemyPos[1])
      let newX = Number(enemyPos[0]) + Number(move)
      let newY = enemyPos[1]
      if(newX === 0 || newX === roomSize -1){
        colClass[i].remove()
      } else {
        $('#'+newX+"_"+newY).append(colClass[i])
      }
    }
  }
  //move snail
  let snails = document.getElementsByClassName('snailA')
  if(snails.length){
    for (var i = 0; i < snails.length; i++) {
      let parentDiv = snails[i].parentElement
      let oldDiv = getPos(parentDiv.id)
      let facing = snails[i].style.background
      //snail moves forward
      if(snails[i].name === 1){
        //facing left
        if(facing.substring(28,32) === "left"){
          let newX = Number(oldDiv[1]) -1
          let newY = Number(oldDiv[0])
          $('#'+newY+'_'+newX).append(snails[i])
          console.log("moving from: "+oldDiv[0]+","+oldDiv[1]+" to: "+newY+","+newX);
        //facing down
      } else if(facing.substring(28,32) === "down"){
          let newX = Number(oldDiv[1])
          let newY = Number(oldDiv[0]) +1
          $('#'+newY+'_'+newX).append(snails[i])
          console.log("moving from: "+oldDiv[0]+","+oldDiv[1]+" to: "+newY+","+newX);
        }
        snails[i].name = 0
      //snail turns
    } else if(snails[i].name === 0){
        if(facing.substring(28,32) === "left"){
          snails[i].style.background = "url(./Public/sprites/snail_down.png) 0px 0px"
        } else if(facing.substring(28,32) === "down"){
          snails[i].style.background = "url(./Public/sprites/snail_left.png) 0px 0px"
        }
        snails[i].name = 1
      }
    }
  }
}
//snail spawn
function snailSpawn(){
  let x = Math.floor(Math.random() * (12)) + 3
  let tempSnail = document.createElement('div')
  tempSnail.className = 'snailA'
  tempSnail.name = 1
  tempSnail.style.background = "url(./Public/sprites/snail_left.png) 0px 0px"
  $('#' + x + '_19').append(tempSnail)
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
      tempEnemy.className = 'shrimpRow'
      tempEnemy.name = 1
      $('#'+pos+"_0").append(tempEnemy)
      break;
    case 'rowB':
      tempEnemy.className = 'shrimpRow'
      tempEnemy.name = -1
      $('#'+pos+"_"+(roomSize-1)).append(tempEnemy)
      break;
    case 'colA':
      tempEnemy.className = 'shrimpCol'
      tempEnemy.name = 1
      $('#0_'+pos).append(tempEnemy)
      break;
    case 'colB':
      tempEnemy.className = 'shrimpCol'
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

//player animation
var playerSprite = "url(./Public/sprites/phyto_up.png) "
function spritePlayer() {
  var x = 0 - offsetPlayer
  var playerUp = document.querySelector("#player");
  playerUp.style.background = playerSprite + x + 'px 0px'
}
// sprite()
var offsetPlayer = 0
function animatePlayer(time) {
  var width = 32
  var height = 32
  if (offsetPlayer > 128) {
    offsetPlayer = 0
  }
  setInterval(function() {
      spritePlayer()
      offsetPlayer = offsetPlayer + width
  }, time)
}
animatePlayer(166)

//shrimp animation
var upShrimp = "url(./Public/sprites/shrimp_up.png) ",
  downShrimp = "url(./Public/sprites/shrimp_down.png) ",
  leftShrimp = "url(./Public/sprites/shrimp_left.png) ",
  rightShrimp = "url(./Public/sprites/shrimp_right.png) ",
  algaePic = "url(./Public/sprites/algae.png) "

function spriteShrimp() {
  var x = 0 - offset
  //left and right shrimps
  var shrimpR = document.getElementsByClassName("shrimpRow");
  if(shrimpR.length){
    for (var i = 0; i < shrimpR.length; i++) {
      if(shrimpR[i].name === 1){
        shrimpR[i].style.background = rightShrimp + x + 'px 0px'
      } else {
        shrimpR[i].style.background = leftShrimp + x + 'px 0px'
      }
    }
  }
  //up and down shrimps
  var shrimpC = document.getElementsByClassName("shrimpCol");
  if(shrimpC.length){
    for (var i = 0; i < shrimpC.length; i++) {
      if(shrimpC[i].name === 1){
        shrimpC[i].style.background = downShrimp + x + 'px 0px'
      } else {
        shrimpC[i].style.background = upShrimp + x + 'px 0px'
      }
    }
  }
  //animation for the algae
  var foodDivs = document.getElementsByClassName('food')
  if(foodDivs.length){
    for (var i = 0; i < foodDivs.length; i++) {
      foodDivs[i].style.background = algaePic + x + 'px 0px'
    }
  }
}
// sprite()
var offset = 0
function animateShrimp(time) {
  var width = 32
  var height = 32
  if (offset > 128) {
    offset = 0
  }
  setInterval(function() {
      spriteShrimp()
      offset = offset + width
  }, time)
}
animateShrimp(125)
