var world = {
    G: 0.5,   //Gravitational constant (force multiplier)
    two: null,  //Two canvas
    elem: null, //JQuery node
    target: null,   //Selected Body
	init: function(){
		this.two = new Two({
		    type: Two.Types["svg"],
		    autostart: true,
        });
		this.two.appendTo($("#canvasContainer").get(0));

		this.elem = $(this.two.renderer.domElement);
		this.elem.attr("id", "canvas");

        this.two.bind("update", function(){ //Set visual attributes every time they will be displayed
            world.draw();
        });

        setInterval(world.calculate, 0);   //Under the hood, to calculations all the time
	},
    bodies: {   //Manager for Bodies
        add: function(obj){
            this.list.push(obj);
        },
        remove: function(obj){
            this.list.splice(this.list.indexOf(obj), 1);
            obj.button.elem.remove();
            world.two.remove(obj.elem);
        },
        list: []
    },
    calculate: function(){  //Calculate gravity, positions
        for(var target of world.bodies.list){
            if(target.anchored) continue;

            var sumForce = new Vector();

            for(var influence of world.bodies.list){
                if(influence == target){
                    continue;
                };  //Don't be stupid, stupid

                //F = (G*m1*m2) / (d^2)

                var distance = Vector.subtract(influence.pos, target.pos);

                var gravitation = (world.G * influence.mass * target.mass) / Math.pow(distance.length(), 2);

                var thisForce = new Vector(Math.cos(distance.toAngles()) * gravitation, Math.sin(distance.toAngles()) * gravitation);

                sumForce.add(thisForce);
            }

            target.accel = Vector.divide(sumForce, target.mass);

            target.vel.add(target.accel);
        }
        for(var target of world.bodies.list){
            target.pos.add(target.vel);
        }
    },
    draw: function(){   //Update each body's visual position
        var targetDelta = new Vector(0, 0);
        if(world.target != undefined) targetDelta = new Vector(world.two.width/2, world.two.height/2).subtract(world.target.pos);

        for(var obj of world.bodies.list){
            obj.elem.translation.set(obj.pos.x + targetDelta.x, obj.pos.y + targetDelta.y);
            if(obj.plot && obj.plotter.counter.next().value){
                var x = world.two.makeCircle(obj.pos.x, obj.pos.y, 2);
                obj.plotter.group.add(x);
            }
        }
    },
    select: function(obj){  //Make a body selected
        world.unselect(world.target);
        obj.elem.fill = "#fbb";
        obj.selected = true;
        world.target = obj;
    },
    unselect: function(obj){    //Make a body unselected
        if(obj == undefined) return;
        obj.selected = false;
        obj.elem.fill = "#fff";
        world.target = null;
    },
    toggle: function(obj){
        if(obj.selected){
            world.unselect(obj);
        } else{
            world.select(obj);
        }
    }
}

function Body(mass){    //Make a new Body
    this.mass = mass;

    this.elem = world.two.makeCircle(0, 0, Math.sqrt((3*this.mass) / (4 * Math.PI)));   //Emulate the volume of a sphere

    this.pos = new Vector();
    this.vel = new Vector();
    this.accel = new Vector();

	function* everyN(num){ //TODO: Better place to put this?
		var curr = 0;
		while(1){
			curr++;
			if(curr == num){
				curr = 0;
				yield 1;
			}
			else yield 0;
		}
	}

    this.plotter = {
        counter: everyN(2),
        group: world.two.makeGroup()
    }

    var local = this;   //Todo: escape callback hell

    world.two.update();

    this.elem.linewidth = 5;
    this.elem.stroke = null;

    this.elem._renderer.elem.addEventListener("mousedown", function(){
        world.toggle(local);
    });

    this.elem._renderer.elem.addEventListener("mouseenter", function(){
        local.elem.stroke = "#00f";
    });

    this.elem._renderer.elem.addEventListener("mouseleave", function(){
        local.elem.stroke = null;
    });

    this.button = new BodyEntry(this);

    return this;
}

function BodyEntry(body){
    this.elem = $(document.createElement("div"));
    this.elem.addClass("bodyEntry eRow eCenter eAround");

    var text = $(document.createElement("div")).text("Mass: " + body.mass).addClass("entryText")


    this.elem.append(text);
    this.elem.click(function(){
        world.toggle(body);
    });
    var subbutt = $(document.createElement("div"));
    subbutt.addClass("entryDeleteButt");
    subbutt.text("Delete");
    subbutt.click(function(){
        world.bodies.remove(body);
    });

    this.elem.append(subbutt);

    $("#entryContainer").append(this.elem);

    return this;
}
