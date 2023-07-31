export default class Confetti {
    constructor(board) {
        this.board = board;
        this.color = [0xffffff, 0xff2a5c, 0xe4ff2a, 0xa62aff, 0x3df2da, 0xff2a9c, 0x2aff9f];
        this.skew = [0.02, 0.04, 0.06, 0.08, 0.1];
        this.xPlus = [0.05, 0.1, 0.15, 0.2, 0.25];
        this.graphics = []
        this.w = window.innerWidth//Board.grid_width * Board.this.app.dimension;
        this.h = window.innerHeight //rBoard.this.grid_height * Board.this.app.dimension;
    }
    confetti = ()=> {
        var that = this;
        var xAdd = [];
        var scale = [];
        for (var i = 0; i < 100; i++) {
            var colornum = i % this.color.length
            scale.push(((Math.floor(Math.random() * 4) + 8) / 10));
            var x = Math.floor(Math.random() * this.w) + 10
            var y = Math.floor(Math.random() * this.h)
            xAdd.push(i % 2 === 0 ? 1 : -1);
            this.graphics.push(new PIXI.Graphics().beginFill(this.color[colornum], 1).drawRect(-5, -5, 10, 10));
            this.graphics[i].position.x = x;
            this.graphics[i].position.y = y;
            this.graphics[i].scale.x = scale[i];
            this.graphics[i].scale.y = scale[i];
            this.graphics[i].skew.y = i % 10 * 0.1;
            this.graphics[i].rotation = 0.1 + ((i % 5) * 0.1);
            this.board.app.stage.addChild(this.graphics[i]);

        }
        animate()

        function animate() {
            requestAnimationFrame(animate);

            for (var i = 0; i < 100; i++) {
                var y, x;
                var colornum = i % that.color.length;
                that.graphics[i].beginFill(that.color[colornum], 1).drawRect(-5, -5, 10, 10);
                if (that.graphics[i].y > that.h) {
                    y = -10
                    x = Math.floor(Math.random() * that.w) + 10;
                } else {
                    y = that.graphics[i].y + 0.2 + ((i % 5) * 0.1);
                }
                if (that.graphics[i].x > that.w - 10) {
                    xAdd[i] = -1;
                } else if (that.graphics[i].x < 10) {
                    xAdd[i] = 1;
                }
                if (xAdd[i] === -1) {
                    x = that.graphics[i].x - that.xPlus[i % 5];
                } else {
                    x = that.graphics[i].x + that.xPlus[i % 5];
                }
                that.graphics[i].scale.x = scale[i];
                that.graphics[i].scale.y = scale[i];
                that.graphics[i].position.x = x;
                that.graphics[i].position.y = y;
                that.graphics[i].skew.y += i % 2 === 0 ? that.skew[i % 5] : that.skew[i % 5] * -1;
                that.graphics[i].rotation += i % 2 === 0 ? (0.01 + ((i % 5) * 0.01)) : (0.01 + ((i % 5) * -0.01));
            }
        }
        console.log("adding confetti" + that.graphics.length);

    }

    removeConfetti() {
        console.log("a");
        for (var i = 0; i < 100; i++) {
            this.graphics[i].clear();
            this.board.app.stage.removeChild(this.graphics[i]);
        }
        // cancelAnimationFrame()
        console.log("removing confetti");
    }

}