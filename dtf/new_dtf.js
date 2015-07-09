// if (window.addEventListener) {
//   window.addEventListener('load', init(), false);
//  }


function Canvas(elem_name, img_path, grid_miles, pix_grid_x, pix_grid_y) {
  this.elem_name = elem_name;
  this.img_path = img_path;
  this.grid_miles = grid_miles;
  this.pix_grid_x = pix_grid_x;
  this.pix_grid_y = pix_grid_y;

  this.elem = document.getElementById(this.elem_name);

  this.ctx = this.elem.getContext('2d');
  
  this.tmp_cnvs = document.createElement('canvas');
  this.tctx = this.tmp_cnvs.getContext('2d');
  this.elem.parentNode.appendChild(this.tmp_cnvs);
  this.tmp_cnvs.id = "tmpcnvs";

  // Methods
  this.drawMap = function() {
    var img = new Image();
    img = document.createElement('img');
    img.id = 'mapimg';
    img.src = this.img_path;
    this.ctx.drawImage(img, 0, 0);
    this.tctx.moveTo(0,0);
    this.tctx.lineTo(1024,1024);
    this.tctx.stroke();
  };
}



function change_map() {
  var ter = document.getElementById("terrain");
  var key = ter.options[ter.selectedIndex].value;
  var c = all_cnvs[key];
  c.drawMap();
}

function start_path(ev) {
  if (! started) {
    started = true;
    lastx = ev.layerX;
    lasty = ev.layerY;
    var canv = document.getElementById('tmp');
    var ctx = canv.getContext('2d');
    ctx.clearRect(0,0, canv.width, canv.height);
    ctx.beginPath();
    ctx.moveTo(lastx, lasty);
  }
}

function end_segment(ev) {
  if (started) {
    var tmp = document.getElementById('tmp');
    var tctx = tmp.getContext('2d');
    tctx.lineTo(ev.layerX, ev.layerY);
    tctx.stroke();
    var canv = document.getElementById('mycanvas');
    var ctx = canv.getContext('2d');
    ctx.drawImage(tmp, 0, 0);
    
    lastx = ev.layerX;
    lasty = ev.layerY;
  }
}

function end_path(ev) {
  if (started) {
    started = false;
    var canv = document.getElementById('mycanvas');
    var tmp = document.getElementById('tmp');
    var tctx = tmp.getContext('2d');
    tctx.lineTo(ev.layerX, ev.layerY);

    var ctx = canv.getContext('2d');
    ctx.drawImage(tmp, 0, 0);
  }
}

function show_segment(ev) {
  if (started) {
    var tmp = document.getElementById('tmp');
    var ctx = tmp.getContext('2d');
    ctx.clearRect(0, 0, tmp.width, tmp.height);
    ctx.beginPath();
    ctx.moveTo(lastx, lasty);
    ctx.lineTo(ev.layerX, ev.layerY);
    ctx.stroke();
  }
}

function load_image(img_src) {

  var e = document.getElementById('mycanvas');
  var tmp = document.getElementById('tmp');
  if (! e) {
    alert("Could not get canvas");
    return;
  }

  var ctx = e.getContext('2d');

  var img = new Image();
  img = document.createElement('img');
  img.id = 'map';
  img.src = img_src;
  img.onload = function () { ctx.drawImage(img, 0, 0); }
  tmp.addEventListener('mousedown', start_path, false);
  tmp.addEventListener('mouseup',  end_segment, false);
  tmp.addEventListener('mousemove', show_segment, false);
  tmp.addEventListener('dblclick', end_path, false);
  tctx = tmp.getContext('2d');
  tctx.lineJoin = "round";
  tctx.lineWidth = 10;
}

var all_cnvs; 

function init() {
  all_cnvs = {
    'Crimea' : new Canvas('map', 'maps/crimea.png', 20, 96, 96),
    'ETO'    : new Canvas('map', 'maps/eto.png', 38.1, 96, 96),
    'Philippines' : new Canvas('map', 'maps/philippines.png', 20.6, 96, 96),
    'Tunisia' : new Canvas('map', 'maps/tunisia.png', 20, 96, 96),
    'Tunisia 256' : new Canvas('map', 'maps/tunisia256.png', 20, 96, 96),
    'Malta' : new Canvas('map', 'maps/malta.png', 20, 96, 96),
    'Malta 256' : new Canvas('map', 'maps/malta256.png', 20, 96, 96),
    'Europe' : new Canvas('map', 'maps/europe.png', 20, 96, 96),
    'Europe 256' : new Canvas('map', 'maps/europe256.png', 20, 96, 96),
    'Wfront' : new Canvas('map', 'maps/wfront.png', 18.8, 96, 96),
    'Tobruk' : new Canvas('map', 'maps/tobruk.png', 38.1, 96, 96),
    'Atoll' :  new Canvas('map', 'maps/atoll.png', 9.85, 96, 96),
    'Korean Peninsula' : new Canvas('map', 'maps/korean.png', 38.1, 96, 96),
    'Japan Islands' : new Canvas('map', 'maps/japan.png', 38.1, 96, 96),
    'Ardennes' : new Canvas('map', 'maps/ardennes.png', 10.3, 96, 96)
  }
  lastx = -1;
  lasty = -1;
  started = false;
  var ter = document.getElementById("terrain");
  for (k in all_cnvs) {
    if (all_cnvs.hasOwnProperty(k)) {
      var opt = document.createElement("option");
      opt.textContent = k;
      opt.value = k;
      ter.add(opt);
    }
  }
  ter.addEventListener("change", change_map, false);
  change_map();
}
