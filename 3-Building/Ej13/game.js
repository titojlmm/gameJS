// Existe colisión cuando la distancia entre dos objetos es menor que la suma de sus radios de colisión
function collision(obj1, obj2) {
  return distance_between(obj1, obj2) < (obj1.radius + obj2.radius);
}
// Método general para obtener la distancia entre dos objetos 2D
function distance_between(obj1, obj2) {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

var AsteroidsGame = function(id) {
  this.canvas = document.getElementById(id);
  this.c = this.canvas.getContext("2d");
  this.canvas.focus();
  this.guide = false;
  this.ship_mass = 10;
  this.ship_radius = 15;
  this.asteroid_mass = 5000;   // Mass of asteroids
  this.asteroid_push = 500000; // max force to apply in one frame
  this.mass_destroyed = 500; // Masa destruida por cada disparo
  this.health_indicator = new Indicator("salud", 5, 5, 100, 10); // indicador de salud
  this.score_indicator = new NumberIndicator("puntuación", this.canvas.width - 10, 5);
  this.level_indicator = new NumberIndicator("level", this.canvas.width / 2, 5, {align: "center"});
  this.message = new Message(this.canvas.width / 2, this.canvas.height * 0.4);
  this.fps_indicator = new NumberIndicator("fps", this.canvas.width - 10, this.canvas.height - 15, {digits: 2});
  this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
  this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
  window.requestAnimationFrame(this.frame.bind(this));
  this.reset_game();
}

AsteroidsGame.prototype.reset_game = function() {
  this.game_over = false;
  this.level = 0;  // Nivel inicial de partida (1 asteroide)
  this.score = 0;  // Puntuación obtenida
  this.ship = new Ship(
    this.ship_mass,
    this.ship_radius,
    this.canvas.width / 2,
    this.canvas.height / 2,
    1000, 200
  );
  this.projectiles = [];
  this.asteroids = [];
  this.level_up();
}



AsteroidsGame.prototype.moving_asteroid = function(elapsed) {
  var asteroid = this.new_asteroid();
  this.push_asteroid(asteroid, elapsed);
  return asteroid;
}

AsteroidsGame.prototype.new_asteroid = function() {
  return new Asteroid(
    this.asteroid_mass,
    this.canvas.width * Math.random(),
    this.canvas.height * Math.random()
  );
}

AsteroidsGame.prototype.push_asteroid = function(asteroid, elapsed) {
  elapsed = elapsed || 0.015;
  asteroid.push(2 * Math.PI * Math.random(), this.asteroid_push, elapsed);
  asteroid.twist(
    (Math.random() - 0.5) * Math.PI * this.asteroid_push * 0.02,
    elapsed
  );
}

AsteroidsGame.prototype.draw = function() {
  this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
  if(this.guide) {
    draw_grid(this.c);
    this.asteroids.forEach(function(asteroid) {
      draw_line(this.c, asteroid, this.ship);
      this.projectiles.forEach(function(projectile) {
        draw_line(this.c, projectile, asteroid);
      }, this);
    }, this);
    this.fps_indicator.draw(this.c, this.fps);
  }
  this.asteroids.forEach(function(asteroid) {
    asteroid.draw(this.c, this.guide);
  }, this);
  if(this.game_over) {
    this.message.draw(this.c, "GAME OVER", "Press space to play again");
    return;
  }
  this.ship.draw(this.c, this.guide);
  this.projectiles.forEach(function(p) {
    p.draw(this.c);
  }, this);
  // Actualización de la salud
  this.health_indicator.draw(this.c, this.ship.health, this.ship.max_health);
  this.score_indicator.draw(this.c, this.score);
  this.level_indicator.draw(this.c, this.level);
}

AsteroidsGame.prototype.update = function(elapsed) {
  if(this.asteroids.length == 0) {
    this.level_up();
  }
  this.ship.compromised = false;
  this.asteroids.forEach(function(asteroid) {
    asteroid.update(elapsed, this.c);
    if(collision(asteroid, this.ship)) {
      // Se produce una colisión entre la nave y uno de los asteroides
      this.ship.compromised = true;
    }
  }, this);
  // Comprobación del final de la partida
  if(this.ship.health <= 0) {
    this.game_over = true;
    return;
  }
  this.ship.update(elapsed, this.c);
  this.projectiles.forEach(function(p, i, projectiles) {
    p.update(elapsed, this.c);
    if(p.life <= 0) {
      projectiles.splice(i, 1);
    } else {
      this.asteroids.forEach(function(asteroid, j) {
        if(collision(asteroid, p)) {
          // Se elimina el proyectil y el asteroide original y se crean los nuevos
          projectiles.splice(i, 1);
          this.asteroids.splice(j, 1);
          this.split_asteroid(asteroid, elapsed);
        }
      }, this);
    }
  }, this);
  if(this.ship.trigger && this.ship.loaded) {
    this.projectiles.push(this.ship.projectile(elapsed));
  }
}

AsteroidsGame.prototype.split_asteroid = function(asteroid, elapsed) {
  // La nueva masa disminuye en la cantidad predefinida
  asteroid.mass -= this.mass_destroyed;
  // La puntuación se incrementa en la cantidad predefinida
  this.score += this.mass_destroyed;
  var split = 0.25 + 0.5 * Math.random(); // split unevenly (con un mínimo de 1/4)
  var ch1 = asteroid.child(asteroid.mass * split);
  var ch2 = asteroid.child(asteroid.mass * (1 - split));
  [ch1, ch2].forEach(function(child) {
    if(child.mass < this.mass_destroyed) {
      // Si la masa es menor que la crítica, se incrementa la puntuación y no se crea el nuevo asteroide
      this.score += child.mass;
    } else {
      // Se crea el nuevo asteroide
      this.push_asteroid(child, elapsed);
      this.asteroids.push(child);
    }
  }, this);
}

AsteroidsGame.prototype.level_up = function() {
  this.level += 1;
  for(var i = 0; i < this.level; i++) {
    this.asteroids.push(this.moving_asteroid());
  }
}

AsteroidsGame.prototype.frame = function(timestamp) {
  if (!this.previous) this.previous = timestamp;
  var elapsed = timestamp - this.previous;
  this.fps = 1000 / elapsed;
  this.update(elapsed / 1000);
  this.draw();
  this.previous = timestamp;
  window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.keyDown = function(e) {
  this.key_handler(e, true);
}
AsteroidsGame.prototype.keyUp = function(e) {
  this.key_handler(e, false);
}

AsteroidsGame.prototype.key_handler = function(e, value) {
  var nothing_handled = false;
  switch(e.key || e.keyCode) {
    case "ArrowLeft":
    case 37: // left arrow
      this.ship.left_thruster = value;
      break;
    case "ArrowUp":
    case 38: // up arrow
      this.ship.thruster_on = value;
      break;
    case "ArrowRight":
    case 39: // right arrow
      this.ship.right_thruster = value;
      break;
    case "ArrowDown":
    case 40:
      this.ship.retro_on = value;
      break;
    case " ":
    case 32: //spacebar
      if(this.game_over) {
        this.reset_game();
      } else {
        this.ship.trigger = value;
      }
      break;
    case "g":
    case 71: // g for guide
      if(value) this.guide = !this.guide;
      break;
    default:
      nothing_handled = true;
  }
  if(!nothing_handled) e.preventDefault();
}
