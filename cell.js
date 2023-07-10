import Wire from './wire.js';
import Resistor from "./Resistor.js";
import CurrentSource from "./CurrentSource.js";
import VoltageSource from "./VoltageSource.js";

export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, partColor, board) {
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
        this.matrix = matrix;
        this.xpixels = this.x * this.dimension;
        this.ypixels = this.y * this.dimension;
        this.partColor = partColor;
        this.app = app;
        this.graphic = new PIXI.Graphics;
        this.#initializeInteractive();
        this.part = null;
        this.board = board;
        this.temporaryGraphic = null;
        this.hovering = 0;
        this.selected = false;
        this.isLocked = false;
    }

    draw(backgroundColor, borderColor) {
        this.graphic.lineStyle(2, borderColor, 1) // set lines which border cells and become the grid
        this.graphic.beginFill(backgroundColor) //fill with black
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic) //stage this graphic
    }

    delete() {
            this.graphic.clear();
            delete this.graphic;
            this.part.delete();
            delete this;
    }

    makePart() {
            let selection = this.board.selection;
            switch (selection) {
                case 'Select':
                    this.selectCell();
                    break;
                case 'Wire':
                    if (!this.isLocked) {
                        this.makeWire();
                    }
                    break;
                case 'Eraser':
                    if (!this.isLocked) {
                        this.erase();
                    }
                    break;
                case 'Resistor':
                    if (!this.isLocked) {
                        this.makeResistor();
                    }
                    break;
                case 'VoltageSource':
                    if (!this.isLocked) {
                        this.makeVoltageSource();
                    }
                    break;
                case 'CurrentSource':
                    if (!this.isLocked) {
                        this.makeCurrentSource();
                    }
                    break;
                default:
                    break;
            }
        }

    erase() {
        if (!this.isLocked) {
            if (this.part) {
                this.part.delete();
            }
            this.part = null;
        }
    }

    selectCell() {
        if (!this.selected) {
            this.graphic.alpha = 0.7;
            this.selected = true;
            this.board.changeCellSelection(this);
            if (this.part) {
                this.board.selectPart(this.part);
            }
        } else {
            this.graphic.alpha = 1;
            this.selected = false;
        }
    }

    deselectCell() {
        this.selected = false;
        this.graphic.alpha = 1;
    }

    makeWire() {
        // if (this.board.selection === "Wire") {
        //     console.log ("its already a wire dumbo");
        //     return;
        // }
        if (!this.isLocked) {
            if (this.part) {
                this.part.delete();
            }
            this.part = new Wire(this.x, this.y, this.dimension, this.app, this.partColor)
            this.#autoConnectWire();
            this.part.draw();
        }
    }

    makeResistor() {
        console.log('running makeResistor');
        this.printInfo();
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation;
        let val = this.board.convertToNum(this.board.value);
        this.part = new Resistor(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }

    makeResistorVertical(){
        this.printInfo();
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation+1;
        let val = this.board.convertToNum(this.board.value);
        this.part = new Resistor(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }

    makeVoltageSource() {
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation;
        let val = this.board.convertToNum(this.board.value);
        this.part = new VoltageSource(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }
    makeVoltageSourceVertical() {
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation+1;
        let val = this.board.convertToNum(this.board.value);
        this.part = new VoltageSource(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }

    makeCurrentSource() {
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation;
        let val = this.board.convertToNum(this.board.value);
        this.part = new CurrentSource(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }
    makeCurrentSourceVertical() {
        if (this.part) {
            this.part.delete();
        }
        let or = this.board.rotation+1;
        let val = this.board.convertToNum(this.board.value);
        this.part = new CurrentSource(this.x, this.y, this.dimension, this.app, this.partColor, or, val);
        this.#autoConnectBasicComponent(or);
        this.part.draw();
    }


    printInfo() {
        // only used for debugging
        console.log('Cell at: ', this.x, this.y)
        if (this.part) {
            console.log(typeof this.part)
            console.log('Connected to: ')
            this.part.connected_parts.forEach(part =>(
                console.log(part.x, part.y)
            ))
        }
    }

    #autoConnectWire() {
    //    check in 4 cardinal directions and check if the cell has a part in it
        try {
            let checkingPart = this.matrix[this.y][this.x - 1].part;
            if (checkingPart) {
                this.part.safe_connect(checkingPart);
            }
            checkingPart = this.matrix[this.y][this.x + 1].part;
            if (checkingPart) {
                this.part.safe_connect(checkingPart);
            }
            checkingPart = this.matrix[this.y - 1][this.x].part;
            if (checkingPart) {
                this.part.safe_connect(checkingPart);
            }
            checkingPart = this.matrix[this.y + 1][this.x].part
            if (checkingPart) {
                this.part.safe_connect(checkingPart);
            }
        } catch (TypeError) {
            console.log('index out of range :)')
        }
    }

    #autoConnectBasicComponent(or) {
        let checkingPart;
        if ((or % 2) === 0) { // if horizontal, check side to side and try to connect
            checkingPart = this.matrix[this.y][this.x - 1].part;
            if (checkingPart) { this.part.safe_connect(checkingPart); }
            checkingPart = this.matrix[this.y][this.x + 1].part;
            if (checkingPart) { this.part.safe_connect(checkingPart); }
        } else { // if vertical, check above and below
            checkingPart = this.matrix[this.y - 1][this.x].part;
            if (checkingPart) { this.part.safe_connect(checkingPart); }
            checkingPart = this.matrix[this.y + 1][this.x].part
            if (checkingPart) { this.part.safe_connect(checkingPart); }
        }
    }

    #initializeInteractive() {
        this.graphic.interactive = true;
        this.graphic.buttonMode = true;
        this.graphic.on('mouseover', () => {
            this.onHover();
        })
        this.graphic.on('mouseout', () => {
            this.#onMouseOut();
        })
        this.graphic.on('mousedown', () => {
            this.makePart()
        })
    }

    #delete_temporary_graphic() {
        if (this.temporaryGraphic) {
            this.temporaryGraphic.clear();
            delete this.temporaryGraphic;
            this.temporaryGraphic = null;
        }
    }

    onHover() {
        this.hovering = 1;
        if (this.board.mode === 'mousedown') {
            switch (this.board.selection) {
                case 'Wire':
                    this.makeWire();
                    break;
                case 'Eraser':
                    this.erase();
                    break;
                default:
                    break;
            }
        }
        switch (this.board.selection) {
            case 'Resistor':
                this.draw_a_fake_resistor();
                break;
            case 'VoltageSource':
                // console.log('hi')
                this.draw_a_fake_voltagesource();
                break;
            case 'CurrentSource':
                this.draw_a_fake_currentsource();
                break;
            case 'Wire':
                this.#delete_temporary_graphic();
                break;
            // case 'Select' :
            //     console.log(this.part.value);
            default:
                break;

        }

        if (!(this.selected)) {
            this.graphic.alpha = (0.9);
        }

        // checking if its not blank space or a wire
        if(this.part && !(this.part.value === undefined)) {
            console.log(this.part.value);
        }
    }

    #onMouseOut() {
        if (!(this.selected)) {
            this.graphic.alpha = (1);
        }
        this.#delete_temporary_graphic();
        this.hovering = 0;
    }

    #extension_to_number(strnum) {
        console.log(strnum);
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

    //used for hovering to show what it would look like
    draw_a_fake_resistor() {
        // draw
        if (this.temporaryGraphic) {
            this.temporaryGraphic.clear();
            delete this.temporaryGraphic;
        }
        this.temporaryGraphic = new PIXI.Graphics();
        let x = this.xpixels;
        let y = this.ypixels + this.dimension/2;
        this.temporaryGraphic.lineStyle(this.dimension/7, this.partColor);
        this.temporaryGraphic.moveTo(x, y);
        this.temporaryGraphic.lineTo(x+this.dimension/10, y)
        this.temporaryGraphic.lineTo(x+this.dimension/5, y - this.dimension/4)
        this.temporaryGraphic.lineTo(x+this.dimension*2/5, y + this.dimension/4)
        this.temporaryGraphic.lineTo(x+this.dimension*3/5, y - this.dimension/4)
        this.temporaryGraphic.lineTo(x+this.dimension*4/5, y + this.dimension/4)
        this.temporaryGraphic.lineTo(x+this.dimension*9/10, y)
        this.temporaryGraphic.lineTo(x+this.dimension, y)
        this.app.stage.addChild(this.temporaryGraphic);
        // rotate
        this.temporaryGraphic.x = this.xpixels + this.dimension / 2;
        this.temporaryGraphic.y = this.ypixels + this.dimension / 2;
        this.temporaryGraphic.pivot.x = this.temporaryGraphic.x
        this.temporaryGraphic.pivot.y = this.temporaryGraphic.y;
        this.temporaryGraphic.rotation = 3.1415/2 * this.board.rotation
        this.temporaryGraphic.alpha = 0.5;
    }

    draw_a_fake_voltagesource() {
        // draw
        if (this.temporaryGraphic) {
            this.temporaryGraphic.clear();
            delete this.temporaryGraphic;
        }
        this.temporaryGraphic = new PIXI.Graphics();
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.temporaryGraphic.lineStyle(this.dimension/7, this.partColor);
        this.temporaryGraphic.moveTo(x, y);
        this.temporaryGraphic.lineTo(x + this.dimension / 6, y)
        this.temporaryGraphic.moveTo(x + this.dimension * 5 / 6, y)
        this.temporaryGraphic.lineTo(x + this.dimension, y)
        this.temporaryGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
        this.temporaryGraphic.lineStyle(2, this.partColor)
        //draw plus sign
        this.temporaryGraphic.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
        this.temporaryGraphic.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
        //draw minus sign
        this.temporaryGraphic.moveTo(x + this.dimension * 4 / 12, y)
        this.temporaryGraphic.lineTo(x + this.dimension * 6 / 12, y)
        this.temporaryGraphic.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
        this.temporaryGraphic.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)
        this.temporaryGraphic.lineStyle(this.dimension/7, this.partColor);
        // rotate
        this.temporaryGraphic.x = this.xpixels + this.dimension / 2;
        this.temporaryGraphic.y = this.ypixels + this.dimension / 2;
        this.temporaryGraphic.pivot.x = this.temporaryGraphic.x
        this.temporaryGraphic.pivot.y = this.temporaryGraphic.y;
        this.temporaryGraphic.rotation = 3.1415/2 * this.board.rotation;
        this.app.stage.addChild(this.temporaryGraphic);
        this.temporaryGraphic.alpha = 0.5;
    }

    draw_a_fake_currentsource() {
        // draw
        if (this.temporaryGraphic) {
            this.temporaryGraphic.clear();
            delete this.temporaryGraphic;
        }
        this.temporaryGraphic = new PIXI.Graphics();
        this.app.stage.addChild(this.temporaryGraphic);
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.temporaryGraphic.lineStyle(this.dimension/7, this.partColor);
        this.temporaryGraphic.moveTo(x, y);
        this.temporaryGraphic.lineTo(x + this.dimension / 6, y)
        this.temporaryGraphic.moveTo(x + this.dimension * 5 / 6, y)
        this.temporaryGraphic.lineTo(x + this.dimension, y)
        this.temporaryGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
        this.temporaryGraphic.lineStyle(2, this.partColor)
        //draw arrow
        this.temporaryGraphic.moveTo(x + this.dimension *  2/3, y)
        this.temporaryGraphic.lineTo(x + this.dimension * 1/3, y)
        this.temporaryGraphic.moveTo(x + this.dimension * 4/9, y + this.dimension * 1/10)
        this.temporaryGraphic.lineTo(x + this.dimension * 1/3, y);
        this.temporaryGraphic.lineTo(x + this.dimension * 4/9, y - this.dimension * 1/10)
        this.temporaryGraphic.lineStyle(this.dimension/7, this.color);
        // rotate
        this.temporaryGraphic.x = this.xpixels + this.dimension / 2;
        this.temporaryGraphic.y = this.ypixels + this.dimension / 2;
        this.temporaryGraphic.pivot.x = this.temporaryGraphic.x
        this.temporaryGraphic.pivot.y = this.temporaryGraphic.y;
        this.temporaryGraphic.rotation = 3.1415/2 * this.board.rotation;

        this.temporaryGraphic.alpha = 0.5;
    }
}
