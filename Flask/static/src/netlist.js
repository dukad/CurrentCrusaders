import Wire from "./wire.js";
import VoltageSource from "./VoltageSource.js";
import CurrentSource from "./CurrentSource.js";
import BasicComponent from "./BasicComponent.js";
import Board from "./board.js";


export default class netlist {
    constructor (board){
        this.netlist = '';
        this.x = 0;
        this.y = 0;
        this.startingOrientation = 0;
        this.board = board;
        this.nodeCounter = 1;
        this.resistorCounter = 1;
        this.voltageCounter = 1;
        this.currentCounter = 1;
    }
    solve() {
  //      let startxy = findStartPosition();
        traverseCircuit(this.board.cell_matrix[this.x][this.y], this.startingOrientation(), this.nodeCounter);
        // createNetList();
//        sentToPython();

}

    traverseCircuit(cell, ori, nodenum) {
        console.log("hai");
        //loop
        //make wires seen
        //give parts a wire
        //recursive call with new starting cell
        // if junction call multiple times for each direction
        //base call
    }


    findStartPosition() {
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                if (this.board().cell_matrix(i, j).isPowerSource()) {
                this.x = j;
                this.y = i;
                if (this.board.cell_matrix[i][j].part.orientation) {
                    this.startingOrientation = 1;
                } else {
                    this.startingOrientation = 0;
                }
            } else {
                //kys
            }
            }
        }
    }


}