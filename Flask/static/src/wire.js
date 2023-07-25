import Part from './part.js';

export default class Wire extends Part {
    constructor(x_coordinate, y_coordinate, dimension, app, color) {
        super(x_coordinate, y_coordinate, dimension, app, color);
        this.color = color;
        this.connected_parts = new Set();
        this.name = 'Wire';
        this.nodeNum = null;
    }

    getPartName(){
        return 'Wire';
    }

    draw() {
        /**
         * recreate the way the object looks on screen
         */
         // console.log('running draw in wire')
        this.graphic.clear()
        if ((this.connected_parts.size !== 2)) { //if you want to see a big circle
            this.#create_node(this.dimension / 6); // create a big node
        } else {
            this.#create_node(this.dimension / 15); //create a small node
        }
        this.#draw_a_wire(); // code that actually draws the wire
    }

    delete() {
        // this.connected_parts.forEach(part => (
        //     this.disconnect(part)
        // ));
        // delete this.connected_parts;
        super.delete()
    }

    connect(part) {
        this.connected_parts.add(part);
        this.draw();
        return true;
    }

    disconnect(part) {
        this.connected_parts.delete(part);
        part.connected_parts.delete(this);
        // this.draw();
        // part.draw();
    }

    #create_node(size) {
        // console.log('creating node')
        this.graphic.beginFill(this.color);
        this.graphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, size);
        this.graphic.endFill();
        // this.app.stage.addChild(this.graphic);
    }

    #draw_a_wire() {
        this.graphic.lineStyle(this.dimension/7, this.color);
        let display_directions = new Set();
        this.connected_parts.forEach(part => {
            display_directions.add(this.#find_direction(part))
        })
        display_directions.forEach(dir => {
            let y_change;
            let x_change;
            if (dir % 2 === 0) {
                y_change = 0
                if (dir === 2) {
                    x_change = 1
                } else {
                    x_change = -1
                }
            } else {
                x_change = 0
                if (dir === 3) {
                    y_change = 1
                } else {
                    y_change = -1
                }
            }
            let x_location = this.xpixels + this.dimension / 2; //center on the cell
            let y_location = this.ypixels + this.dimension / 2;
            this.graphic.moveTo(x_location, y_location); // move to center of cell
            x_change = ((x_change * this.dimension))/2
            y_change = ((y_change * this.dimension))/2
            this.graphic.lineTo(x_location + x_change, y_location + y_change);
            // this.app.stage.addChild(this.graphic);
        });
        display_directions = null; // free so it can be garbage collected
    }

    #find_direction(part) {
        let x_diff = part.x - this.x; //find the direction which the cell is in
        let y_diff = part.y - this.y;
        let direction = null;
        // direction system has 1 up, 2, right, 3 down, 4 left
        if ((x_diff !== 0) || (y_diff !== 0)) {
            if (x_diff === 1) {
                direction = 2
            } else if (x_diff === -1) {
                direction = 4
            } else if (y_diff === -1) {
                direction = 1
            } else if (y_diff === 1) {
                direction = 3
            }
        } return direction
    }

}