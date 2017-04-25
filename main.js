$(document).ready(function() {
  console.log("js connected")
  drawWindow()

  $('#gameWindow').click(function(event){
    console.log(event.target.id);
  })
  spawnSun()
})

//set game variables
var roomSize = 20,
  gridSize = 35,
  turnNumber = 0,
  hunger = 200,
  seconds = 0,
  minutes = 0


//game step engine variables
var timestep = 1000/5, //this sets the speed to 30 fps
    delta = 0,
    lastFrameTimeMs = 0, // The timestamp in milliseconds of the last time the main loop was run.
    maxFPS = 5;

//TEST for startStarBoss
function spawnStar(){
  let tempStar = document.createElement('div')
  tempStar.className = 'starfish'
  tempStar.setAttribute("dir", "down")
  tempStar.style.background = "url(./Public/sprites/starfish.png) 0px 0px"
  $('#3_3').append(tempStar)
}

//TEST for startFishBoss
function spawnFish(){
  let tempFish = document.createElement('div')
  tempFish.className = 'bigfish'
  tempFish.setAttribute("dir", "right")
  tempFish.style.background = "url(./Public/sprites/fish_right.png) 0px 0px"
  $('#6_6').append(tempFish)
}

//TEST for spawnSunSpot
function spawnSun(){
  let tempSun = document.createElement('div')
  tempSun.className = "sunSpot"
  tempSun.style.background = "url(./Public/sprites/sunlight.png) 0px 0px"
  let rand = Math.floor(Math.random() * (roomSize -2)) +2
  $('#0_'+rand).append(tempSun)
}

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
    seconds += .3
    if(seconds >= 60){
      seconds = 0
      minutes += 1
    }
    $("#time").text(minutes+ ":" +Math.floor(seconds))
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

  // Check hunger
  checkHunger()

  // Reduce hunger
  decrementHunger(1)

  requestAnimationFrame(mainLoop);
}

function decrementHunger(amount) {
    hunger -= amount
    $('#hunger').css('width', hunger + 'px')
}

function checkHunger(){
    if(hunger <= 0)
        location.reload()
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


  // Remove food div if player moves into food, create poop div, reload page if player moves into enemy
  if($('#'+newY+"_"+newX).has('.food').length){
      hunger += 20

      // Make sure hunger isn't over 200
      if(hunger > 200)
        hunger = 200

      $('#'+newY+"_"+newX).children('.food').remove()
      //poopSpawn('#'+newY+"_"+newX)
  }else if($('#'+newY+"_"+newX).has('.poop').length){
      hunger -= 20
      $('#'+newY+"_"+newX).children('.poop').remove()
  }else if($('#'+newY+"_"+newX).children().length){
      location.reload()
  }

  //move player to new div
  var player = $('#player')
  $('#'+newY+"_"+newX).append(player)
}

function checkEnemies(newX, newY){
    if($('#'+newY+"_"+newX).has('div').length){
        $('#'+newY+"_"+newX).children('div').remove()
        piecesSpawn('#'+newY+"_"+newX)
    }
}

