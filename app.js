import Board from "./board.js";
import Levels from "./levels.js"

const app = new PIXI.Application(
    {
        width: window.innerWidth*0.65,
        height: window.innerHeight * 0.96,
        //     width: 100,
        //     height: 40,
        resolution: devicePixelRatio = 5,
        backgroundColor: 0x000000,
        autoDensity: true,
    }
)

app.ticker.maxFPS = 12;

// tell the html document to display the pixi application
document.body.appendChild(app.view);


app.view.style.position = 'absolute';
app.view.style.left = '16.5%';
app.view.style.top = '10%';
// app.view.style.transform = 'translate(-50%, 0%)';
app.view.style.overflow = "hidden";
app.view.style.border = '5px solid black'



// declaring constant vars
const dimension = 40;
const grid_height = Math.floor(window.innerHeight / dimension);
const grid_width = Math.floor(window.innerWidth / dimension);

// create the board
let board = new Board(grid_height, grid_width, dimension, app, 'green');
let levels = new Levels(board);
board.createMatrix();
window.addEventListener("mousedown", () => {board.changeMode('mousedown')});
window.addEventListener("mouseup", () => {board.changeMode('mouseup')});


window.addEventListener("keydown", onKeyDown)

function onKeyDown(event) {
        // console.log(event.key)
        board.onKeyPress(event.key)
}

const valueInput = document.getElementById('value');
valueInput.onchange = () => {
        console.log(valueInput.value);
        (board.changeValue(valueInput.value));
}

        const selectButton = document.getElementById('SelectButton')
        selectButton.onclick = () => {
                board.changeSelection('Select');
        }

        const wireButton = document.getElementById('WireButton');
        wireButton.onclick = () => {
                board.changeSelection('Wire');
        }
        const resistorButton = document.getElementById('ResistorButton');
        resistorButton.onclick = () => {
                board.changeSelection('Resistor');
        }

        const voltageSourceButton = document.getElementById('VoltageSourceButton');
        voltageSourceButton.onclick = () => {
                board.changeSelection('VoltageSource');
        }

        const currentSourceButton = document.getElementById('CurrentSourceButton');
        currentSourceButton.onclick = () => {
                board.changeSelection('CurrentSource');
                console.log('hi');
        }

        const eraserButton = document.getElementById('EraserButton');
        eraserButton.onclick = () => {
                board.changeSelection('Eraser');

        }

        const colorButton = document.getElementById('ColorButton');
        colorButton.onclick = () => {
                console.log('changing the color scheme');
                if (board.colorScheme === 'green') {
                        board.changeColorScheme('pink');
                } else
                        board.changeColorScheme('green');
        }

        const resetButton = document.getElementById('ResetButton');
        resetButton.onclick = () => {
                board.unlockBoard();
                board.resetBoard()

        }

        const saveButton = document.getElementById('SaveButton');
        saveButton.onclick = () => {
                levels.createLevel1();

        }


//delete cells at end


