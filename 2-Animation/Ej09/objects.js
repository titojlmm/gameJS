function extend(ChildClass, ParentClass) {
  var parent = new ParentClass();
  ChildClass.prototype = parent;
  ChildClass.prototype.super = parent.constructor;
  ChildClass.prototype.constructor = ChildClass;
}

function Mass(x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
  this.x = x;
  this.y = y;
  this.mass = mass || 1;
  this.radius = radius || 50;
  this.angle = angle || 0;
  this.x_speed = x_speed || 0;
  this.y_speed = y_speed || 0;
  this.rotation_speed = rotation_speed || 0;
}

Mass.prototype.update = function(elapsed, ctx) {
  // Asegura la primera ley de Newton (Si no hay fuerzas el objeto se mueve con velocidad cte)
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;
  this.angle += this.rotation_speed * elapsed;
  this.angle %= (2 * Math.PI); // Se elimina el ángulo correspondiente a vueltas completas
  // Hace que el objeto haga la reentrada correctamente al llegar a los bordes
  if(this.x - this.radius > ctx.canvas.width) {
    // Si se supera el borde derecho, se asigna el borde izquierdo
    this.x = -this.radius;
  }
  if(this.x + this.radius < 0) {
    // Si se supera el borde izquierdo, se asigna el borde derecho
    this.x = ctx.canvas.width + this.radius;
  }
  if(this.y - this.radius > ctx.canvas.height) {
    // Si se supera el borde inferior, se asigna el borde superior
    this.y = -this.radius;
  }
  if(this.y + this.radius < 0) {
    // Si se supera el borde superior, se asigna el borde inferior
    this.y = ctx.canvas.height + this.radius;
  }
}

Mass.prototype.push = function(angle, force, elapsed) {
  // Asegura la segunda ley de Newton para el movimiento (F=m*a): a=v/t=F/m => v=t*F/m
  // Y se obtienen las componentes en ambas coordenadas en función del ángulo
  this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass;
  this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass;
}

Mass.prototype.twist = function(force, elapsed) {
  // Asegura la segunda ley de Newton para la rotación
  this.rotation_speed += elapsed * force / this.mass;
}

Mass.prototype.speed = function() {
  // Método de utilidad: obtención de la velocidad absoluta del objeto
  return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
}
Mass.prototype.movement_angle = function() {
  // Método de utilidad: obtención del ángulo de movimiento absoluto del objeto
  return Math.atan2(this.y_speed, this.x_speed);
}

Mass.prototype.draw = function(c) {
  // Método para test. Será sobreescrito en cualquier instancia de un hijo
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  c.beginPath();
  c.arc(0, 0, this.radius, 0, 2 * Math.PI);
  c.lineTo(0, 0);
  c.strokeStyle = "#FFFFFF";
  c.stroke();
  c.restore();
}

function Asteroid(x, y, mass, x_speed, y_speed, rotation_speed) {
  var density = 1; // kg per square pixel
  var radius = Math.sqrt((mass / density) / Math.PI);
  this.super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);
  this.circumference = 2 * Math.PI * this.radius;
  this.segments = Math.ceil(this.circumference / 15); // segmentos teóricos en base al tamaño
  this.segments = Math.min(25, Math.max(5, this.segments)); // forzar entre 5 y 25 segmentos
  this.noise = 0.2;
  this.shape = [];
  for(var i = 0; i < this.segments; i++) {
    this.shape.push(2 * (Math.random() - 0.5));
  }
}
extend(Asteroid, Mass);

Asteroid.prototype.draw = function(ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_asteroid(ctx, this.radius, this.shape, {
    noise: this.noise,
    guide: guide
  });
  ctx.restore();
}

function Ship(x, y) {
  this.super(x, y, 10, 20, 1.5 * Math.PI);
}
extend(Ship, Mass);

Ship.prototype.draw = function(c, guide) {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  c.strokeStyle = "white";
  c.lineWidth = 2;
  c.fillStyle = "black";
  draw_ship(c, this.radius, {
    guide: guide
  });
  c.restore();
}
