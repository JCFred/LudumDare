//set game variables
var roomSize = 20,
    gridSize = 35,
    turnNumber = 0

//game step engine variables
var timestep = 1000 / 5, //this sets the speed to 30 fps
    delta = 0,
    lastFrameTimeMs = 0, // The timestamp in milliseconds of the last time the main loop was run.
    maxFPS = 5

$(document).ready(function() {
    console.log('js connected')
    drawWindow()

    $('#gameWindow').click(function(event) {
        console.log(event.target.id)
    })


})

requestAnimationFrame(mainLoop)
//main game loop and engine
function mainLoop(timestamp) {
    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop)
        return
    }
    // Track the accumulated time that hasn't been simulated yet
    delta += timestamp - lastFrameTimeMs // note += here
    lastFrameTimeMs = timestamp

    // Simulate the total elapsed time in fixed-size chunks
    while (delta >= timestep) {
        //the following is done every 'step'
        document.onkeydown = function() {
            switch (event.keyCode){
            case 38:
                console.log('Up key is pressed')
                movePlayer('up')
                break
            case 40:
                console.log('Down key is pressed')
                movePlayer('down')
                break
            case 37:
                console.log('left key is pressed')
                movePlayer('left')
                break
            case 39:
                console.log('Right key is pressed')
                movePlayer('right')
                break
            }
        }
        delta -= timestep
    }

    requestAnimationFrame(mainLoop)
}

//find a div's position by its assigned ID
function getPos(id) {
    let arr = []
    for (let i = 0; i < id.length; i++) {
        if (id.charAt(i) === '_') {
            arr.push(id.substring(0, i))
            arr.push(id.substring(i + 1, id.length))
            return arr
        }
    }
}
