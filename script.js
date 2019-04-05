// Copyright 2019 Jason Harriot
/////////

world.init();

// var a = new Body(10000);
// a.pos.set(0, 0);
// a.vel.set(0, 0);
//
// var b = new Body(200);
// b.pos.set(180, 0);
// b.vel.set(0, 5);
//
// var c = new Body(10);
// c.pos.set(200, 0);
// c.vel.set(0, 7.25);
//
// world.select(a);

for(var i = 0; i < 10; i++){
	var x = new Body(Math.random() * 1000 + 100);
	x.pos.set(Math.random() * world.two.width, Math.random() * world.two.height);
	x.vel.set(Math.random() * 20 - 10, Math.random() * 20 - 10);
	world.bodies.add(x);
}
