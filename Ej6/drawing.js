/*
  ctx Canvas context
  minor (Optional) Pixels for the minor scale (defaults to 10)
  major (Optional) Pixels for the major scale (defaults to 5*minor)
  stroke (Optional) Stroke color for this context (defaults to #00FF00)
  fill (Optional) Fill color for this context (defaults to #009900)
*/
function draw_grid(ctx, minor, major, stroke, fill) {
  // Set default values for minor,  major, stroke and fill
  minor = minor || 10;
  major = major || minor * 5;
  stroke = stroke || "#00FF00";
  fill = fill || "#009900";
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  // Assign variable width and height from the canvas context
  let width = ctx.canvas.width, height = ctx.canvas.height
  for(var x = 0; x < width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
    ctx.stroke();
    if(x % major == 0 ) {ctx.fillText(x, x, 10);}
  }
  for(var y = 0; y < height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
    ctx.stroke();
    if(y % major == 0 ) {ctx.fillText(y, 0, y + 10);}
  }
  ctx.restore();
}

/*
  ctx Canvas context
  radius Size of the pac-man
  mouth apertura de la boca
*/
function draw_pacman(ctx, radius, mouth) {
  angle = 0.2 * Math.PI * mouth;
  ctx.save();
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, angle, -angle);
  ctx.lineTo(0, 0);
  ctx.closePath()
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

  /*
  ctx Canvas context
  (x,y) Coordinates of the center of the ship => (0, 0) ya que se hará una translación sobre el centro
  radious Radious of the circle containing the ship
  options Object with options to display the ship:
          guide to collision, default values for width, stroke color, fill color, angle
*/
function draw_ship(ctx, radius, options) {
  options = options || {};
  ctx.save();
  // optionally draw a guide showing the collision radius
  if(options.guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
  // set some default values
  ctx.lineWidth = options.lineWidth || 2;
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  let angle = (options.angle || 0.5 * Math.PI) / 2;
  let curve1 = options.curve1 || 0.25;
  let curve2 = options.curve2 || 0.75;
  // draw the ship in three lines
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  // Hacemos que las línes de la nave sean todas curvas (ya no podemos usar closePath para la última)
  ctx.quadraticCurveTo(
    Math.cos(angle) * radius * curve2,
    Math.sin(angle) * radius * curve2,
    Math.cos(Math.PI - angle) * radius,
    Math.sin(Math.PI - angle) * radius
  );
  ctx.quadraticCurveTo(-radius * curve1, 0,
    Math.cos(Math.PI + angle) * radius,
    Math.sin(Math.PI + angle) * radius
  );
  ctx.quadraticCurveTo(
    Math.cos(-angle) * radius * curve2,
    Math.sin(-angle) * radius * curve2,
    radius, 0
  );
  ctx.fill();
  ctx.stroke();
  // a new guide line and circle show the control point
  if(options.guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(-angle) * radius,
      Math.sin(-angle) * radius
    );
    ctx.lineTo(0, 0);
    ctx.lineTo(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius
    );
    ctx.moveTo(-radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      Math.cos(angle) * radius * curve2,
      Math.sin(angle) * radius * curve2,
      radius/40, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      Math.cos(-angle) * radius * curve2,
      Math.sin(-angle) * radius * curve2,
      radius/40, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * curve1 - radius, 0, radius/50, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function draw_asteroid(ctx, radius, segments, options) {
/*
  options = options || {};
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  ctx.save();
  ctx.beginPath();
  for(let i = 0; i < segments; i++) {
    ctx.rotate(2 * Math.PI / segments);
    // No randomness
    //ctx.lineTo(radius, 0);
    //A simplistic approach - we don't want totally random
    //ctx.lineTo(radius * Math.random(), 0);
    //This is much better, only a bit random
    //ctx.lineTo(radius * 0.8 + radius * 0.4 * Math.random(), 0);
    //This is neat, configurable and keeps the radius about right
    ctx.lineTo(radius + radius * options.noise * (Math.random() - 0.5), 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if(options.guide) {
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, radius + radius * options.noise * 0.5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, radius - radius * options.noise * 0.5, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
*/
  options = options || {};
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  ctx.save();
  ctx.beginPath();
  for(let i = 0; i < shape.length; i++) {
    ctx.rotate(2 * Math.PI / shape.length);
    ctx.lineTo(radius + radius * options.noise * shape[i], 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if(options.guide) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.arc(0, 0, radius + radius * options.noise, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - radius * options.noise, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}
