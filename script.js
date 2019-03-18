//Data
var bodies = [
    {
        name: "A",
        mass: "100",
        color: "#0d0"
    },
    {
        name: "B",
        mass: "20",
        color: "#00f"
    }
];

/////////

var world = {
	init: function(){
		this.two = new Two({
		    type: Two.Types["canvas"],
		    autostart: true,
			fullscreen: true
		});
		this.two.appendTo($("#canvasContainer").get(0));

		console.log(this.two);

		this.elem = $(this.two.renderer.domElement);

		this.elem.attr("id", "canvas");

		window.addEventListener("resize", this.resize);
	},
	resize: function(){
		var e = $("#canvasContainer");
	    two.width = e.width();
	    two.height = e.height();
	}
}

world.init();

world.two.makeCircle(200, 200, 100);
