// Based on https://stackoverflow.com/questions/12700731/extract-path-from-text-html-canvas/30204783#30204783

var context = document.querySelector("canvas").getContext("2d");
var input = document.querySelector("input");
var w = context.canvas.width;
var h = context.canvas.height;
var bubbles = [];

context.font = "30px Athiti";
context.textAlign = "center";
// context.globalAlpha = 0.8;

window.onload = function() { generate(input.value); };
input.onkeyup = function() { generate(this.value); };

function generate(text) {
  var radius = 5;
  bubbles = []; // clear array
  context.clearRect(0, 0, w, h);

  //Break long text first
  var words = text.split(" ");
  var line = words[0];
  var lineWidth = 80;
  var lineHeight = 30;
  var y = 30;
  for(var i = 1; i < words.length; i++) {
    var testLine = line + " " + words[i];
    if(context.measureText(testLine).width > lineWidth) {
      context.fillText(line, lineWidth/2, y);
      line = words[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, lineWidth/2, y);

  var data = context.getImageData(0, 0, w, h).data.buffer;
  var data32 = new Uint32Array(data); //uint32 for speed
  for(var i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { // only if alpha mask == 255 (solid)
      bubbles.push({
        x: (i % w) * radius * 2 + radius + (Math.random()-0.5)*radius,
        y: (i / w) * radius * 2 + radius + (Math.random()-0.5)*radius,
        radius: radius + (Math.random()-0.5)*radius/2,
        count: Math.random() * 1000
      });
    }
  }
}

var bubble, x, y, radius, rgValue;
(function animate() {
  context.clearRect(0, 0, w, h);

  for(var i = 0, bubble; i < bubbles.length; i++) {
    context.beginPath();

    bubble = bubbles[i];
    x = bubble.x + Math.sin(bubble.count * 0.05) + bubble.radius;
    y = bubble.y + Math.cos(bubble.count * 0.05) + bubble.radius;
    radius = bubble.radius + Math.sin(bubble.count * 0.01) + bubble.radius/10;
    rgValue = Math.floor(200 + Math.sin(bubble.count * 0.1)*20);
    bubble.count++;

    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, 2*Math.PI);
    context.closePath();

    context.fillStyle = "rgba("+rgValue+","+rgValue+",20,0.9)";
    context.fill();
  }

  requestAnimationFrame(animate);
})();
