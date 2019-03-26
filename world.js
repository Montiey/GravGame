var world = {
    G: 12,
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

        // this.two.bind("update", function(){
            // world.update();
        // });
        setTimeout(function(){
            setInterval(world.update, 500);
        }, 2000);
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
        for(var target of world.bodies.list){

            if(target.anchored) continue;

            sumForce = new Vector();

            for(var influence of world.bodies.list){
                if(influence == target) continue;  //Don't be stuipid, stuipid

                //F = (G*m1*m2) / (d^2)

                var distance = influence.pos.subtract(target.pos);
                console.log(distance.length());
                var gravitation = (world.G * influence.mass * target.mass) / Math.pow(distance.length(), 2);

                // var thisForce = new Vector((gravitation / distance) * xDist, (gravitation / distance) * yDist);
                var thisForce = distance.multiply(gravitation / distance.length());

                sumForce.add(thisForce);
            }

            target.accel = sumForce.divide(target.mass);

            target.vel.add(target.accel);
        }

        for(var obj of world.bodies.list){
            console.log(obj.vel);
            obj.pos.add(obj.vel);
            obj.elem.translation.set(obj.pos.x, obj.pos.y);
        }
    }
}

function Body(mass){
    this.mass = mass;

    this.elem = world.two.makeCircle(0, 0, Math.sqrt((3*this.mass) / (4 * Math.PI)));
    world.bodies.list.push(this);

    this.pos = new Vector();
    this.vel = new Vector();
    this.accel = new Vector();

    return this;
}
