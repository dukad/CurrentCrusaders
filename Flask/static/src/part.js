export default class Part {
    constructor(x_coordinate, y_coordinate, dimension, app, color) {
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
        this.color = color;
        this.xpixels = this.x * this.dimension;
        this.ypixels = this.y * this.dimension;
        this.app = app;
        this.graphic = new PIXI.Graphics;
        this.app.stage.addChild(this.graphic);
        this.text = new PIXI.Text("");

    }

    safe_connect(part) {
        // checks whether the parts can connect and if not, disconnects them, returning false
        if ((this.connect(part)) && (part.connect(this))) {
            return true;
        } else {
            this.disconnect(part);
            part.disconnect(this);
            return false;
        }
    }

    connect(part) {
    //    meant to be overridden, dont call it here
        return false;
    }

    disconnect(part) {
        // meant to be overridden, dont call it here
        throw Error("part.disconnect run from wrong class")
    }

    draw() {
        // virtual class meant to be overridden
    }
    getPartName(){

    }
    changeValue(value) {
    //    override if you have a value
    }

    delete() {
        // Please note that this method does not account for removing the pointer to this object from the cells,
        // that must be done externally
        console.log('deleting...');
        this.connected_parts.forEach(p => {
            this.disconnect(p);
            p.draw();
        });
        this.text.text = '';
        this.graphic.clear();
        this.reset()

        delete this.graphic;
        delete this;
    }

    find_direction(part) {
        // find the direction of a part in comparison to this one
        //           1
        //      4   part    2
        //           3
        let x_difference = this.x - part.x;
        let y_difference = this.y - part.y;
        if ((x_difference || y_difference) && !(x_difference && y_difference)) {
            if (y_difference > 0) {
                return 1;
            } else if (x_difference < 0) {
                return 2;
            } else if (y_difference < 0) {
                return 3;
            } else if (x_difference > 0) {
                return 4;
            }
        } else {
            return 0;
        }
    }
    reset() {

    }



}