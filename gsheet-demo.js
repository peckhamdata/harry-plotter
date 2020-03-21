const Bezier = require('bezier-js');

const Plotter = require("./src/gsheet_plotter.js");

const img_size = 255;

function lcg_sequence(seed, max, min, length) {
    max = max || 1;
    min = min || 0;
    var result = []
  var i=0;
  for (i=0; i < length; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280;
   
      result.push(min + rnd * (max - min));
      seed++
  }
    return result;
 
}

function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
}

var creds = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "ypur-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-client-x509-cert-url"
}


plotter = new Plotter('your-sheet-id', creds, img_size);

plotter.init(function() {}).then (function() {
  var pointAngleInRadians = 0;
  var points = [];
  var radius = (img_size / 2);
  for (pointAngleInRadians = 0; 
       pointAngleInRadians <= 7; 
       pointAngleInRadians+=(Math.PI/360)) {
    var x = Math.cos(pointAngleInRadians) * radius;
    var y = Math.sin(pointAngleInRadians) * radius;
    points.push({x: x + (img_size / 2), y: y + (img_size / 2)})
  }
  var rgb = lcg_sequence(img_size-i,0, 1, 3)
  var colours = {red: rgb[0], green: rgb[1], blue: rgb[2]} 
  plotter.plot_points(points, colours);
  plotter.write()

  var i=0;
  var j=0;
  for(i=0; i < 10; i+=1) {
    var seq = lcg_sequence(img_size-i, points.length, 0, 3)
    var rgb = lcg_sequence(img_size/i, 1, 0, 3)
    var colours = {red: rgb[0], green: rgb[1], blue: rgb[2]} 
    var bez = new Bezier(points[Math.floor(Math.abs(seq[0]))].x, 
                         points[Math.floor(Math.abs(seq[0]))].y,
                         points[Math.floor(Math.abs(seq[1]))].x, 
                         points[Math.floor(Math.abs(seq[1]))].y,
                         points[Math.floor(Math.abs(seq[2]))].x, 
                         points[Math.floor(Math.abs(seq[2]))].y)

    plotter.plot_points(bez.getLUT(img_size * 2), colours);
    plotter.write()
    j++;
  }
})
