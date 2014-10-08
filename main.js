//**************************//

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.equal = function(othervector) {
    return (this.x == othervector.x)&&(this.y == othervector.y)
};

function Actor(pos, type) {
    this.pos = pos;
//    if(type)
//        this.type = type;
    this.type = type;
    this.status = null;
}

function newGame() {
    var grid = [];
    for(var i = 0; i < 3; i++) {
        var gridLine = [];
        for(var j = 0; j < 3; j++)
            gridLine.push(new Actor(new Vector(i, j)));
        grid.push(gridLine);
    }
    return grid;
}

var grid = newGame();

///**********************//

function elt(name, className) {
    var elt = document.createElement(name);
    if(className)
        elt.className = className;
    return elt;
}

function posToString(posCo) {
    if(!posCo )
        return 'one';
    else if(posCo == 1)
        return 'two';
    return 'three'
}

function gridToVector(target) {
    var x, y;
    var rowParent = target.parentNode;

    function switchName(elt) {
        var i;
        switch (elt.className) {
            case 'one': i = 0;
                break;
            case 'two': i = 1;
                break;
            case 'three': i = 2;
        }
        return i;
    }

    x = switchName(target.parentNode);
    y = switchName(target);

    return new Vector(x, y);
}

function drawGame() {
    var table = elt('table', 'background');

    var count = 0;
    grid.forEach(function(row){
        var rowName = posToString(row[count].pos.x);
        var rowElt = table.appendChild(elt('tr', rowName));

        row.forEach(function(actor) {
            var colName = posToString(actor.pos.y);
            rowElt.appendChild(elt('td', colName));
        });

        count++;
    });

    return table;
};

document.getElementById('game').appendChild(drawGame());

//***************//

function end(cc) {
    var whoWin = playerWin();
    if(whoWin == 'X') {
        restart('You Win!');
        return true;
    }
    else if(whoWin == 'O') {
        restart('Game over!');
        return true;
    }
    else if(cc.length == 9 ) {
        restart("It's a tie!");
        return true;
    }
    return false;
}

function playerWin() {
    var ch = 0;

    //check row
    for(var i = 0; i < 3; i++) {
        var gType = grid[i][0].type;
        var m = 0;
        if(gType) {
            for(var j = 0; j < 3; j++)
                if(gType == grid[i][j].type)
                    m++;
        }
        if(m == 3) {
            ch = gType;
            break;
        }
    }

    //check col
    if(!ch)
        for(var i = 0; i < 3; i++) {
            var gType = grid[0][i].type;
            if (gType) {
                var j = 0;
                while (gType == grid[j][i].type) {
                    j++;
                    if (j == 3) {
                        ch = gType;
                        break;
                    }
                }
            }
        }

    //check diagonal
    if(!ch) {
        var gType = grid[1][1].type;
        if((grid[0][0].type == gType && grid[2][2].type == gType)
            || (grid[0][2].type == gType && grid[2][0].type == gType))
            ch = gType;

    }

    return ch;
}

function restart(heading) {
    var divEnd = document.getElementsByTagName('div')[1];

    divEnd.className = 'end';

    var h = elt('h3');
    h.textContent = heading;

    var res = elt('a');

    res.setAttribute('href', '');
    res.textContent = 'Restart';

    divEnd.appendChild(h);
    divEnd.appendChild(res);
}

function xPlay() {
    var table = document.getElementById('game');

    table.addEventListener('click', function(event) {
        var cell = event.target;
        var xPos = gridToVector(cell);

        cell.className += ' clicked';
        var xIcon = elt('i', 'fa fa-times');
        cell.appendChild(xIcon);

        //grid[xPos.x][xPos.y] = findActorWithPos(xPos);
//        grid[xPos.x][xPos.y].type = 'X';
        grid[xPos.x][xPos.y] = new Actor(xPos, 'X');
        grid[xPos.x][xPos.y].status = 'clicked';

        setTimeout(oPlay, 500);
    })

}

function O() {
    var x = Math.floor(Math.random() * 3);
    var y = Math.floor(Math.random() * 3);
    return new Actor(new Vector(x, y), 'O');
}

function oPlay() {
    var clickedCell = [];
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if(grid[i][j].status == 'clicked')
                clickedCell.push(grid[i][j]);
        }
    }

    //first check
    if(end(clickedCell))
        return;

    var randomO = new O();
    for(var k = 0; ; k++) {
        if((randomO.pos).equal(clickedCell[k].pos)) {
            randomO = new O();
            k = -1;
        }
        else if (k == clickedCell.length - 1)
            break;
    }

    grid[randomO.pos.x][randomO.pos.y] = randomO;
    grid[randomO.pos.x][randomO.pos.y].status = 'clicked';

    var cssPos = ' .' + posToString(randomO.pos.x) + ' .' + posToString(randomO.pos.y);
    var cell = document.querySelector(cssPos);

    cell.className += ' comClick';
    var oIcon = elt('i', 'fa fa-circle-o');
    cell.appendChild(oIcon);

    //second check
    if(end(clickedCell))
        return;

}

function runGame() {
    xPlay();
}

runGame();

