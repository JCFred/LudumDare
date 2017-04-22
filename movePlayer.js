//move player and run a single gaem step
function movePlayer(direction) {
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
    switch (direction) {
    case 'up':
        newY -= 1
        break
    case 'down':
        newY += 1
        break
    case 'right':
        newX += 1
        break
    case 'left':
        newX -= 1
        break
    }

    //move player to new div
    var player = $('#player')
    $('#' + newY + '_' + newX).append(player)
    console.log(newY + '_' + newX)
}
