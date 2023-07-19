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
    }
    solve() {
  //      let startxy = findStartPosition();
        // traverseCircuit(this.cell_matrix[x][y], this.startingOrientation, 1);
        // createNetList();
//        sentToPython();

}

    // findStartPosition() {
    //     for...
    //     this.x =
    //         this.y =
    //             if (cell_matrix[x][y].orientation===0) {
    //
    //             } else {
    //                 go up
    //             }
    // }
}