//run a game step
function gameStep(){
  if(minutes < 1){
    //run every 3 steps
    if(turnNumber % 3 === 0){
      enemySpawn('row')
      enemySpawn('col')
      foodSpawn()
    //run every 5 steps
    }else if(turnNumber % 5 === 0) {
      squidSpawn()
      snailSpawn()
    }
  } else if(minutes === 1){
    let stars = document.getElementsByClassName('starfish')
    if(stars.lengths === 0){
      spawnStar()
    }
    //run every 3 steps
    if(turnNumber % 3 === 0){
      squidSpawn()
      foodSpawn()
      enemySpawn('row')
      enemySpawn('col')
    //run every 5 steps
    } else if(turnNumber % 5 === 0){
      snailSpawn()
    }
  } else if (minutes > 2){
    let fish = document.getElementsByClassName('bigfish')
    if(!fish.lengths){
      spawnFish()
    }
    if(turnNumber % 3 === 0){
      squidSpawn()
      foodSpawn()
      enemySpawn('row')
      enemySpawn('col')
      snailSpawn()
    //run every 5 steps
    }
  }
  moveEnemies()
  moveStar()
  moveBigFish()
  moveSun()
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
      // Enemy eats the food and poops
      if($('#'+newY+"_"+newX).has('.food').length){
          $('#'+newY+"_"+newX).children('.food').remove()
          poopSpawn('#'+newY+"_"+newX)
      }
      // If enemy hits another enemy, remove both and append pieces
      checkEnemies(newX, newY)
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
      // Enemy eats the food and poops
      if($('#'+newY+"_"+newX).has('.food').length){
          $('#'+newY+"_"+newX).children('.food').remove()
          poopSpawn('#'+newY+"_"+newX)
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
      //snail moves forward the way it is facing
      if(snails[i].name === 1){
        if(snails[i].getAttribute('face') === "right"){
          let newX = Number(oldDiv[1]) +1
          let newY = Number(oldDiv[0])
          if(newX >= 19 || newX <= 0 || newY >= 19 || newY <= 0){
            snails[i].remove()
          } else {
            snails[i].name = 0
            $('#'+newY+'_'+newX).append(snails[i])
          }
        } else if(snails[i].getAttribute('face') === "up"){
          let newX = Number(oldDiv[1])
          let newY = Number(oldDiv[0]) -1
          if(newX >= 19 || newX <= 0 || newY >= 19 || newY <= 0){
            snails[i].remove()
          } else {
            snails[i].name = 0
            $('#'+newY+'_'+newX).append(snails[i])
          }
        } else if(snails[i].getAttribute('face') === "left"){
          let newX = Number(oldDiv[1]) -1
          let newY = Number(oldDiv[0])
          if(newX >= 19 || newX <= 0 || newY >= 19 || newY <= 0){
            snails[i].remove()
          } else {
            snails[i].name = 0
            $('#'+newY+'_'+newX).append(snails[i])
          }
        } else if(snails[i].getAttribute('face') === "down"){
          let newX = Number(oldDiv[1])
          let newY = Number(oldDiv[0]) +1
          if(newX >= 19 || newX <= 0 || newY >= 19 || newY <= 0){
            snails[i].remove()
          } else {
            snails[i].name = 0
            $('#'+newY+'_'+newX).append(snails[i])
          }
        }
    //snail turns
    } else if(snails[i].name === 0){
      //spawned left, moving right
      if(snails[i].getAttribute('dir') === "left"){
        if(snails[i].getAttribute('face') === "right"){
          //face up or down
          let ranDir = getDir(0)
          snails[i].setAttribute("face", ranDir)
        } else {
          //face right
          snails[i].setAttribute("face", "right")
        }
      //spawned up, moving down
      } else if(snails[i].getAttribute('dir') === "up"){
        if(snails[i].getAttribute('face') === "down"){
          //face left or right
          let ranDir = getDir(1)
          snails[i].setAttribute("face", ranDir)
        } else {
          //face down
          snails[i].setAttribute("face", "down")
        }
      //spawned right, moving left
      } else if(snails[i].getAttribute('dir') === "right"){
        if(snails[i].getAttribute('face') === "left"){
          //face up or down
          let ranDir = getDir(0)
          snails[i].setAttribute("face", ranDir)
        } else {
          //face left
          snails[i].setAttribute("face", "left")
        }
      //spawn down, moving up
      }else if(snails[i].getAttribute('dir') === "down"){
        if(snails[i].getAttribute('face') === "up"){
          //face left or right
          let ranDir = getDir(1)
          snails[i].setAttribute("face", ranDir)
        } else {
          //face up
          snails[i].setAttribute("face", "up")
        }
      }
        snails[i].name = 1
      }
    }
  }

  //move squids
  let squids = document.getElementsByClassName('squid')
  if(squids.length){
    for (var i = 0; i < squids.length; i++) {
      let parentDiv = squids[i].parentElement
      let oldDiv = getPos(parentDiv.id)
      //move down left
      if(squids[i].name === 0){
        let newY = +oldDiv[0] +1
        let newX = +oldDiv[1] +1
        // Enemy eats the food and poops
        if($('#'+newY+"_"+newX).has('.food').length){
            $('#'+newY+"_"+newX).children('.food').remove()
            poopSpawn('#'+newY+"_"+newX)
        }
        checkMove(newX, newY, squids[i])
      //move down right
      } else if(squids[i].name === 1){
        let newY = +oldDiv[0] +1
        let newX = +oldDiv[1] -1
        // Enemy eats the food and poops
        if($('#'+newY+"_"+newX).has('.food').length){
            $('#'+newY+"_"+newX).children('.food').remove()
            poopSpawn('#'+newY+"_"+newX)
        }
        checkMove(newX, newY, squids[i])
      //move up left
      } else if(squids[i].name === 2){
        let newY = +oldDiv[0] -1
        let newX = +oldDiv[1] -1
        // Enemy eats the food and poops
        if($('#'+newY+"_"+newX).has('.food').length){
            $('#'+newY+"_"+newX).children('.food').remove()
            poopSpawn('#'+newY+"_"+newX)
        }
        checkMove(newX, newY, squids[i])
      //move up right
      } else if(squids[i].name === 3){
        let newY = +oldDiv[0] -1
        let newX = +oldDiv[1] +1
        // Enemy eats the food and poops
        if($('#'+newY+"_"+newX).has('.food').length){
            $('#'+newY+"_"+newX).children('.food').remove()
            poopSpawn('#'+newY+"_"+newX)
        }
        checkMove(newX, newY, squids[i])
      }
    }
  }
}

