import Wire from "./wire.js";
import VoltageSource from "./VoltageSource.js";
import CurrentSource from "./CurrentSource.js";
import BasicComponent from "./BasicComponent.js";
import Board from "./board.js";
import Part from "./part.js";


export default class netlist {
    constructor (board){
        this.netlist = '';
        this.startingOrientation = 0;
        this.board = board;
        this.nodeCounter = 0;
        this.resistorCounter = 1;
        this.voltageCounter = 1;
        this.currentCounter = 1;
        this.seen = new Set();
        // this.junctionCoordsx = null;
        // this.junctionCoordsy = null;
        // this.lastCoordsx = null; //this is the last coord before we teleport back to the junction, will be returned to
        // this.lastCoordsy = null;
        this.componentSet = new Set();

        //magic number lets it teleport back to junction, definitely a better way to do this but im too
        // this.magicNumber = null;

    }
    // this is where it all begins
    solve() {

        //      let startxy = findStartPosition();
        console.log("calling traverse circuit")
        let startPos = this.findStartPosition();
        console.log("Starting position " + startPos.x + " " + startPos.y);
        this.traverseCircuit(startPos.x, startPos.y);
        this.seen.forEach(function(element) {
            console.log("mmm " +element.x + " " + element.y)
        });
        this.labelComponentNodes();
        // createNetList();
//        sendToPython();
        console.log(this.componentSet);
        this.makeNetlist();
    }
    // recursive method call
    traverseCircuit(x, y) {
        //loop
        // let x = cell.x;
        // let y = cell.y;
        // console.log("traverseCircuit X and y:");
        // console.log(x + " " + y); //what going on here
        // if((this.junctionCoordsx === x && this.junctionCoordsy === y)) {
        //     console.log("your dad")
        // }
        if (!this.seen.has(this.board.cell_matrix[x][y])) {
            console.log("traverse circuit" + "")
            let array = this.checkDirections(x,y);
            let newCoordinate = this.findStartCoordinates(array, x, y);
            // if(this.magicNumber >= 1 && this.board.cell_matrix[newCoordinate.x][newCoordinate.y].partName !== null && this.board.cell_matrix[newCoordinate.x][newCoordinate.y].partName !== 'Wire') {
            //    console.log(array.length + " array length");
            //     console.log("magic numberrrr were teleporting back")
            //     this.lastCoordsx = x;
            //     this.lastCoordsy = y;
            //     newCoordinate.x = this.junctionCoordsx // but go 1 ;
            //     newCoordinate.x = this.junctionCoordsy;
            //     x = this.junctionCoordsx;
            //     y = this.junctionCoordsy;
            //     this.magicNumber--;
            // }
            // console.log("new cord " + newCoordinate.x);
            // console.log('new cord y ' + newCoordinate.y);
            this.seen.add(this.board.cell_matrix[x][y]);
            if (this.board.cell_matrix[x][y].partName==='Wire') {

                console.log('making this wire node '+ this.nodeCounter + "x: " + y + " y: " + x); //wtf lol why is this flipped??
                this.board.cell_matrix[x][y].part.nodeNum = this.nodeCounter; // please dont break with magicNumber
                console.log('now the wire node is' + this.board.cell_matrix[x][y].part.nodeNum);
            }
            // checking if its a resistor, voltage or current source

            // if(this.lastCoordsx !== null){
            //     let tempx = this.lastCoordsx;
            //     this.lastCoordsx = null
            //     this.traverseCircuit(tempx, this.lastCoordsy);
            // }
            if (!this.seen.has(this.board.cell_matrix[newCoordinate.x][newCoordinate.y])&&this.board.cell_matrix[newCoordinate.x][newCoordinate.y].part!==null && this.board.cell_matrix[x][y].partName !== 'Wire') {
                // this.nodeCounter--;
                console.log('your mom');
            }
            if (this.board.cell_matrix[x][y].partName !== null && this.board.cell_matrix[x][y].partName !== 'Wire'){
                this.nodeCounter++;
                console.log("adding one to node counter now its " + this.nodeCounter);
            }
            if (array.length === 2) {
                //here
                this.traverseCircuit(newCoordinate.x, newCoordinate.y);
                // removes the first element in the array
                array.shift()
                newCoordinate = this.findStartCoordinates(array, x, y);
                //somewhere here we need to pass the node number into the basic component object
                this.traverseCircuit(newCoordinate.x, (newCoordinate.y));
            }else if (array.length>=3){
                // this.junctionCoordsx = x;
                // this.junctionCoordsy = y;
                // this.magicNumber = 1 + (array.length - 2)
                // console.log("WE ARE RECURSING direction 2 ");
                for(let i = 0; i < (array.length - 2); i++) {//does this loop 2 times????
                this.traverseCircuit(newCoordinate.x, newCoordinate.y);
                array.shift();
                newCoordinate = this.findStartCoordinates(array, x, y);
                }
                this.traverseCircuit(newCoordinate.x, newCoordinate.y)

            }
            //make wires seen
            //give parts a wire
            //recursive call with new starting cell
            // if junction call multiple times for each direction
            //base call
        } else {
            // console.log("ur mother")
        }
        // console.log("the end??");
    }


