const boxes = document.getElementsByClassName("button");
const turnText = document.getElementById("turn");
const resetBtn = document.getElementById("reset");
const winnerText = document.getElementById("winner");
const turns = ['X', 'O'];
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
let currentTurn = 0;
for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function (){
        if (boxes[i].innerText === "") {
            boxes[i].innerText = turns[currentTurn];
            if (currentTurn == 0) {
                currentTurn = 1;
                turnText.textContent = "Turn: O";
            } else {
                currentTurn = 0;
                turnText.textContent = "Turn: X";
            }
        }
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (boxes[a, b, c].innerText != "") {
                checkWin();
            }
        }
    });
}
resetBtn.addEventListener("click", function() {
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].innerText = "";
    }
    winnerText.textContent = "";
    turnText.textContent = "Turn: X";
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].disabled = false;
    }
    currentTurn = 0;
});
function checkWin() {    
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        const valA = boxes[a].innerText;
        const valB = boxes[b].innerText;
        const valC = boxes[c].innerText;
        const allSame = valA === valB && valB === valC;
        if (valA != "" && allSame) {
            winnerText.textContent = valA + " won!";
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].disabled = true;
            }
        }
        let filled = 0;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].textContent != "") {
                filled++;
            }
        }
        if (filled == 9 && !allSame) {
            winnerText.textContent = "Draw.";
        }
    }
}