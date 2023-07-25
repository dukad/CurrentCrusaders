import BasicComponent from "./BasicComponent.js";

export default class Resistor extends BasicComponent {
    constructor(x_coordinate, y_coordinate, dimension, app, color, orientation, value) {
        console.log('constructing Resistor')
        super(x_coordinate, y_coordinate, dimension, app, color, orientation, value);
    }

    draw() {
        console.log('drawing resistor')
        this.graphic.clear();
        this.app.stage.addChild(this.graphic);
        this.graphic.lineStyle(this.dimension/7, this.color); // change the linestyle
        this.#draw_a_resistor();
        this.#rotate_graphic();
        // this.app.stage.addChild(this.graphic);
    }

    #draw_a_resistor() {
        // math to draw a resistor
        let x = this.xpixels;
        let y = this.ypixels + this.dimension/2;
        this.graphic.moveTo(x, y);
        this.graphic.lineTo(x+this.dimension/10, y);
        this.graphic.lineTo(x+this.dimension/5, y - this.dimension/4);
        this.graphic.lineTo(x+this.dimension*2/5, y + this.dimension/4);
        this.graphic.lineTo(x+this.dimension*3/5, y - this.dimension/4);
        this.graphic.lineTo(x+this.dimension*4/5, y + this.dimension/4);
        this.graphic.lineTo(x+this.dimension*9/10, y);
        this.graphic.lineTo(x+this.dimension, y);
        this.app.stage.addChild(this.graphic);
    }

    #rotate_graphic() {
        /**
         * rotate the graphic depending on orientation
         */
        //set pivot point to the middle
        this.graphic.x = this.xpixels + this.dimension / 2;
        this.graphic.y = this.ypixels + this.dimension / 2;
        this.graphic.pivot.x = this.graphic.x
        this.graphic.pivot.y = this.graphic.y;
        this.graphic.rotation = 3.1415/2 * this.orientation
        // this.app.stage.addChild(this.graphic);
    }
}