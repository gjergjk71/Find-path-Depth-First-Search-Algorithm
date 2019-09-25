// dfs

const EMPTY = 0;
const OBSTACLE = 1;
const EMPTY_AND_ALREADY_WALKED = 2;

const posCalc = (pos, x, y) => [pos[0] + x, pos[1] + y]
const samePos = (pos1, pos2) => pos1[0] === pos2[0] && pos1[1] === pos2[1];
const isNotUndefined = (pos, grid) => {
    try {
        let item = grid[pos[0]][pos[1]]
        if (item === undefined) return false
        return true;
    } catch { return false }
}


const getWalkableMoves = (pos, grid) => {
    let moves = [
        posCalc(pos, 1, 0),
        posCalc(pos, -1, 0),
        posCalc(pos, 0, -1),
        posCalc(pos, 0, 1)
    ]
    moves = moves.filter(pos => isNotUndefined(pos, grid))
    return moves.filter(pos => grid[pos[0]][pos[1]] === EMPTY);
}

function dfs(grid, startPos, endPos, currentPos, path) {
    let cPos = currentPos || startPos
    let cPath = path || [];
    grid[cPos[0]][cPos[1]] = EMPTY_AND_ALREADY_WALKED

    if (samePos(cPos, endPos)) {
        return path;
    }

    let children = getWalkableMoves(cPos, grid);
    let len = children.length;

    for (var i = 0; i < len; i++) {
        var foundNode = dfs(grid, startPos, endPos, children[i], cPath.concat([children[i]]));
        if (foundNode) {
            return foundNode;
        }
    }
    return null;
}

var gridSize = 7;
var grid = [];
for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
        grid[i][j] = EMPTY;
    }
}

grid[0][1] = OBSTACLE

let a = dfs(grid, [0, 0], [2, 5]);
console.log(a)