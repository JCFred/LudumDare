$(document).ready(function() {
  console.log("js connected")
  drawWindow()

  $('#gameWindow').click(function(event){
    console.log(event.target.id);
  })


})

//set game variables
var roomSize = 45,
  gridSize = 15

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

function movePlayer(direction){
  let currentDiv = $('#player').parent()
  let divId = currentDiv[0].id
  let divPos = getPos(divId)
  let newY = divPos[0]
  let newX = divPos[1]

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
  var player = $('#player')
  $('#'+newY+"_"+newX).append(player)
}

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
  $('#16_16').append(player)

}
