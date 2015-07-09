/* copyright (c) noflyz 2014 raviyer@yahoo.com */
/*
    This file is part of MBL2DTF - 

    MBL2DTF is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MBL2DTF is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MBL2DTF.  If not, see <http://www.gnu.org/licenses/>.
*/

function Point(x,y) {
  this.x = x;
  this.y = y;
}

function miles(feet) {
  return feet / 5280;
}

function feet(miles) {
  return miles * 5280;
}

function distance (s,e) {
  return Math.sqrt( Math.pow((e.y - s.y), 2) + Math.pow((e.x - s.x), 2));
}

function midpoint(s,e) {
  return new Point((e.x+s.x)/2, (e.y+s.y)/2)
}

function heading (s,e) {
  var dx = e.x - s.x;
  var dy = e.y - s.y;
  if (dx != 0) {
    var slope = dy/dx;
    var angle = Math.atan(slope) * (180/Math.PI);

    var f = 0;
    if (dx < 0 && dy >= 0) {
      f = 270;
    } else if (dx < 0 && dy < 0) {
      f = 270;
    } else if (dx >= 0 && dy >= 0) {
      f = 90;
    } else if (dx >=0 && dy < 0) {
      f = 90;
    }
    var h = f - angle;

    return h;
  } else {
    if (dy < 0)
      return 180;
    else
      return 0;
  }
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function arrow(s,e) {
  var arrowLength = distance(s,e)/5.0;
  var dx = e.x - s.x;
  var dy = e.y - s.y;

  var theta = Math.atan2(dy, dx);

  var rad = Math.radians(35); // # 35 angle, can be adjusted
  var p1 = new Point(e.x - arrowLength * Math.cos(theta + rad),
   e.y - arrowLength * Math.sin(theta + rad));
  var phi2 = -rad;// Math.radians(-rad);
  var p2 = new Point(e.x - arrowLength * Math.cos(theta + phi2),
   e.y - arrowLength * Math.sin(theta + phi2));

  return [p1,p2]
}

function factorial(n) {
  if (n <= 1)
    return 1;
  return n * factorial(n-1);
}

function bcoeff(i, n) {
  return factorial(n) / (factorial(i) * factorial(n-i));
}

function get_num_segments() {
  var val = 100;
  var limitc = document.getElementById("limit-curve");
  if (limitc.checked) {
    var limit = document.getElementById("curve-limit");
    val = parseInt(limit.value);
    if (isNaN(val) || val > 100 || val < 3) {
      val = 100;
    }
  }
  return val;
}
function distance_needed() {
  var limitc = document.getElementById("show-distance");
  return limitc.checked;
}

function distance_threashold() {
  var val = 0;
  if (distance_needed()) {
    var limit = document.getElementById("distance-distance");
    val = parseInt(limit.value);
    if (isNaN(val) ) {
      val = 0;
    }
  }
  return val;
}

function lgrange_blend(points, n, x) {
  var answer = 0;
  for (var i = 0; i < points.length; ++i) {
    var p = points[i];
    var num = 1;
    var den = 1;
    for (var j = 0; j < points.length; ++j) {
      var p1 = points[j];
      if (j == i) {
	continue;
      }
      num = num * (x - p1.x);
      den = den * (p.x - p1.x);
    }
    answer = answer + p.y * (num/den);
  }
  return answer;
}

function Canvas(elem_name, img_path, grid_miles, pix_grid_x, pix_grid_y) {
  this.elem_name = elem_name;
  this.img_path = img_path;
  this.grid_miles = grid_miles;
  this.pix_grid_x = pix_grid_x;
  this.pix_grid_y = pix_grid_y;

  this.elem = document.getElementById(this.elem_name);

  this.ctx = this.elem.getContext('2d');
  
  this.tmp_cnvs = document.createElement('canvas');
  this.tmp_cnvs.width = this.elem.width;
  this.tmp_cnvs.height = this.elem.height;
  this.tctx = this.tmp_cnvs.getContext('2d');
  this.elem.parentNode.appendChild(this.tmp_cnvs);
  this.tmp_cnvs.id = "tmpcnvs";
  var img = new Image();

  // Methods
  
  // Draw the map image
  this.drawMap = function() {
    this.img = document.createElement('img');
    this.img.id = 'mapimg';
    this.img.src = this.img_path;
    var ctx = this.ctx;
    var img = this.img;
    this.img.onload = function () {ctx.drawImage(img, 0, 0);}
    this.tctx.stroke();
  };

  this.fx = function() {
    return feet(this.grid_miles) / this.pix_grid_x;
  };

  this.fy = function() {
    return feet(this.grid_miles) / this.pix_grid_y;
  };


  // given a map point, convert it to an image point
  this.map2canvas = function(point) {
    // The canvas starts at the top left with x = y = 0
    // warbirds starts with the bottom left with x = y = 0
    var x = point.x / this.fx();
    var yf = (this.img.height * this.fy()) - point.y;
    var y = yf / this.fy();
    return new Point(x, y);
  };

  this.clear_map = function () {
    this.tctx.clearRect(0,0, this.elem.width, this.elem.height);
  };

  this.dtf_arrow = function(s,e) {
    var dtf = "";
    var mid = midpoint(s,e);
    var pts = arrow(s,mid);
    dtf = dtf + mapline(mid, pts[0]);
    dtf = dtf + mapline(mid, pts[1]);
    dtf = dtf + mapline(pts[0], pts[1]);
    return dtf;
  }
  
  this.write_dtf = function(points, dist_needed) {
    var dtf = document.getElementById("dtf");
    var dtfs = "";
    var total_dist = 0;
    var seg_dist = 0;
    var run_dist = 0;
    var threshold = distance_threashold();
    var arrow_needed = document.getElementById("draw-arrow").checked;
    for (var i = 0; i < points.length -1; ++i) {
      seg_dist = miles(distance(points[i], points[i+1]));
      total_dist += seg_dist;
      run_dist += seg_dist;
      
      dtfs = dtfs + mapline(points[i], points[i+1]);
      if (arrow_needed)
        dtfs = dtfs + this.dtf_arrow(points[i], points[i+1]);
      if (dist_needed
       && (run_dist >= threshold || i == points.length-2)) {
        // Write the distance out.
        dtfs += mapworldtext(midpoint(points[i], points[i+1]),
         ""+ heading(points[i], points[i+1]).toFixed(1) + "º " + seg_dist.toFixed(2) + "ml.");
        dtfs += mapworldtext(points[i+1],""+ total_dist.toFixed(2) + " ml.");
        run_dist = 0;
      }
    }
    
    dtf.value = dtfs;
  }
  
  // Given a set of map points - connect them using straight lines.
  this.render_lines = function(points, dist_needed, point_size, color) {
    var total_dist = 0;
    var threshold = distance_threashold()

    this.tctx.beginPath();

    var seg_dist = 0;
    var run_dist = 0;
    for (var i = 0; i < points.length-1; ++i) {
      seg_dist = miles(distance(points[i], points[i+1]));
      total_dist += seg_dist;
      run_dist += seg_dist;
      var start = this.map2canvas(points[i]);
      var end = this.map2canvas(points[i+1]);
      
      if (dist_needed && (i == points.length-2 || run_dist >= threshold)) {
        // Paint the distance
        this.tctx.fillText("<------" + total_dist.toFixed(2) + "miles",
         end.x, end.y);
        this.tctx.fillText("Head " + heading(points[i],points[i+1]).toFixed(1) + " deg.",
         start.x, start.y+25);
        run_dist = 0;
      }

      this.render_point(start, point_size);
      this.tctx.moveTo(start.x, start.y);
      this.tctx.lineTo(end.x, end.y);
    }
    if (dist_needed) {
      alert ("total = " +  total_dist);
    }
    this.tctx.strokeStyle = color;
    this.tctx.stroke();
  };

  this.render_point = function(point, point_size) {
    if (point_size > 0) {
      this.tctx.arc(point.x, point.y, point_size, 0, Math.PI*2, false);
    }
  };
  
  this.bezier = function(points) {
    var n = points.length - 1;
    var result = new Array();
    var rcount = 0;
    var step = 1 / get_num_segments();
    for (var t = 0; t < 1.01; t = t + step) {
      var x = 0;
      var y = 0;
      for (var i = 0; i < points.length; ++i) {
	var p = points[i];
	x = x + (bcoeff(i, n) * Math.pow(t,i)) * Math.pow((1-t),(n-i)) * p.x;
	y = y + (bcoeff(i, n) * Math.pow(t,i)) * Math.pow((1-t),(n-i)) * p.y;
      }
      result[rcount++] = new Point(x,y);
    }
    return result;
  };
  
  this.lagrange = function(points) {
    points.sort(function (p1,p2) { return p1.x - p2.x; });
    var minval = points[0].x | 0;
    var maxval = points[points.length-1].x | 0;
    var num_seg = get_num_segments();
// Forcing to get integer values for loop below
    var step = ((maxval - minval) / num_seg) | 0; 
    if (step < 1) {
      step = 1;
    }
    var count = 0;
    var results = new Array();
    for (var x = minval; x < maxval; x += step) {
      results[count++] = new Point(x, lgrange_blend(points, points.length-1, x));
    }
    return results;
  }
}

function get_current_canvas() {
  var ter = document.getElementById("terrain");
  var key = ter.options[ter.selectedIndex].value;
  return all_cnvs[key];
}

function get_render_style() {
  var styles = document.getElementsByName('dtftype');
  for (var i = 0; i < styles.length; ++i) {
    if (styles[i].checked) {
      return styles[i].value;
    }
  }
}

function change_map() {
  var c = get_current_canvas();
  c.drawMap();
  c.clear_map();
}

function mapline(p1, p2) {
  return ".mapline " + p1.x + " " + p1.y + " " + p2.x + " " + p2.y + "\n";
}

function mapworldtext(point, text) {
  return ".mapworldtext " + point.x + " " + point.y + " " + text + "\n";
}
  

function parse_mbl() {
  points = new Array();
  var mbl = document.getElementById("mbl");
  var mbl_str = mbl.value;
  var lines = mbl_str.split('\n');
  var count = 0;
  for (l in lines) {
    if (lines[l].indexOf("WAY") != 0)
      continue;

    var fields = lines[l].split(' ');
    var p = new Point(parseFloat(fields[2]), parseFloat(fields[4]));
    points[count] = p;
    count = count + 1;
  }
  return points;
}

function process_mbl() {
  var points = parse_mbl();
  var c = get_current_canvas();
  var style = get_render_style();
  var results;
  var dist_needed = distance_needed();
  c.clear_map();
  if (style == "linear") {
    results = points;
  } else if (style == "lagrange") {
    results = c.lagrange(points);
  } else {
    var showcp = document.getElementById("show-cp");
    if (showcp.checked) {
      c.render_lines(points, false, 10, "#000000");
    }
    results = c.bezier(points);
  }
  c.render_lines(results, dist_needed, 1, "#00ff00");
  c.write_dtf(results, dist_needed);

}


var all_cnvs;

function init() {
  all_cnvs = {
    'ETO'    : new Canvas('map', 'maps/eto.png', 38.1, 96, 96),
    'Crimea' : new Canvas('map', 'maps/crimea.png', 20, 80, 80),
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
    'Ardennes' : new Canvas('map', 'maps/ardennes.png', 10.3, 96, 96),
    'Newguinea' : new Canvas('map', 'maps/newguinea.png', 20, 80, 80),
    'Truk' : new Canvas('map', 'maps/truk.png', 10, 80, 80),
    'Perl Harbor' : new Canvas('map', 'maps/perl.png', 10, 80, 80),
    'Sicily' : new Canvas('map', 'maps/sicily.png', 29.061, 96, 96),
    'Greece' : new Canvas('map', 'maps/greece.png', 20, 80, 80)
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

  render = document.getElementById("render");
  render.addEventListener("click", process_mbl, false);
  change_map();
}
