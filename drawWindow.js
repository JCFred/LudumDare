//initialize the game
function drawWindow() {
    let window = $('#gameWindow')
    for (let x = 0; x < roomSize; x++) {
        for (let y = 0; y < roomSize; y++) {
            let tempDiv = document.createElement('div')
            tempDiv.className = 'gridBox'
            tempDiv.id = x + '_' + y
            // tempDiv.style.width = gridSize = 'px'
            // tempDiv.style.height = gridSize + 'px'
            window.append(tempDiv)
        }
    }
    var player = document.createElement('div')
    player.id = 'player'
    $('#6_10').append(player)

}
