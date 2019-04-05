function bound(val, a, b){
    if(a > b) return Math.min(Math.max(val, b), a);
    return Math.min(Math.max(val, a), b);
}

function within(val, a, b){
    return bound(val, a, b) == val;
}

function collide(a, b){
    var dist = Vector.subtract(a.pos, b.pos).length();
    return Math.abs(dist) < a.radius + b.radius;
}

function combine(a, b){
    var obj = new Body(a.mass + b.mass);
    obj.pos = Vector.multiply(a.pos, a.mass).add(Vector.multiply(b.pos, b.mass)).divide(a.mass + b.mass);
    obj.vel = Vector.multiply(a.vel, a.mass).add(Vector.multiply(b.vel, b.mass)).divide(a.mass + b.mass);
    if(world.target == a || world.target == b) obj.select();
    return obj;
}