//move sunSpot
function moveSun(){
  let sunSpot = document.getElementsByClassName('sunSpot')
  if(sunSpot.length){
    let parentDiv = sunSpot[0].parentElement
    let oldDiv = getPos(parentDiv.id)
    let newY = +oldDiv[0] +1
    if(newY >= roomSize -1){
      sunSpot[0].remove()
    } else {
      let newDiv = $('#'+newY+"_"+oldDiv[1])
      newDiv.append(sunSpot[0])
      console.log(newDiv.children)
    }
  }
}

//move the Starfish Boss
function moveStar(){
  let star = document.getElementsByClassName('starfish')
  if(star.length){
    let parentDiv = star[0].parentElement.id
    let oldDiv = getPos(parentDiv)
    if(star[0].getAttribute("dir") === "down"){
      let newY = +oldDiv[0] +1
      let newX = +oldDiv[1]
      $('#'+newY+"_"+newX).append(star[0])
      if(newY+1 >= roomSize -3){
        star[0].setAttribute("dir", "right")
      }
    }else if(star[0].getAttribute("dir") === "left"){
      let newY = +oldDiv[0]
      let newX = +oldDiv[1] -1
      $('#'+newY+"_"+newX).append(star[0])
      if(newX-1 <= 2){
        star[0].setAttribute("dir", "down")
      }
    }else if(star[0].getAttribute("dir") === "up"){
      let newY = +oldDiv[0] -1
      let newX = +oldDiv[1]
      $('#'+newY+"_"+newX).append(star[0])
      if(newY-1 <= 2){
        star[0].setAttribute("dir", "left")
      }
    }else if(star[0].getAttribute("dir") === "right"){
      let newY = +oldDiv[0]
      let newX = +oldDiv[1] +1
      $('#'+newY+"_"+newX).append(star[0])
      if(newX+1 >= roomSize -3){
        star[0].setAttribute("dir", "up")
      }
    }
  }
}

//move the Big Fish
function moveBigFish(){
  let bigFish = document.getElementsByClassName('bigfish')
  if(bigFish.length){
    let parentDiv = bigFish[0].parentElement.id
    let oldDiv = getPos(parentDiv)
    if(bigFish[0].getAttribute("dir") === "down"){
      let newY = +oldDiv[0] +1
      let newX = +oldDiv[1]
      $('#'+newY+"_"+newX).append(bigFish[0])
      if(newY+1 >= roomSize -7){
        bigFish[0].setAttribute("dir", "left")
      }
    }else if(bigFish[0].getAttribute("dir") === "left"){
      let newY = +oldDiv[0]
      let newX = +oldDiv[1] -1
      $('#'+newY+"_"+newX).append(bigFish[0])
      if(newX-1 <= 6){
        bigFish[0].setAttribute("dir", "up")
      }
    }else if(bigFish[0].getAttribute("dir") === "up"){
      let newY = +oldDiv[0] -1
      let newX = +oldDiv[1]
      $('#'+newY+"_"+newX).append(bigFish[0])
      if(newY-1 <= 6){
        bigFish[0].setAttribute("dir", "right")
      }
    }else if(bigFish[0].getAttribute("dir") === "right"){
      let newY = +oldDiv[0]
      let newX = +oldDiv[1] +1
      $('#'+newY+"_"+newX).append(bigFish[0])
      if(newX+1 >= roomSize -7){
        bigFish[0].setAttribute("dir", "down")
      }
    }
  }
}

