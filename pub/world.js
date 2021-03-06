var world = {
    G: .001,   //Big G constant (force multiplier)
    two: null,  //Two canvas object
    elem: null, //JQuery node of the canvas
    target: null,   //Selected Body
	init: function(){
		this.two = new Two({
		    type: Two.Types["svg"],
		    autostart: true,
            width: 800,
            height: 600
        });
		this.two.appendTo($("#canvasContainer").get(0));

		this.elem = $(this.two.renderer.domElement);
		this.elem.attr("id", "canvas");

        this.two.bind("update", function(){
            world.draw();
        });

        var clockSlider = new Slider($("#speedSlider"), $("#speedLabel"), function(self){
            var clock = Math.round(self.value);
            world.setClock(100-clock);
            self.label.text(clock + "%");
        });
        world.setClock(50);
        $("#speedContainer").append(clockSlider.elem);

        var zoomIncrement = new Increment(function(self){
            console.log(self.value);
        });
        $("#zoomContainer").append(zoomIncrement.elem);
	},
    setClock: function(del){
        clearInterval(world.clockInterval);
        world.clockInterval = setInterval(world.calculate, del);
    },
    bodies: {   //Manager for Bodies
        add: function(obj){
            this.list.push(obj);
        },
        remove: function(obj){
            this.list.splice(this.list.indexOf(obj), 1);
            if(world.target == obj && this.list.length > 0){
                this.list[0].select();
            }
            obj.panelEntry.elem.remove();
            world.two.remove(obj.elem);
            world.two.remove(obj.pointerGroup);
        },
        list: []
    },
    calculate: function(){  //Calculate gravity, positions of Bodies
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

            target.vel.add(Vector.divide(sumForce, target.mass));	//Increment vel by accel
        }
        for(var target of world.bodies.list){   //Update positions
            target.pos.add(target.vel);
			if(target.isShip){
				target.rot += target.rVel;
				var mag = target.vel.length();
				target.vel.x += target.burnAccel * Math.cos(target.rot - Math.PI/2);
				target.vel.y += target.burnAccel * Math.sin(target.rot - Math.PI/2);
			}
        }
        for(var a = 0; a < world.bodies.list.length; a++){  //Test for collisions
            for(var b = a; b < world.bodies.list.length; b++){  //TODO: Reduce duplicate checks by 1?
                var testA = world.bodies.list[a];
                var testB = world.bodies.list[b];

                if(testA == testB) continue;
                if(collide(testA, testB)){
                    world.bodies.add(combine(testA, testB));
                    world.bodies.remove(testA);
                    world.bodies.remove(testB);
                }
            }
        }
    },
    draw: function(){   //Update each body's visual position (Two element)
        var viewportDelta = new Vector(world.two.width/2, world.two.height/2).subtract(world.target.pos);   //Arbitrary distance from world coordinates to center of Two canvas

        for(var obj of world.bodies.list){
            obj.elem.translation.set(obj.pos.x + viewportDelta.x, obj.pos.y + viewportDelta.y); //Set the element's position relative to the viewport

            if(within(obj.elem.translation.x, -obj.radius, world.two.width + obj.radius) && within(obj.elem.translation.y, -obj.radius, world.two.height + obj.radius)){  //Draw the object, or...
                obj.pointerGroup.translation.set(-999, -999);   //TODO: hide better?
            } else{ //...draw a pointer
                obj.pointerGroup.translation.set(bound(obj.elem.translation.x, 0, world.two.width), bound(obj.elem.translation.y, 0, world.two.height));    //TODO: Make the angle not stuipid, point correctly near corners
                obj.elem.translation.set(-999, -999);   //TODO: hide better?
                obj.pointerGroup.rotation = Math.atan2((world.target.pos.y - obj.pos.y), (world.target.pos.x - obj.pos.x)) - Math.PI/2;
                obj.pointerGroup.scale = Math.max(0.3, 400/Vector.subtract(world.target.pos, obj.pos).length());
                if(obj.pointerGroup.scale == 0.3){
                    obj.pointerGroup.fill = "rgb(181, 181, 181)";
                } else{
                    obj.pointerGroup.fill = "#0ff";
                }
            }
			if(obj.isShip){
				obj.elem.rotation = obj.rot;
			}
        }
    }
}

