import Board from "./board.js";
import Cell from "./cell.js";
export default class Levels {
    constructor(board) {
        // this.map = new Map();
        this.board = board;
    }

    createLevel1() {
        this.clearLockBoard();
        this.makeHorizontalWire(3, this.board.grid_height, 2);
        this.makeHorizontalWire(3, this.board.grid_height, 8);
        this.makeVerticalWire(3, this.board.grid_height-6, 3);
        this.makeVerticalWire(2, this.board.grid_height-6, 15);
        this.board.cell_matrix[5][3].makeResistorVertical();
        this.board.cell_matrix[5][15].makeVoltageSourceVertical();
        console.log("level 1");
    }

    clearLockBoard(){ //clears and locks board
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                this.board.cell_matrix[i][j].erase();
                this.board.cell_matrix[i][j].isLocked = true;
            }
        }
    }
    makeHorizontalWire(startIndex, finishIndex, heightIndex){
        for (let i = startIndex; i<finishIndex; i++){
            this.board.cell_matrix[heightIndex][i].isLocked = false;
            this.board.cell_matrix[heightIndex][i].makeWire();
            this.board.cell_matrix[heightIndex][i].isLocked = true;
        }
    }

    makeVerticalWire(startIndex, finishIndex, positionIndex){
        for (let i = startIndex; i<finishIndex; i++){
            this.board.cell_matrix[i][positionIndex].isLocked = false;
            this.board.cell_matrix[i][positionIndex].makeWire();
            this.board.cell_matrix[i][positionIndex].isLocked = true;
        }
    }
}
