import BasicComponent from "./BasicComponent.js";

export default class VoltageSource extends BasicComponent {
    constructor(x_coordinate, y_coordinate, dimension, app, color, orientation, value) {
        super(x_coordinate, y_coordinate, dimension, app, color, orientation, value);
    }

    draw() {
        this.graphic.clear();
        this.app.stage.addChild(this.graphic);
        this.graphic.lineStyle(this.dimension/7, this.color); // change the linestyle
        this.#draw_a_voltagesource();
        this.#rotate_graphic();
    }

    #draw_a_voltagesource() {
        // math to draw a resistor
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.graphic.moveTo(x, y);
        this.graphic.lineTo(x + this.dimension / 6, y)
        this.graphic.moveTo(x + this.dimension * 5 / 6, y)
        this.graphic.lineTo(x + this.dimension, y)
        this.graphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
        this.graphic.lineStyle(2, this.color)
        //draw plus sign
        this.graphic.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
        this.graphic.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
        //draw minus sign
        this.graphic.moveTo(x + this.dimension * 4 / 12, y)
        this.graphic.lineTo(x + this.dimension * 6 / 12, y)
        this.graphic.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
        this.graphic.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)
        this.graphic.lineStyle(this.dimension/7, this.color);
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