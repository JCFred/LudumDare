//run a game step
function gameStep() {
    if (turnNumber % 5 === 0) {
        enemySpawn('row')
        foodSpawn()
    } else if (turnNumber % 7 === 0) {
        enemySpawn('col')
    }
}

//spawn an enemy
function enemySpawn(dir) {
    let min = Math.ceil(0)
    let max = Math.floor(roomSize)
    let pos = Math.floor(Math.random() * (max - min)) + min
    if (pos % 2 === 0) {
        dir += 'A'
    } else {
        dir += 'B'
    }
    let tempEnemy = document.createElement('div')
    switch (dir) {
    case 'rowA':
        tempEnemy.className = 'enemyRow'
        $('#' + pos + '_0').append(tempEnemy)
        break
    case 'rowB':
        tempEnemy.className = 'enemyRow'
        $('#' + pos + '_' + (roomSize - 1)).append(tempEnemy)
        break
    case 'colA':
        tempEnemy.className = 'enemyCol'
        $('#0_' + pos).append(tempEnemy)
        break
    case 'colB':
        tempEnemy.className = 'enemyCol'
        $('#' + (roomSize - 1) + '_' + pos).append(tempEnemy)
        break
    }
}

function foodSpawn() {
    // Randomly position the food, not on the perimeter
    let x = Math.floor(Math.random() * (roomSize-2)) + 1
    let y = Math.floor(Math.random() * (roomSize-2)) + 1

    let tempFood = document.createElement('div')
    tempFood.className = 'food'
    $('#' + x + '_' + y).append(tempFood)
}
