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

function draw_ghost(ctx, radius, options) {
  options = options || {}
  var feet = options.feet || 4;
  var head_radius = radius * 0.8;
  var foot_radius = head_radius / feet;
  ctx.save();
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "red";
  ctx.lineWidth = options.lineWidth || radius * 0.05;
  ctx.beginPath();
  for(foot = 0; foot < feet; foot++) {
    ctx.arc(
      (2 * foot_radius * (feet - foot)) - head_radius - foot_radius,
      radius - foot_radius,
      foot_radius, 0, Math.PI
     );
  }
  ctx.lineTo(-head_radius, radius - foot_radius);
  ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ojos
  ctx.fillStyle = "white";
  ctx.translate((head_radius - radius)*1.8, (head_radius - radius)*1.8);
  ctx.beginPath();
  ctx.arc(0, 0, radius/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(2*(radius/4)+(radius/12), 0, radius/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Pupilas
  ctx.fillStyle = "black";
  ctx.translate(-radius/12, radius/12);
  ctx.beginPath();
  ctx.arc(0, 0, radius/8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(2*(radius/4)+(radius/12), 0, radius/8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function keydown_handler(e) {
  let key = e.key || e.keyCode;
  let nothing_handled = false;
  switch(key) {
    case "ArrowLeft":
    case 37: // left arrow keyCode
      pacman.move_left();
      break;
    case "ArrowUp":
    case 38: // up arrow keyCode
      pacman.move_up();
      break;
    case "ArrowRight":
    case 39: // right arrow keyCode
      pacman.move_right();
      break;
    case "ArrowDown":
    case 40: // down arrow keyCode
      pacman.move_down();
      break;
    default:
      nothing_handled = true;
  }
  // Deshabilita comportamiento por defecto para las teclas gestionadas
  if(!nothing_handled) e.preventDefault();
}
