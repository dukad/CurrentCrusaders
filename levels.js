import Board from "./board.js";
import Cell from "./cell.js";
export default class Levels {
    constructor(board) {
        // this.map = new Map();
        this.board = board;
    }

    createLevel1() {
        // this.board.createMatrix();
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                //this.board.cell_matrix[i][j].makeWire();
                this.board.cell_matrix[i][j].erase();
                this.board.cell_matrix[i][j].isLocked = true;
            }
        }
        for (let i = 3; i < this.board.grid_height-3; i++) {
            this.board.cell_matrix[3][i].isLocked = false;
            this.board.cell_matrix[3][i].makeWire();
            this.board.cell_matrix[3][i].isLocked = true;
        }
        this.board.cell_matrix[6][6].makeResistor();
        this.board.cell_matrix[3][15].makeVoltageSource();
        console.log("level 1");
    }
}

