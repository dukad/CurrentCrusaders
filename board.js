import Cell from "./cell.js";


export default class Board {
    constructor(grid_height, grid_width, cell_dimension, app, colorScheme) {
        this.cell_matrix = [];
        this.grid_height = grid_height;
        this.grid_width = grid_width;
        this.cell_dimension = cell_dimension;
        this.app = app;
        this.colorScheme = colorScheme;
        if (colorScheme==='green') {
            this.backgroundColor = 0xC1BDB3;
            this.borderColor = 0x000000;
            this.partColor = 0x007600;
        }
        if (colorScheme==='pink'){
            this.setBackgroundColor(0xA54657);
            this.borderColor = 0x582630;
            this.partColor = 0xF7EE7F;
            console.log('changing color scheme');
        }
        this.mode = '';
        this.selection = 'Wire';
        this.rotation = 0;
        this.value = '1';
        this.cellSelection = null;
        this.valueInput = document.getElementById('value'); // set the input value to the actual value
        this.cellMatrix1 = [this.grid_height][this.grid_width];
        this.map = new Map();
        this.map.set(1, this.cellMatrix1);


    }
    createMatrix() {
        // create every row in the matrix
        for (let i = 0; i < this.grid_height; i++) {
            this.cell_matrix[i] = [];
        }
        // 2D loop through the array, creating a cell for each element at the proper coordinates. Then, draw that cell on the board
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                let newCell = new Cell(j, i, this.cell_dimension, this.app, this.cell_matrix, this.partColor, this)
                newCell.draw(this.backgroundColor, this.borderColor);
                this.cell_matrix[i][j] = newCell;
            }
        }
        console.log('hi')
    }

    // delete() {
    //     for (let i = 0; i < this.grid_height; i++) {
    //         for (let j = 0; j < this.grid_width; j++) {
    //             this.cell_matrix[i][j].delete();
    //         }
    //     }
    // }

    changeMode(string) {
        this.mode = string;
    }

    changeSelection(string) {
        console.log('changing the selection to ', string);
        this.selection = string;
        // change alpha level back?
            for(let i = 0 ; i < this.grid_height; i++) {
                for(let j = 0; j < this.grid_width; j++) {
                if(this.cell_matrix[i][j].selected) {
                    this.cell_matrix[i][j].graphic.alpha = 1;
                    return;
                }
            }
        }
    }

    changeCellSelection(cell) {
        if (this.cellSelection) {
            console.log('running call stack')
            this.cellSelection.deselectCell();
        }
        this.cellSelection = cell;
    }

    selectPart(part) {
        this.valueInput.value = part.value;
    }

    onKeyPress(key) {
        switch (key) {
            case 'o':
                this.changeSelection('Resistor');
                break;
            case 'w':
                this.changeSelection('Wire');
                break;
            case 'e':
                this.changeSelection('Eraser');
                break;
            case 'v':
                this.changeSelection('VoltageSource')
                break;
            case 'c':
                this.changeSelection('CurrentSource')
                break;
            case 'r':
                this.#incrementRotation();
                break;
            default:
                break;
        }
        this.#refreshhover();
    }

    #refreshhover() {
        console.log('running refreshhover')
        let checkPart;
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                checkPart = this.cell_matrix[i][j];
                if (checkPart.hovering) {
                    console.log('hover found')
                    checkPart.onHover();
                }
            }
        }
    }

    #incrementRotation() {
        if (this.rotation < 3) {
            this.rotation += 1;
        } else {
            this.rotation = 0;
        }
    }

    changeValue(value) {
        const allowed_chars = "1234567890.";
        const allowed_extensions = "munkMG";
        let input = value.split('');
        let final = "";
        let decimal = false;
        for (let i = 0; i < input.length; i++) {
            if ((allowed_chars.indexOf(input[i]) > -1) || ((i === (input.length -1)) && (allowed_extensions.indexOf(input[i]) > -1))) { // either a number or a valid extension
                if (input[i] === '.') {
                    if (!(decimal)) {
                        final += input[i];
                        decimal = true;
                    }
                } else {
                    final += input[i];
                }
            }
        }
        this.valueInput.value = final;
        if (this.cellSelection) {
            if (this.cellSelection.part) {
                let val = this.convertToNum(final);
                this.cellSelection.part.changeValue(val);
            }
        }
        this.value = final;
        return true;
    }

    setBackgroundColor(value){
        this.backgroundColor = value;
    }

    changeColorScheme(string) {
        if (string === 'pink') {
            this.setBackgroundColor(0xA54657);
            this.borderColor = 0x582630;
            this.partColor = 0xF7EE7F;
            this.colorScheme = 'pink';
        }
        if (string === 'green') {
            this.backgroundColor = 0xC1BDB3;
            this.borderColor = 0x000000;
            this.partColor = 0x007600;
            this.colorScheme = 'green';
        }
        this.createMatrix();
        }
   /* createCircuitOne() {
        for (let i = grid.height-35; i < grid.height-15; i++){
            this.cell_matrix[i] = 1;
        }
    }

    */

    convertToNum(strnum) {
        var last = strnum[strnum.length - 1];
        const allowed_chars = '0123456789.';
        let result;
        if (allowed_chars.indexOf(last) > -1) {
            result = Number(strnum)
        } else {
            result = strnum;
            console.log('input is', result)
            result = (result).slice(0, -1);
            console.log('sliced input is ', result)
            result = Number(result);
            console.log('numberified result is ', result)
            switch (last) {
                case 'm':
                    result = result * 0.001;
                    console.log('case')
                    break;
                case 'u':
                    result = result * 0.000001;
                    break;
                case 'n':
                    result = result * 0.000000001;
                    break;
                case 'k':
                    result = result * 1000;
                    break;
                case 'M':
                    result = result * 1000000;
                    break;
                default:
                    break;
            }
        }
        return result;
    }
    resetBoard() {
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                this.cell_matrix[i][j].erase();
            }
            }
        }
    unlockBoard(){
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                this.cell_matrix[i][j].isLocked = false;
            }
        }
    }
    createBoard(int) {
        let temp = this.map.get(int);
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                this.cell_matrix[i][j] = [...temp[i][j]];
            }
        }
        this.createMatrix();
    }

}