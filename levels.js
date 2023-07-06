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
                this.board.cell_matrix[i][j].makeWire();
            }
        }
        this.board.cell_matrix[2][2].makeResistor();
        this.board.cell_matrix[2][3].makeResistor();
        this.board.cell_matrix[3][2].makeResistor();
        this.board.cell_matrix[3][3].makeResistor();
        this.board.cell_matrix[3][3].makeVoltageSource();
        console.log("level 1");
    }
}

