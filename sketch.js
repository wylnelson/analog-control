var asteroids = [];
var moon = [];

var serial;
var portName = '/dev/cu.usbmodem1421';
var options = {
  baudrate: 9600
}
var inData;



function setup() {
  createCanvas(600, 600);
  inData = 0;
   map(inData, 0, 255, 0, 5);

  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  serial.list();
  serial.open(portName);

  for (var j = 0; j < 1; j++)
    moon[j] = new Moon(300, 700, 30, 255, 1);

  for (var i = 0; i < 20; i++) {
    asteroids[i] = new Asteroid(random(250, 300), random(250, 300), random(100, 270), random(0, 360), random(20, 50), random(50, 200));
  }

}

function draw() {
  background(0);
  for (var j = 0; j < moon.length; j++) {
    moon[j].display();

    for (var i = 0; i < asteroids.length; i++) {
      if (moon[j].collide(asteroids[i])) {
        text("YOU CRASHED THE MOON", 200, 300);
        noLoop();
      }
    }

    if (moon[j].y1 < 600 && moon[j].y1 > 0) {
      text("SAVE THE MOON FROM THE ASTEROID BELT", 150, 550)
    }
    if (moon[j].y1 < -30) {
      fill(50);
      stroke(255);
      textSize(40);
      text("YOU SAVED THE MOON!", 50, 300)
        noLoop();
    }

  }

  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].display();
      
  }

  fill(255);
  text("sensor value: " + inData, 30, 30);

}

function Asteroid(x, y, r, rad1, radius, cc) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.rad1 = rad1;
  this.radius = radius;
  this.cc = cc;

  this.display = function() {
    fill(this.cc);
    stroke(0);
    ellipse(this.x + this.r * cos(radians(this.rad1)), this.y + this.r * sin(radians(this.rad1)), this.radius); //code inspired by Rodger
  this.rad1 += inData;
  }
}

function Moon(x1, y1, r1, cc1, speed1) {
  this.x1 = x1;
  this.y1 = y1;
  this.r1 = r1;
  this.cc1 = cc1;
  this.speed1 = speed1;

  this.display = function() {
    fill(this.cc1);
    ellipse(this.x1, this.y1, this.r1, this.r1);
    this.y1 = this.y1 - speed1;
  }

  this.collide = function(other) {
    var d = dist(this.x1, this.y1, other.x + other.r * cos(radians(other.rad1)), other.y + other.r * sin(radians(other.rad1)))
    if (d < this.r1) {
      return true;
    } else {
      return false;
    }
  }
}

function serverConnected() {
  println('connected to server.');
}

function portOpen() {
  println('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function portClose() {
  println('The serial port closed.');
}

function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    println(i + " " + portList[i]);
  }
}