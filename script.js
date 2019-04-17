// Copyright 2019 Jason Harriot
/////////

world.init();

for(var i = 0; i < 3; i++){
	var x = new Body(Math.random() * 1000 + 100);
	x.pos.set(Math.random() * world.two.width, Math.random() * world.two.height);
	x.vel.set(Math.random() * 20 - 10, Math.random() * 20 - 10);
	world.bodies.add(x);
}
