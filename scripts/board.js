 let matrix = [
    [0, "a", 3],
    [4, 5, 6],
    [7, 8, 9]
 ]

const ids = [
  "one","two","three","four","five",
  "six","seven","eight","nine"
];

const elements = ids.map(id => document.querySelector(`#${id}`));

function createPlayer(mark){
    let score = 0;
    const playerMark = mark;
    const getResult = () => {
        return score;
    }
    const giveResult = () => {
        return score++;
    }
    const return_mark = () => playerMark;

    return {getResult, giveResult, return_mark};
}
console.log(elements);
const player1 = createPlayer("x");
const player2 = createPlayer("o");
let counter = 0;
let tie = 1;
function checkWin(){
    if ((matrix[0][0] == matrix[0][1] && matrix[0][1] == matrix[0][2]) ||
        (matrix[1][0] == matrix[1][1] && matrix[1][1] == matrix[1][2]) ||
        (matrix[2][0] == matrix[2][1] && matrix[2][1] == matrix[2][2]) ||
        (matrix[0][0] == matrix[1][0] && matrix[1][0] == matrix[2][0]) ||
        (matrix[0][1] == matrix[1][1] && matrix[1][1] == matrix[2][1]) || 
        (matrix[0][2] == matrix[1][2] && matrix[1][2] == matrix[2][2]) ||
        (matrix[0][0] == matrix[1][1] && matrix[1][1] == matrix[2][2]) ||
        (matrix[0][2] == matrix[1][1] && matrix[1][1] == matrix[2][0]) 
    ) {
        if (counter % 2 === 0){
            player1.giveResult();
            document.querySelector(".p1").innerHTML = "Player 1: " + player1.getResult();
        }
        else {
            player2.giveResult();
             document.querySelector(".p3").innerHTML = "Player 2: " + player2.getResult();
        }
        resetGame();
    } else if (counter > 8){
        document.querySelector(".p2").innerHTML = "Tie: " + tie;
        tie++;
        resetGame(); 
    }
}

function resetGame(){
    elements.forEach((elem)=>{
        elem.textContent = '';
        elem.classList.remove("disable-btn");
    })
    matrix = [
    [0, "a", 3],
    [4, 5, 6],
    [7, 8, 9]
    ]
    counter = 0;
}

function addData(index, result){
    switch(index){
        case 0:
            matrix[0][0] = result;
            break;
        case 1:
            matrix[0][1] = result;
            break;
        case 2:
            matrix[0][2] = result;
            break;
        case 3:
            matrix[1][0] = result;
            break;
        case 4:
            matrix[1][1] = result;
            break;
        case 5:
            matrix[1][2] = result;
            break;
        case 6:
            matrix[2][0] = result;
            break;
        case 7:
            matrix[2][1] = result;
            break;
        case 8:
            matrix[2][2] = result;
            break
    }
}

elements.forEach((elem, index)=>{
    elem.addEventListener('click',()=>{
        if (counter % 2 == 0){
            elem.textContent = "X";
            addData(index, 1)
        }   
        else {
            elem.textContent = "O";
            addData(index, 2);
        }
        elem.classList.add("disable-btn");
        counter++;
        checkWin();
    })
})  

