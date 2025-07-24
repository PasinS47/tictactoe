
const board = document.querySelector(".game");
const title = document.querySelector(".title");
// const defaultBoard = `
//     <div class="one"></div>
//     <div class="two"></div>
//     <div class="three"></div>
//     <div class="four"></div>
//     <div class="five"></div>
//     <div class="six"></div>
//     <div class="seven"></div>
//     <div class="eight"></div>
//     <div class="nine"></div>
// `;

const mapList = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const curBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let path = [];
let curMove = "ex";
let isBot = false;
let botMove = 0;
let turn = 0;
let gameOver = false;

const map = {
    one: [[1, 2], [4, 8], [3, 6]],
    two: [[0, 2], [4, 7]],
    three: [[1, 0], [4, 6], [5, 8]],
    four: [[0, 6], [4, 5]],
    five: [[0, 8], [1, 7], [2, 6], [3, 5]],
    six: [[2, 8], [3, 4]],
    seven: [[0, 3], [2, 4], [7, 8]],
    eight: [[1, 4], [6, 8]],
    nine: [[0, 4], [2, 5], [6, 7]]
}

function checkWin(pos){
    let move = curMove === "ex" ? -1 : 1;
    for(const pair of map[pos]){
        if(curBoard[pair[0]] === move && curBoard[pair[1]] === move){
            return true;
        }
    }
    return false;
}

function handleClick(cell, index){
    if(gameOver || cell.classList.contains("ex") || cell.classList.contains("oh"))
        return;
    turn++;
    cell.innerHTML = curMove === "ex" ? "X" : "O";
    if(checkWin(mapList[index])){
        gameOver = true;
        title.innerHTML = `${cell.innerHTML} is the winner!`
        return;
    }
    if(turn === 9){
        gameOver = true;
        title.innerHTML = `Draw!`
    }
    curBoard[index] = curMove === "ex" ? -1 : 1;
    cell.classList.add(curMove);
    curMove = curMove === "ex" ? "oh" : "ex";
}

function clearBoard(){
    if(isBot)
        generateBot();
    title.innerHTML = "Tic Tac Toe";
    curMove = "ex";
    turn = 0;
    gameOver = false;
    board.innerHTML = "";
    for(let i=0;i < 9;i++){
        curBoard[i] = 0;
        let cur = document.createElement("div");
        cur.classList.add(mapList[i]);
        cur.addEventListener("click", function(){
            handleClick(this, i)
            if(!isBot)
                return;
            while(botMove < 9 && curBoard[path[botMove]] !== 0){
                botMove++;
            }
            handleClick(document.querySelector(`.${mapList[path[botMove]]}`), path[botMove]);
        })
        board.appendChild(cur);
    }
}

clearBoard();

function dfs(index, visited){
    if(visited[index] || path.length === 9)
        return;
    let pos = mapList[index];
    path.push(index);
    visited[index] = 1;
    for(const pair of map[pos]){
        if(visited[pair[0]] !== 0 && visited[pair[1]] !== 0)
            continue;
        dfs(pair[0], visited);
        dfs(pair[1], visited);
    }
}

function generateBot(){
    path = [];
    let visited = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    botMove = 0;
    dfs(Math.floor(Math.random() * 9), visited);
    if(Math.floor(Math.random() * 2) === 0){
        handleClick(document.querySelector(`.${mapList[path[botMove]]}`), path[botMove])
    }
}

document.querySelector("#reset").addEventListener("click", clearBoard);

document.querySelector("#bot").addEventListener("click", function(){
    clearBoard();
    if(isBot){
        isBot = false;
        this.innerHTML = "VS BOT";
        return;
    }
    isBot = true;
    this.innerHTML = "VS PLAYER";
    generateBot();
});