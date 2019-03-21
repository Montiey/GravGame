// Copyright 2019 Jason Harriot
/////////

world.init();
// var x = new Body(100);
// x.setPos(700, 500);
// x.setVel(0, 10);
//
//
// var y = new Body(10000);
// y.setPos(630, 500);
//
// world.bodies.add(x);
// world.bodies.add(y);

for(var i = 0; i < 500; i++){
	var x = new Body(Math.random() * 1000 + 100);
	x.setPos(Math.random() * world.two.width, Math.random() * world.two.height);
	world.bodies.add(x);
}
