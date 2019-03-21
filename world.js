var world = {
    G: 2,
    two: null,
    elem: null,
	init: function(){
		this.two = new Two({
		    type: Two.Types["canvas"],
		    autostart: true,
			fullscreen: true
        });
		this.two.appendTo($("#canvasContainer").get(0));

		this.elem = $(this.two.renderer.domElement);

		this.elem.attr("id", "canvas");

        this.two.bind("update", function(){
            world.update();
        });
	},
    bodies: {
        add: function(obj){
            this.list.push(obj);
        },
        list: [],
        dump: function(){
            console.log("Bodies: ");
            for(var i = 0; i < this.list.length; i++){
                console.log("i: " +  JSON.stringify(this.list[i]));
            }
        }
    },
    update: function(){
        for(var obj of this.bodies.list){

            force = {
                x: 0,
                y: 0
            }

            for(var i of this.bodies.list){
                if(i == obj) continue;

                //F = (G*m1*m2) / (d^2)

                var xDist = i.getPos().x - obj.getPos().x;
                var yDist = i.getPos().y - obj.getPos().y;

                var distance = Math.sqrt(Math.pow(xDist , 2) + Math.pow(yDist, 2))

                var forceMag = (world.G * i.mass * obj.mass) / Math.pow(distance, 2);

                thisForce = {
                    x: (forceMag / distance) * xDist,
                    y: (forceMag / distance) * yDist
                }

                force.x += thisForce.x;
                force.y += thisForce.y;

            }


            obj.accel.x = force.x / obj.mass;
            obj.accel.y = force.y / obj.mass;


            // console.log("Sum force: " + JSON.stringify(force));

            obj.velocity.x += obj.accel.x;
            obj.velocity.y += obj.accel.y;

            let currPos = obj.getPos();
            obj.setPos(currPos.x + obj.velocity.x, currPos.y + obj.velocity.y);

            if(obj.plot){
                if(Math.random() < .3) var p = world.two.makeCircle(obj.getPos().x, obj.getPos().y, 2);
            }
        }
    }
}

function Body(mass){
    this.mass = mass;

    var radius = Math.sqrt((3*mass) / (4 * Math.PI));

    this.elem = world.two.makeCircle(0, 0, radius);

    this.setPos = function(x, y){
        this.elem.translation.set(x, y);
    }

    this.getPos = function(){
        return {
            x: this.elem.translation.x,
            y: this.elem.translation.y
        }
    }

    this.setVel = function(x, y){
        this.velocity = {x: x, y: y};
    }

    this.velocity = {
        x: 0,
        y: 0
    }

    this.accel = {
        x: 0,
        y: 0
    }

    this.remove = function(){
        var index = world.bodies.list.indexOf(this);
        console.log("Index: " + index);
        world.bodies.list.slice(index);
    }

    return this;
}
