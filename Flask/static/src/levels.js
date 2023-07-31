export default class Levels {
    constructor(board) {
        // this.map = new Map();
        this.board = board;
    }

    createLevel1() {
        console.log('the height is ' + this.board.grid_height);
        console.log(this.board.grid_width);
        this.clearLockBoard();
        this.makeHorizontalWire(3, 16, 2, 0x007600);
        this.makeHorizontalWire(3, 16, 8, 0xDBFF33);
        this.makeVerticalWire(3, 16-7, 3, 0x007600);
        this.makeVerticalWire(2, 16-7, 15, 0x007600);
        this.board.cell_matrix[5][3].partColor = 0x007600;
        this.board.cell_matrix[5][3].makeResistor(10,1);
        this.board.cell_matrix[5][15].makeVoltageSource(5,1);
        console.log("level 1");
    }

    createLevel2() {
        this.clearLockBoard();
        this.makeHorizontalWire(3, 16, 2, 0x007600);
        this.makeHorizontalWire(3, 16, 8, 0x007600);
        this.makeVerticalWire(3, 16-7, 3, 0x007600);
        this.makeVerticalWire(2, 16-7, 15, 0x007600);
        this.board.cell_matrix[2][6].or = 1;
        this.board.cell_matrix[2][6].makeResistor(10,0);
        this.board.cell_matrix[2][12].makeResistor(10,0);
            this.board.cell_matrix[2][12].value = 10;
        this.board.cell_matrix[8][9].makeCurrentSource(15, 0);
        console.log("level 2");
    }

    createLevel3(){
        this.clearLockBoard();
        console.log('level 3');
        this.makeHorizontalWire(3, 16, 2, 0x007600);
        this.makeHorizontalWire(3, 16, 8, 0x007600);
        this.makeVerticalWire(3, 16-7, 3, 0x007600);
        this.makeVerticalWire(3,9,9, 0x007600);
        this.makeVerticalWire(2, 16-7, 15, 0x007600);
        this.board.cell_matrix[5][3].makeResistor(10,1); // orientation of 1 is vertical
        this.board.cell_matrix[5][9].makeResistor(10,1);
        this.board.cell_matrix[5][15].makeVoltageSource(5,1);
    }

    createLevel4(){
        this.clearLockBoard();
        console.log('level 4');
        this.makeHorizontalWire(3, 16, 2, 0x007600);
        this.makeHorizontalWire(3, 16, 8, 0xDBFF33);
        this.makeVerticalWire(3, 16-7, 3, 0x007600);
        this.makeVerticalWire(3,9,9, 0x007600);
        this.makeVerticalWire(2, 16-7, 15, 0x007600);
        this.board.cell_matrix[4][3].makeResistor(10,1);
        this.board.cell_matrix[6][3].makeResistor(10,1);
        this.board.cell_matrix[4][9].makeResistor(10,1);
        this.board.cell_matrix[6][9].makeResistor(10,1);
        this.board.cell_matrix[5][15].makeVoltageSource(5,1);
    }
    clearLockBoard(){ //clears and locks board
        for (let i = 0; i < this.board.grid_height; i++) {
            for (let j = 0; j < this.board.grid_width; j++) {
                this.board.cell_matrix[i][j].isLocked = false;
                this.board.cell_matrix[i][j].erase();
                this.board.cell_matrix[i][j].isLocked = true;
            }
        }
    }
    makeHorizontalWire(startIndex, finishIndex, heightIndex, color){
        for (let i = startIndex; i<finishIndex; i++){
            this.board.cell_matrix[heightIndex][i].isLocked = false;
            this.board.cell_matrix[heightIndex][i].partColor = color;
            this.board.cell_matrix[heightIndex][i].makeWire();
            this.board.cell_matrix[heightIndex][i].isLocked = true;
        }
    }

    makeVerticalWire(startIndex, finishIndex, positionIndex, color){
        for (let i = startIndex; i<finishIndex; i++){
            this.board.cell_matrix[i][positionIndex].isLocked = false;
            this.board.cell_matrix[i][positionIndex].partColor = color;
            this.board.cell_matrix[i][positionIndex].makeWire();
            this.board.cell_matrix[i][positionIndex].isLocked = true;
        }
    }
}

