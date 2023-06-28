import Part from './part.js';

export default class BasicComponent extends Part {
    constructor(x_coordinate, y_coordinate, dimension, app, color, orientation, value) {
        super(x_coordinate, y_coordinate, dimension, app, color);
        this.orientation = orientation;
        this.connected_parts = new Set();
        this.value = value;
        this.name = 'defaultname';
    }

    connect(part) {
    //    only connect to a part if it is in the current orientation or on the backside
        // if not in the current orientation, then if it's not connected to anything else, then connect
        // return bool based on whether connection was successful
        console.log('running connect in BasicComponent')
        let r;
        let dir = this.find_direction(part);
        if ((this.orientation % 2) === (dir % 2)) {
            this.connected_parts.add(part);
            r = true
        } else if (this.connected_parts.size === 0) {
            this.connected_parts.add(part);
            this.rotate(dir);
            r = true;
        } else {
            r = false;
        }
        this.draw();
        return r;
    }

    changeValue(value) {
        this.value = value;
    }

    disconnect(part) {
        this.connected_parts.delete(part);
        part.connected_parts.delete(this);
    }

    rotate(direction) {
        this.orientation = direction;
        this.draw();
    }
}