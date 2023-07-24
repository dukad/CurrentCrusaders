import Wire from "./wire.js";
import VoltageSource from "./VoltageSource.js";
import CurrentSource from "./CurrentSource.js";
import BasicComponent from "./BasicComponent.js";
import Board from "./board.js";


export default class netlist {
    constructor (board){
        this.netlist = '';
        this.startingOrientation = 0;
        this.board = board;
        this.nodeCounter = 1;
        this.resistorCounter = 1;
        this.voltageCounter = 1;
        this.currentCounter = 1;
        this.seen = new Set();
    }
    // this is where it all begins
    solve() {

  //      let startxy = findStartPosition();
        console.log("calling traverse circuit")
        let startPos = this.findStartPosition();
        console.log("Starting position " + startPos.x + " " + startPos.y);
        this.traverseCircuit(startPos.x, startPos.y, this.startingOrientation, this.nodeCounter);
        this.seen.forEach(function(value) {
            console.log("mmm " +value.x + " " + value.y)
        });
        // createNetList();
//        sendToPython();

}
    // recursive method call
    traverseCircuit(x, y, direction, nodenum) {
        //loop
        // let x = cell.x;
        // let y = cell.y;
        console.log("traverseCircuit X and y:");
        console.log(x + " " + y); //what going on here

        if (!this.seen.has(this.board.cell_matrix[x][y])) {
            console.log("traverse circuit" + "")
            let array = this.checkDirections(x,y);
            let newCoordinate = this.findStartCoordinates(array, x, y);
            console.log("new cord " + newCoordinate.x);
            console.log('new cord y ' + newCoordinate.y);
            this.seen.add(this.board.cell_matrix[x][y]);
            this.board.cell_matrix[x][y].nodeNumber = nodenum;
            // this.board.cell_matrix[x][y].objectNum =
            // nodenum++;
            if (array.length === 2) {
                console.log('only one direction found :)');
                console.log("WE ARE RECURSING");
                console.log(array + "arayaseijffaanadanjadfafdjklslsidgagoiaj")
                this.traverseCircuit(newCoordinate.x, newCoordinate.y, array[0], nodenum);
                nodenum++;
                //somewhere here we need to pass the node number into the basic component object
                this.traverseCircuit(newCoordinate.x, (newCoordinate.y), array[0], nodenum);
            }else if (array.length===3){
                console.log("WE ARE RECURSING direction 2 ");
                this.traverseCircuit(this.board.cell_matrix[newCoordinate.x][newCoordinate.y], array[0], nodenum);
                nodenum++;
                this.traverseCircuit(this.board.cell_matrix[newCoordinate.x][newCoordinate.y], array[1], nodenum);
                nodenum++;
                this.traverseCircuit(this.board.cell_matrix[newCoordinate.x][newCoordinate.y], array[2], nodenum);

            }
        //make wires seen
        //give parts a wire
        //recursive call with new starting cell
        // if junction call multiple times for each direction
        //base call
                    } else {
            console.log("ur mother")
        }
                    console.log("the end??");
    }


    findStartPosition() {
        console.log('finding start position');
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                if (this.board.cell_matrix[i][j].isPowerSource()) {
                    x = i;
                    y = j;
                    // if (this.board.cell_matrix[i][j].part.orientation) {
                    //     this.startingOrientation = 1;
                    // } else {
                    //     this.startingOrientation = 0;
                    // }
                }
            }
        }
        console.log("find starting position x:" + x + " y: " + y);
        return {x, y};
    }
    traverseArray(array, x, y){
        console.log ('traversing array');
            if(array[0] === 1) {
                y--; // up
            } else if (array[0] === 2){
                x++; // right
            } else if (array[0] === 3) {
                y++; // down
            } else if (array[0] === 4){
                x--; //left
            }
            return {x, y};
    }
        //WHAT THE FRICK IS GOING ON HERE - the directions are completely fucked lol but i think we made it work through trial and error
    checkDirections(x, y){
        console.log('checking cell direction');
        //up is 1, right is 2, down is 3, left is 4
        let array = [];
        console.log("x: " + x + " y: " + y);
        // console.log(this.board.cell_matrix[x][y-1].part)

        //THIS IS 110% wrong
        if (this.board.cell_matrix[x+1][y].partName!==''){
            array.push(1);
            console.log('going up');
        }
        if (this.board.cell_matrix[x][y+1].partName!==''){
            array.push(2);
            console.log('going right');
        }
        if (this.board.cell_matrix[x-1][y].partName!==''){
            array.push(3);
            console.log('going down');
        }
        if (this.board.cell_matrix[x][y-1].partName!==''){
            array.push(4);
            console.log('going left');
        }
        console.log(array);
        return array;
    }
    incrementObject(x, y){
        //object counter for the name of the object in the netlist
    }


}