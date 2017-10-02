// Based on https://stackoverflow.com/questions/12700731/extract-path-from-text-html-canvas/30204783#30204783

var context = document.querySelector("canvas").getContext("2d");
var input = document.querySelector("input");
var w = context.canvas.width;
var h = context.canvas.height;
var bubbles = [];

context.fillStyle = "#AAAA00";
generate(input.value);
input.onkeyup = function() { generate(this.value) };

function generate(text) {
  var radius = 5;
  bubbles = []; // clear array
  context.clearRect(0, 0, w, h);
  context.fillText(text.toUpperCase(), 0, 10);

  var data = context.getImageData(0, 0, w, h).data.buffer;
  var data32 = new Uint32Array(data); //uint32 for speed
  for(var i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { // only if alpha mask == 255 (solid)
      bubbles.push({
        x: (i % w) * radius * 2 + radius,
        y: ((i / w)|0) * radius * 2 + radius,
        radius: radius,
        a: (Math.random() * 250)|0
      });
    }
  }
}

(function animate() {
  context.clearRect(0, 0, w, h);
  context.beginPath();
  for(var i = 0, bubble; bubble = bubbles[i]; i++) {
    var dx = 0; //Math.sin(bubble.a * 0.2) + bubble.radius,
        dy = 0; //Math.cos(bubble.a++ * 0.2) + bubble.radius;
    context.moveTo(bubble.x + bubble.radius + dx, bubble.y + dy);
    context.arc(bubble.x + dx, bubble.y + dy, bubble.radius, 0, 2*Math.PI);
    context.closePath();
  }
  context.fill();
  requestAnimationFrame(animate);
})();