    findStartPosition() {
        console.log('finding start position');
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                if (this.board.cell_matrix[i][j].isPowerSource()) {
                    //are x and y flipped? works for some circuits and not others idrk tbh
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
    findStartCoordinates(array, x, y){
        // console.log ('traversing array');
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
    checkDirections(x, y){
        // console.log('checking cell direction');
        //up is 1, right is 2, down is 3, left is 4
        let array = [];
        // console.log("x: " + x + " y: " + y);
        // console.log(this.board.cell_matrix[x][y-1].part)

        if (this.board.cell_matrix[x][y-1].partName!==''){
            array.push(1);
            // console.log('going up');
        }
        if (this.board.cell_matrix[x+1][y].partName!==''){
            array.push(2);
            // console.log('going right');
        }
        if (this.board.cell_matrix[x-1][y].partName!==''){
            array.push(4);
            // console.log('going left');
        }
        if (this.board.cell_matrix[x][y+1].partName!==''){
            array.push(3);
            // console.log('going down');
        }

        // console.log(array);
        return array;
    }
    incrementObject(x, y){
        //object counter for the name of the object in the netlist
    }
    labelComponentNodes(){
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                let cell = this.board.cell_matrix[i][j]
                if ((cell.partName!=='Wire') && (cell.partName !== '')) {
                    console.log((cell.part.orientation));
                    if (parseInt(cell.part.orientation)=== 0) { // vertical i think
                        cell.part.node1 = this.board.cell_matrix[i][j-1].part.nodeNum;
                        cell.part.node2 = this.board.cell_matrix[i][j+1].part.nodeNum;
                        console.log("horizontall")
                    } else { // component is horizontal
                        // console.log("nodenummmm1 " + this.board.cell_matrix[i][j + 1].part.nodeNum)
                        cell.part.node1 = this.board.cell_matrix[i + 1][j].part.nodeNum;
                        cell.part.node2 = this.board.cell_matrix[i - 1][j].part.nodeNum;
                    }
                    this.namePySpicePart(cell);
                    console.log("the netlist name is " + cell.part.netlistName);
                    }
                        // console.log('assigning nodes ' + cell.part.node1 + cell.part.node2 + 'at ' + i + j);
                }
            }
        }

    namePySpicePart(cell) {
        switch (cell.partName) {
            case 'Resistor':
                cell.part.netlistName =  "R" + this.resistorCounter;
                this.resistorCounter++;
                break;
            case 'Voltage':
                cell.part.netlistName = "V" + this.voltageCounter;
                this.voltageCounter++;
                break;
            case 'Current':
                cell.part.netlistName = "I" + this.currentCounter;
                this.currentCounter++
                break;
            case 'Wire':
                alert("bro this is a wire not a component");
                break;
        }
        this.componentSet.add(cell.part);

    }

    makeNetlist(){
        let netlist = '';
        this.componentSet.forEach(function(element) {
            console.log('values are ' + element.netlistName + ' ' + element.node1 + ' ' + element.node2);
            netlist += element.netlistName + ' ' + element.node1 + ' ' + element.node2 + ' ' + element.value + '\n';
        });
        console.log(netlist);
        }



}