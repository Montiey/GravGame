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

function Slider(elem, label, callback){
    this.label = label;
    this.elem = $(document.createElement("input"));
    this.elem.addClass("dashSlider").attr("type", "range").attr("min", "1").attr("max", "100").attr("value", "50");

    this.value = null;

    this.clicked = false;
    this.interval = null;

    var slider = this;

    function doStuff(){
        slider.value = slider.elem.val();
        callback(slider);
    }

    this.elem.on("mousedown", function(){
        slider.clicked = true;
        slider.interval = setInterval(doStuff, 100);
    });

    this.elem.on("mouseup", function(){
        slider.checked = false;
        clearInterval(slider.interval);
    });
}

function Increment(callback){

}
