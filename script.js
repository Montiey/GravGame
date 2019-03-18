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

var two = new Two({
    type: Two.Types["canvas"],
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

var twoE = $(two.renderer.domElement);
twoE.addClass("canvas");

function doResize(){
    two.width = window.innerWidth;
    two.height = window.innerHeight;
}

doResize();
window.addEventListener("resize", doResize);



two.makeCircle(10, 10, 200);