function Body(mass){    //Make a new Body
    this.mass = mass;
    this.radius = Math.sqrt((3*this.mass) / (4 * Math.PI));
    this.elem = world.two.makeCircle(0, 0, this.radius);   //Emulate the volume of a sphere

    this.pos = new Vector();
    this.vel = new Vector();
    // this.accel = new Vector();

    this.elem.linewidth = 5;
    this.elem.stroke = null;

    ////////


    this.select = function(){  //Select it
        if(world.target != undefined) world.target.unselect();
        this.elem.fill = "#f00";
        this.selected = true;
        world.target = this;
        this.panelEntry.elem.addClass("entrySelected");
    }
    this.unselect = function(){ //Unselect it
        this.selected = false;
        this.elem.fill = "#fff";
        world.target = null;
        this.panelEntry.elem.removeClass("entrySelected");
    }


    this.highlight = function(){    //Activate its border
        this.elem.stroke = "#00f";
        this.pointerGroup.stroke = "#00f";
        this.panelEntry.elem.addClass("entryHover");
    }
    this.unhighlight = function(){  //Deactivate its border
        this.elem.stroke = null
        this.pointerGroup.stroke = null;
        this.panelEntry.elem.removeClass("entryHover");
    }

    this.panelEntry = new BodyPanelEntry(this);

    if(world.target == null) this.select();

    var local = this;   //TODO: escape callback hell

    var p = world.two.makePolygon(0, 0, 20, 3);
    p.translation.set(0, 20);
    p.fill = "#0f0";
    p.stroke = null;
    p.linewidth = 5;

    this.pointerGroup = world.two.makeGroup(p);

    world.two.update(); //Needed to attach event listeners

    this.elem._renderer.elem.addEventListener("mousedown", function(){
        local.select();
    });
    this.elem._renderer.elem.addEventListener("mouseenter", function(){
        local.highlight();
    });
    this.elem._renderer.elem.addEventListener("mouseleave", function(){
        local.unhighlight();
    });
    p._renderer.elem.addEventListener("mousedown", function(){
        local.select();
    });
    p._renderer.elem.addEventListener("mouseenter", function(){
        local.highlight();
    });
    p._renderer.elem.addEventListener("mouseleave", function(){
        local.unhighlight();
    });

    return this;
}

function Ship(mass){
	this.isShip = true;

    this.mass = mass;
    this.radius = 5;
	var _nose = world.two.makePolygon(0, 0, 5.79, 3);
	var _fuse = world.two.makeRectangle(0, 0, 10, 30);
	var _nozz = world.two.makePolygon(0, 0, 5, 3);

	_nose.fill = "#eee";
	_fuse.fill = "#eee";
	_nozz.fill = "#666";

	_nose.translation.set(0, -17.85);
	_nozz.translation.set(0, 17);
	this.elem = world.two.makeGroup([_nose, _nozz, _fuse]);

    this.pos = new Vector();
    this.vel = new Vector();

	this.rot = 0;
	this.rVel = 0;

    this.elem.linewidth = 5;
    this.elem.stroke = null;

	this.burnAccel = 0;

    ////////

	this.burn = function(a){
		if(a != 0){
			if(this.burnFlash == null)
			this.burnFlash = setInterval(function(){
				_nozz.fill = (_nozz.fill == "#ffb" ? _nozz.fill = "#666" : _nozz.fill = "#ffb");
			}, 50);
		} else{
			clearInterval(this.burnFlash);
			this.burnFlash = null
			_nozz.fill = "#666";
		}
		this.burnAccel = a;
	}

    this.select = function(){  //Select it
        if(world.target != undefined) world.target.unselect();
        this.selected = true;
        world.target = this;
        this.panelEntry.elem.addClass("entrySelected");
    }
    this.unselect = function(){ //Unselect it
        this.selected = false;
        world.target = null;
        this.panelEntry.elem.removeClass("entrySelected");
    }

    this.highlight = function(){    //Activate its border
        this.elem.stroke = "#00f";
        this.pointerGroup.stroke = "#00f";
        this.panelEntry.elem.addClass("entryHover");
    }
    this.unhighlight = function(){  //Deactivate its border
        this.elem.stroke = null
        this.pointerGroup.stroke = null;
        this.panelEntry.elem.removeClass("entryHover");
    }

    this.panelEntry = new BodyPanelEntry(this);

    if(world.target == null) this.select();

    var p = world.two.makePolygon(0, 0, 20, 3);
    p.translation.set(0, 20);
    p.stroke = null;
    p.linewidth = 5;

    this.pointerGroup = world.two.makeGroup(p);

    world.two.update(); //Needed to attach event listeners

	var local = this;

    this.elem._renderer.elem.addEventListener("mousedown", function(){
        local.select();
    });
    this.elem._renderer.elem.addEventListener("mouseenter", function(){
        local.highlight();
    });
    this.elem._renderer.elem.addEventListener("mouseleave", function(){
        local.unhighlight();
    });
    p._renderer.elem.addEventListener("mousedown", function(){
        local.select();
    });
    p._renderer.elem.addEventListener("mouseenter", function(){
        local.highlight();
    });
    p._renderer.elem.addEventListener("mouseleave", function(){
        local.unhighlight();
    });

    return this;
}

function BodyPanelEntry(body){
    this.elem = $(document.createElement("div"));
    this.elem.addClass("bodyEntry eRow eAlign eBetween");

    var text = $(document.createElement("div")).text("M: " + Math.round(body.mass)).addClass("entryText")

    this.elem.append(text);
    this.elem.click(function(){
        body.select();
    });

    this.elem.on("mouseenter", function(){
        body.highlight();
    });
    this.elem.on("mouseleave", function(){
        body.unhighlight();
    });

    var subbutt = $(document.createElement("div"));
    subbutt.addClass("entryDeleteButt");
    subbutt.text("X");
    subbutt.click(function(){
        world.bodies.remove(body);
    });

    this.elem.append(subbutt);

    $("#entryContainer").append(this.elem);

    return this;
}