//squid spawn
function squidSpawn(){
  let tempSquid = document.createElement('div')
  tempSquid.className = 'squid'
  tempSquid.style.background = "url(./Public/sprites/squid.png) 0px 0px"
  let randPos = Math.floor(Math.random() * (roomSize/2)) + 1
  let spot = Math.floor(Math.random() * (8))
  switch(spot){
    case 0:
    //left on the top
      tempSquid.name = 0
      $('#' + randPos + '_0').append(tempSquid)
      break;
    case 1:
    //top on the left
      tempSquid.name = 0
      $('#0_' + randPos).append(tempSquid)
      break;
    case 2:
    //top on the right
      tempSquid.name = 1
      $('#0_' + ((roomSize/2)+randPos)).append(tempSquid)
      break;
    case 3:
    //right on the top
      tempSquid.name = 1
      $('#' + randPos + '_19').append(tempSquid)
      break;
    case 4:
    //right on the bottom
      tempSquid.name = 2
      $('#' + ((roomSize/2)+randPos) + '_19').append(tempSquid)
      break;
    case 5:
    //bottom on the right
      tempSquid.name = 2
      $('#19_' + ((roomSize/2)+randPos)).append(tempSquid)
      break;
    case 6:
    //bottom on the left
      tempSquid.name = 3
      $('#19_' + randPos).append(tempSquid)
      break;
    case 7:
    //left on the bottom
      tempSquid.name = 3
      $('#'+((roomSize/2)+randPos)+"_0").append(tempSquid)
      break;
  }
}

//snail spawn
function snailSpawn(){
  let randPos = Math.floor(Math.random() * (17)) + 1
  let side = Math.floor(Math.random() * (4))
  let tempSnail = document.createElement('div')
  tempSnail.className = 'snailA'
  tempSnail.name = 1
  switch(side){
    case 0:
      tempSnail.setAttribute("dir", 'left')
      tempSnail.setAttribute("face", 'right')
      tempSnail.style.background = "url(./Public/sprites/snail_right.png) 0px 0px"
      $('#' + randPos + '_0').append(tempSnail)
      break;
    case 1:
      tempSnail.setAttribute("dir", 'up')
      tempSnail.setAttribute("face", 'down')
      tempSnail.style.background = "url(./Public/sprites/snail_down.png) 0px 0px"
      $('#0_'+randPos).append(tempSnail)
      break;
    case 2:
      tempSnail.setAttribute("dir", 'right')
      tempSnail.setAttribute("face", 'left')
      tempSnail.style.background = "url(./Public/sprites/snail_left.png) 0px 0px"
      $('#' + randPos + '_19').append(tempSnail)
      break;
    case 3:
      tempSnail.setAttribute("dir", 'down')
      tempSnail.setAttribute("face", 'up')
      tempSnail.style.background = "url(./Public/sprites/snail_up.png) 0px 0px"
      $('#19_'+randPos).append(tempSnail)
      break;
  }
}

//spawn food
function foodSpawn() {
    // Randomly position the food, not on the perimeter
    let x = Math.floor(Math.random() * (roomSize-2)) + 1
    let y = Math.floor(Math.random() * (roomSize-2)) + 1

    let tempFood = document.createElement('div')
    tempFood.className = 'food'
    if($('#' + x + '_' + y).children().length){
        foodSpawn()
    }else{
        $('#' + x + '_' + y).append(tempFood)
    }
}

// Spawn poop
function poopSpawn(location) {
    // Position the poop where the player left
    let poop = document.createElement('div')
    poop.className = 'poop'
    $(location).append(poop)
}

