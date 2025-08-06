function Gameboard(){
    const rows = 3;
    const column = 3;
    const board = [];
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < column; j++){
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    const printBoard = () =>{
         const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    }

    const addValue = (row, cell, player) => {
        board[row][cell].addToken(player);
    }

    return {
        getBoard,
        addValue
    }
}

function Cell() {
  let value = '';

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}


function GameController(){

    let player1 = '';
    let player2 = '';

    const board = Gameboard();
    let players = [
        {
            name: player1,
            token: "X",
            score: 0
        },
        {
            name: player2,
            token: "O",
            score: 0
        }
    ];
    
    
    
    let activePLayer = players[0];
    const switchPlayer = () =>{
        activePLayer = activePLayer === players[0] ? players[1] : players[0];
    }

    const getActivePLayer = () => activePLayer;
    const getPlayers = () => players;
    const checkWin = () => {
        let tie = 0;
        const check = board.getBoard();
        for (let i = 0; i < 3; i++){
            let counter = 0
            let col = 0;
            let swing_left = 0;
            let swing_right = 2;
            let res = 0;
            for (let j = 0; j < 3; j++){
                if (check[i][j].getValue() === activePLayer.token){
                    counter++;
                    if (counter === 3){
                        console.log(`${activePLayer.name} won`);
                        resetGame(check);
                        winner();
                    }
                }
                if (check[j][i].getValue() === activePLayer.token){
                    col++;
                    if (col === 3){
                        console.log(`${activePLayer.name} won`);
                        resetGame(check);
                        winner();
                    }
                }
                if (check[swing_left][j].getValue() === activePLayer.token){
                    swing_left++;
                    if (swing_left === 3){
                        console.log(`${activePLayer.name} won`);
                        resetGame(check);
                        winner();
                    }
                }
                if (check[swing_right][j].getValue() === activePLayer.token){
                    swing_right--;
                    res++;
                    if (res === 3){
                        console.log(`${activePLayer.name} won`);
                        resetGame(check);
                        winner();
                    }
                }
                if (check[i][j].getValue() === "X" || check[i][j].getValue() === "O"){
                    tie++;
                    if (tie === 9 && counter < 3 && col < 3 && swing_left < 3 && res < 3){
                        resetGame(check);
                        Tie();
                    }
                }
            }
            
        }
    }

    const notify = document.querySelector(".notify");
    const resetGame = (check) => {
        notify.textContent = '';
        check.forEach((row)=>{
            row.forEach((cell, index) => {
                cell.addToken('');
            })
        })
    }

    const winner = () =>{
        notify.style.display = 'block';
        const notification = document.createElement("p");
        notification.textContent = `${activePLayer.name} won`
        notify.appendChild(notification);
        activePLayer.score++;
        switchPlayer();
        setTimeout(() => {
            notify.style.display = 'none';
        }, 2000);
    }

    const Tie = () =>{
        notify.style.display = 'block';
        const notification = document.createElement("p");
        notification.textContent = `Tie`
        notify.appendChild(notification);
        switchPlayer();
        setTimeout(() => {
            notify.style.display = 'none';
        }, 2000);
    }
    const playRound = (row, cell) => {
        board.addValue(row, cell, getActivePLayer().token);
        checkWin();
        switchPlayer();
    }

    return {
        resetGame,
        playRound,
        getPlayers,
        getActivePLayer,
        getBoard: board.getBoard
    }
}

function ScreenControl(){
    const turn = document.querySelector(".turn");
    const boardDiv = document.querySelector(".container");
    const score = document.querySelector(".score");
    const resetBoard = document.querySelector(".reset-board");
    const resetScore = document.querySelector(".reset-score");
    const form = document.querySelector("form");
    const main = document.querySelector("main");
    const game = GameController();

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePLayer = game.getActivePLayer();
        turn.textContent = `${activePLayer.name}'s turn`

        board.forEach((row, idx)=>{
            row.forEach((cell, index)=>{
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("box");
                cellBtn.dataset.cell = index;
                cellBtn.dataset.row = idx;
                const val = cell.getValue();
                if (val){
                    cellBtn.textContent= val;
                    cellBtn.disabled = true;
                    cellBtn.style.borderWidth = "2px";
                    cellBtn.style.borderColor = "black";
                }
                boardDiv.appendChild(cellBtn);
            })
        })
    }

    const updateScore = () =>{
        score.textContent = '';
        const players = game.getPlayers();
        players.forEach((player)=>{
            const scoreBoard = document.createElement("p");
            scoreBoard.textContent = `${player.name}: ${player.score}`
            score.appendChild(scoreBoard);
        })
    }

    function clickBoard(e){
        const selectedCell = e.target.dataset.cell;
        const selectedRow = e.target.dataset.row;
        if (!selectedCell || !selectedRow)
            return;
        game.playRound(selectedRow, selectedCell);
        updateScreen();
        updateScore();
    }

    function resetboard(){
        const check = game.getBoard();
        game.resetGame(check);
        updateScreen();
    }

    function resetscore(){
        const players = game.getPlayers();
        players.forEach((player)=>{
            player.score = 0;
        })
        updateScore();
    }

    function updateName(){
        const play0 = document.querySelector("#player1");
        const play1 = document.querySelector("#player2");
        const players = game.getPlayers();
        players[0].name = play0.value;
        players[1].name = play1.value;
        play0.value = '';
        play1.value = '';
    }

    boardDiv.addEventListener('click', clickBoard);
    resetBoard.addEventListener('click', resetboard);
    resetScore.addEventListener('click', resetscore);
    form.addEventListener('submit', e => {
        e.preventDefault();
        updateName();
        updateScreen();
        updateScore();
        form.style.display = 'none';
        main.style.display = 'block';   
    });
    updateScreen();
    updateScore();
    form.style.height = "100vh"; 
    form.style.width = "100vw";
    
}

ScreenControl();