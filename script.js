// Copyright 2019 Jason Harriot
/////////

world.init();
var x = new Body(100);
x.setPos(700, 500);
x.setVel(0, 8);
x.plot = true;

var x2 = new Body(100);
x2.setPos(700, 400);
x2.setVel(0, 8);
x2.plot = true;



var y = new Body(10000);
y.setPos(500, 500);
y.setVel(0, -0.1);

world.bodies.add(x2);
world.bodies.add(x);
world.bodies.add(y);