// Spawn pieces
function piecesSpawn(location) {
    // Position the poop where the player left
    let pieces = document.createElement('div')
    pieces.className = 'pieces'
    $(location).append(pieces)
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

//check for edge of room, then move the enemy
function checkMove(xx, yy, obj){
  if(xx >= 19 || xx <= 0 || yy >= 19 || yy <= 0){
    obj.remove()
  } else {
    $('#'+yy+'_'+xx).append(obj)
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

//return either 1 or -1
function getDir(dir){
  let temp = Math.floor(Math.random() * (2))
  if(temp === 0){
    if(dir === 0){
      return "up"
    } else {
      return "right"
    }
  } else {
    if(dir === 0){
      return "down"
    } else {
      return "left"
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
var offset = 0
function animateShrimp(time) {
  var width = 32
  var height = 32
  if (offset > 256) {
    offset = 0
  }
  setInterval(function() {
      spriteShrimp()
      offset = offset + width
  }, time)
}
animateShrimp(125)


//Snail animations
function spriteSnail() {
  var x = 0 - snailOffset
  //left and right shrimps
  let snails = document.getElementsByClassName("snailA");
  if(snails.length){
    for (var i = 0; i < snails.length; i++) {
      let facing = snails[i].getAttribute("face")
      snails[i].style.background = "url(./Public/sprites/snail_"+facing+".png) "+x+"px 0"
    }
  }
}
let snailOffset = 0
function animateSnail(time) {
  let width = 32
  let height = 32
  if (snailOffset > 128) {
    snailOffset = 0
  }
  setInterval(function() {
      spriteSnail()
      snailOffset = snailOffset + width
  }, time)
}
animateSnail(250)

//Squid animations
function spriteSquid() {
  let x = 0 - squidOffset
  let squids = document.getElementsByClassName("squid");
  if(squids.length){
    for (var i = 0; i < squids.length; i++) {
      squids[i].style.background = "url(./Public/sprites/squid.png) "+x+"px 0"
    }
  }
}
var squidOffset = 0
function animateSquid(time) {
  let width = 32
  let height = 32
  if (squidOffset > 160) {
    squidOffset = 0
  }
  setInterval(function() {
      spriteSquid()
      squidOffset = squidOffset + width
  }, time)
}
animateSquid(125)

//poop animations
function spritePoop() {
  let x = 0 - poopOffset
  let poops = document.getElementsByClassName("poop");
  if(poops.length){
    for (var i = 0; i < poops.length; i++) {
      poops[i].style.background = "url(./Public/sprites/detritus.png) "+x+"px 0"
    }
  }
}
var poopOffset = 0
function animatePoop(time) {
  let width = 32
  let height = 32
  if (poopOffset > 160) {
    poopOffset = 0
  }
  setInterval(function() {
      spritePoop()
      poopOffset = poopOffset + width
  }, time)
}
animatePoop(166)

//starfish animations
function spriteStar() {
  let x = 0 - starOffset
  let star = document.getElementsByClassName("starfish");
  if(star.length){
    star[0].style.background = "url(./Public/sprites/starfish.png) "+x+"px 0"
  }
}
var starOffset = 0
function animateStar(time) {
  let width = 96
  let height = 96
  if (starOffset > 385) {
    starOffset = 0
  }
  setInterval(function() {
      spriteStar()
      starOffset = starOffset + width
  }, time)
}
animateStar(125)

//bigfish animations
function spriteBigFish() {
  let x = 0 - bigFishOffset
  let bigFish = document.getElementsByClassName("bigfish");
  if(bigFish.length){
    let facing = bigFish[0].getAttribute("dir")
    bigFish[0].style.background = "url(./Public/sprites/fish_"+facing+".png) "+x+"px 0"
  }
}
var bigFishOffset = 0
function animateBigFish(time) {
  let width = 96
  let height = 96
  if (bigFishOffset > 672) {
    bigFishOffset = 0
  }
  setInterval(function() {
      spriteBigFish()
      bigFishOffset = bigFishOffset + width
  }, time)
}
animateBigFish(200)

//Sunspot animaition
function spriteSun() {
  let x = 0 - sunOffset
  let sunSpot = document.getElementsByClassName("sunSpot");
  if(sunSpot.length){
    let facing = sunSpot[0].getAttribute("dir")
    sunSpot[0].style.background = "url(./Public/sprites/sunlight.png) "+x+"px 0"
  }
}
var sunOffset = 0
function animateSun(time) {
  let width = 32
  let height = 32
  if (sunOffset > 448) {
    sunOffset = 0
  }
  setInterval(function() {
      spriteSun()
      sunOffset = sunOffset + width
  }, time)
}
animateSun(200)
