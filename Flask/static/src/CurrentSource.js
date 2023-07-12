import BasicComponent from "./BasicComponent.js";

export default class CurrentSource extends BasicComponent {
    constructor(x_coordinate, y_coordinate, dimension, app, color, orientation, value) {
        super(x_coordinate, y_coordinate, dimension, app, color, orientation, value);
    }

    draw() {
        this.graphic.clear();
        this.app.stage.addChild(this.graphic);
        this.graphic.lineStyle(this.dimension/7, this.color); // change the linestyle
        this.#draw_a_currentsource();
        this.#rotate_graphic();
        // this.app.stage.addChild(this.graphic);
    }

    #draw_a_currentsource() {
        // math to draw a resistor
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.graphic.moveTo(x, y);
        this.graphic.lineTo(x + this.dimension / 6, y)
        this.graphic.moveTo(x + this.dimension * 5 / 6, y)
        this.graphic.lineTo(x + this.dimension, y)
        this.graphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
        this.graphic.lineStyle(2, this.color)
        //draw arrow
        this.graphic.moveTo(x + this.dimension *  2/3, y)
        this.graphic.lineTo(x + this.dimension * 1/3, y)
        this.graphic.moveTo(x + this.dimension * 4/9, y + this.dimension * 1/10)
        this.graphic.lineTo(x + this.dimension * 1/3, y);
        this.graphic.lineTo(x + this.dimension * 4/9, y - this.dimension * 1/10)
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