// Copyright 2019 Jason Harriot
/////////

world.init();

var craft = new Ship(10);
world.bodies.add(craft);

for(var i = 0; i < 5; i++){
	var x = new Body(10e4);
	x.pos.set(Math.random() * 5000 - 1000, Math.random() * 5000 - 1000);
	x.vel.set(0, .75);
	world.bodies.add(x);
}

document.addEventListener("keydown", function(e){
	if(e.repeat) return;
	switch(e.code){
		case "KeyW":
			craft.burn(.03);
		break;

		case "KeyS":
			craft.burn(0);
		break;

		case "KeyA":
			craft.rVel -= .01;
		break;

		case "KeyD":
			craft.rVel += .01;
		break;
	}
});
