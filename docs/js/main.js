function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

const findPath = async (speed,grid, startPos, endPos, currentPos, path) => {
    console.log({repr:JSON.stringify(grid)})
    let cPos = currentPos || startPos
    let cPath = path || [];
    console.log(grid,cPos)
    grid[cPos[0]][cPos[1]] = EMPTY_AND_ALREADY_WALKED

    if (speed) {
        await sleep(speed)
    }

    if (samePos(cPos, endPos)) {
        colorPath(path);
        colorItem(endPos, "green")
        console.log("FINISHED",path,endPos)
        return path;
    }
    if (!samePos(cPos, startPos)) {
        document.getElementById(`item-${cPos[0]}-${cPos[1]}`).style.backgroundColor = "gray";
    }
    let children = getWalkableMoves(cPos, grid);
    let len = children.length;

    for (var i = 0; i < len; i++) {
        var foundNode = await findPath(speed,grid, startPos, endPos, children[i], cPath.concat([children[i]]));
        if (foundNode) {
            return foundNode;
        }
    }
    return null;
}

const colorItem = (pos,color) => {
    document.getElementById(`item-${pos[0]}-${pos[1]}`).style.backgroundColor  = color
}

const colorPath = path => {
    for (p of path){
        colorItem(p,"purple")
    }
}

const createGrid = gridSize => {
    var grid = [];
    for (var i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (var j = 0; j < gridSize; j++) {
            grid[i][j] = EMPTY;
        }
    }
    console.log(grid)
    return grid;
}

let table = document.getElementById("table");

const resetGrid = grid => {
    for (let x=0;x<grid.length;x++){
        let row = grid[x];
        for (let y=0;y<row.length;y++){
            let item = row[y];
            if (item === EMPTY_AND_ALREADY_WALKED){
                grid[x][y] = EMPTY;
            }
        }
    }
    return grid;
}

const onItemClick = (e,grid) => {
    console.log(e.target.id, grid);
    let [x, y] = e.target.id.split("-").slice(1).map(x => Number(x));
    let item = grid[x][y];
    if (item === OBSTACLE){
        grid[x][y] = EMPTY;
        e.target.style.backgroundColor = "";
    } else {
        grid[x][y] = OBSTACLE
        e.target.style.backgroundColor = "black";
    }
    let startPos = JSON.parse(document.getElementById("start_pos").value)
    let endPos = JSON.parse(document.getElementById("end_pos").value)
    let sleep = Number(document.getElementById("speed").value);

    grid = resetGrid(grid);
    visualizeGrid(grid)
    findPath(sleep,grid,startPos, endPos)
    colorItem(startPos, "blue")
    colorItem(endPos, "green")
}

const visualizeGrid = grid => {
    console.log(grid)
    table.innerHTML = ""
    for (var i = 0; i < grid.length; i++) {
        let row = document.createElement("tr");
        for (var j = 0; j < grid[i].length; j++) {
            console.log(555)
            let item = document.createElement("td")
            item.className = "vert hori";
            item.id = `item-${i}-${j}`
            item.style.backgroundColor = grid[i][j] === OBSTACLE ? "black" : ""
            item.onclick = e => onItemClick(e,grid);
            row.appendChild(item);
        }
        table.appendChild(row)
    }
}

let settingsForm = document.getElementById("settingsForm");
settingsForm.onsubmit = e => {
    e.preventDefault();
    let grid_size = Number(document.getElementById("grid_size").value)
    let grid = createGrid(grid_size);
    visualizeGrid(grid)
    let startPos = JSON.parse(document.getElementById("start_pos").value)
    let endPos = JSON.parse(document.getElementById("end_pos").value)
    let sleep = Number(document.getElementById("speed").value);
    findPath(sleep,grid,startPos, endPos)
    colorItem(startPos, "blue")
    colorItem(endPos, "green")
}