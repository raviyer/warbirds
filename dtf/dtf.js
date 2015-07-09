/* copyright noflyz raviyer@yahoo.com */
/*
    This file is part of Interesting DTF Creator

    Interesting DTF Creator is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Interesting DTF Creator is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Interesting DTF Creator.  If not, see <http://www.gnu.org/licenses/>.
*/

/* User Interface */
function initForms() {
  hiderows();
}

function hiderows() {
  hideRow('pois',1);
  hideRow('lines',1);
  hideRow('texttab',1);
}

function hideRow(tableid, rownum) {
  var tab = document.getElementById(tableid);
  var tbdy = tab.getElementsByTagName("tbody")[0];
  var rows = tbdy.getElementsByTagName("tr");
  rows[rownum].style.display = 'none';
}

function addarow(tableid,proto) {
  var tab = document.getElementById(tableid);
  var tbdy = tab.getElementsByTagName("tbody")[0];
  var rows = tbdy.getElementsByTagName("tr");
  
  var newRow = rows[proto].cloneNode(true);
  newRow.style.display = '';
  tbdy.appendChild(newRow);
  return newRow;
}

function removearow(tableid, btn,min_rows) {
  var tab = document.getElementById(tableid);
  var tbdy = tab.getElementsByTagName("tbody")[0];
  var rows = tbdy.getElementsByTagName("tr");
  if (rows.length > min_rows) {
    var row = btn.parentNode.parentNode;
    tbdy.removeChild(row);
  }
  return 0;
}

/* TODO: change this so it can work for different maps and image sizes */
function imagexyToMapXY(p) {
  /* First transform the coords to bottom left being 0,0 */
  p = { x : p.x, y : 1024-p.y};
  /* Then convert image coords to map coords */
  return {x : feet(p.x/8), y : feet(p.y/8) }
}

function getattr(o,name) {
  return o.attributes.getNamedItem(name).value;
}

function addPoi(event) {
  var pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("map_div").offsetLeft;
  var pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("map_div").offsetTop;
  var o = imagexyToMapXY({ x: pos_x, y : pos_y});
  var r = addarow('pois',1);
  var inputs = r.getElementsByTagName("input");
  var i;
  for (i=0 ; i<inputs.length; ++i) {
    var k = inputs[i];
    var n = getattr(k,"name");

    if (n == "fn")
      k.value = prompt("Enter a name for your point of interest");
    if (n == "fx")
      k.value = o.x;
    if (n == "fy")
      k.value = o.y;
  }
    
  return o;
}

/* Global cumulative time */
var ctime = 0;
/* Global cumulative distance */
var cdist = 0;

/* DTF Generation */
function generateDTF() {
  ctime = 0;
  cdist = 0;
  var dtftext = document.getElementById('dtftext');
  dtftext.value = "";

  dtftext.value += renderConstants();
  var poitable = createPoiTable();
  dtftext.value += renderVariables(poitable);
  dtftext.value += renderCircles(poitable);
  dtftext.value += renderLines(poitable);
  dtftext.value += renderText(poitable);
}

function renderConstants() {
  var t = "%%\n.mapclear\n";
  t += ".strsto black 0 0 0 255\n";
  t += ".strsto green 0 255 0 255\n";
  t += ".strsto red 255 0 0 255\n";
  t += ".strsto white 255 255 255 255\n";
  return t;
}

function renderVariables(poitable) {
  var t = "";
  var k;
  // Output POIs as variable definitions
  for (k in poitable) {
    p = poitable[k];
    t += ".strsto " + p.name + " " + p.x + " " + p.y + "\n";
  }
  return t;
}

function renderCircles(poitable) {
  var t = "";
  var k;
  var co = '';
  // Output POIs as variable definitions
  for (k in poitable) {
    p = poitable[k];
    if (p.c == true) {
      if (co != p.co) {
	t += mapcolor(p.co);
	co = p.co;
      }
      t += mapcircle(poitable, p.x, p.y, p.r);
    }
  }
  return t;
}

function renderText(poitable) {
  var t = "";
  var k;
  var co = '';
  var i;
  var ttab = createTextTable();
  for (i = 0; i < ttab.length; ++i) {
    var tb = ttab[i];
    if (co != tb.co) {
      t += mapcolor(tb.co);
      co = tb.co;
    }
    var p = xy(tb.x, tb.y, poitable);
    t += maptext_multi(p.x, p.y, tb.txt);
  }
    
  return t;
}


function renderLines(poitable) {
  var lines = createLinesTable();
  var t = "";
  var lco = "";
  var i;
  for (i=0; i < lines.length; ++i) {
    l = lines[i];
    /* Change color if required */
    if (l.co != lco) {
      t += mapcolor(l.co);
      lco = t.co;
    }
    t += renderLine(poitable, l);
  }
    
  return t;
}

/* Renders lines and curves */
function renderLine(poitable, l) {

  /* Convert to numeric coords */
  var c1 = xy(l.cx1, l.cy1, poitable);
  var c2 = xy(l.cx2, l.cy2, poitable);
  var s = xy(l.sx, l.sy, poitable);
  var e = xy(l.ex, l.ey, poitable);

  var num_segs = 0;
  var t = "";
  var incr = 0;
  t+= mapcircle(poitable, l.sx, l.sy,1);
  t+= mapcircle(poitable, l.ex, l.ey,1);
  if (c1.x == -1 || c1.y == -1) {
    num_segs = 1;
  } else {
    num_segs = miles(distance(s,e)) / 5;
    num_segs = num_segs.toFixed();
    if (num_segs < 5 )
      num_segs = 5;
    if (num_segs > 10)
      num_segs = 10;
    t+= mapcircle(poitable, l.cx1, l.cy1, 1);
    t+= mapcircle(poitable, l.cx2, l.cy2, 1);
  }

  var ssx = l.sx;
  var ssy = l.sy;
  var i;
  var line_distance = 0;
  var line_mts = 0;
  for (i=0; i < num_segs; ++i) {

    var seg = l;
    if (num_segs > 1) {
      // If this is the last iteration then the last point is
      // The end point of the curve
      if (i == (num_segs-1)) {
	sex = l.ex;
	sey = l.ey;
      } else {
	// Else Next point is
	// (1-T)^3*P0 + 3*(1-T)^2*T*P1 + 3*(1-T)*T^2*P2 + T^3*P3
	// Where P0,P1,P2 and P3 are the start, control points and end point coords.
	// T is a number between 0 and 1 - we use (i+1) divided by number of segments
	var T = (i+1) / num_segs;
	t += "# T= " + T + "\n";
	sex = (Math.pow((1-T),3))*s.x 
	  + 3*(Math.pow((1-T),2))*T*c1.x 
	  + 3*(1-T)*(Math.pow(T,2))*c2.x 
	  + (Math.pow(T,3))*e.x;
	sex = sex.toFixed();
	sey = (Math.pow((1-T),3))*s.y
	  + 3*(Math.pow((1-T),2))*T*c1.y
	  + 3*(1-T)*(Math.pow(T,2))*c2.y 
	  + (Math.pow(T,3))*e.y;

	sey = sey.toFixed();
      }
      seg = { sx : ssx , sy : ssy, ex : sex, ey: sey , ags : l.ags};
      /* Current end point becomes start for next iteration */
      ssx = sex;
      ssy = sey;
    }

    /* Reassign start and end based on the segment */
    s = xy(seg.sx, seg.sy, poitable);
    e = xy(seg.ex, seg.ey, poitable);

    /* Draw the segment */
    t += mapline(poitable, seg);

    var d = distance(s,e);
    var h = heading(s,e);
    var leg_time_mts = 0;

    /* Time taken if required */
    if (l.ags != 0) {
      leg_time_mts = (miles(d)/seg.ags) * 60;
    }
    leg_time_mts = parseInt(leg_time_mts.toFixed());
    
    var txt = (h.toFixed()) + " deg.";
    /* Write text for heading, below start point of each segment */
    t += maptext_multi(s.x ,(s.y-4000) , txt);

    ctime += leg_time_mts;
    line_mts += leg_time_mts;
    line_distance += d;
  }
  
  var s = xy(l.sx, l.sy, poitable);
  var e = xy(l.ex, l.ey, poitable);

  /* Write speed and distance data below heading at the start of the
   * line/curve only */
  txt = "";
  if (l.ags > 0) {
    txt += l.ags + "mph. " ;
  }
  cdist += line_distance;
  txt += miles(line_distance).toFixed() + " miles " ;
  if (line_mts > 0)
    txt += line_mts + " mts.";
  t += maptext(s.x, (s.y-8000), txt);

  /* Write cumulative time and distance above end point */
  txt = "";
  if (ctime > 0) {
    txt += "T+" + ctime;
  }
  txt += " " + miles(cdist).toFixed() + " miles";
  t += maptext(e.x, (e.y+4000), txt);
  return t;
}

function createPoiTable() {
  var poitab = {};
  var poinames = document.getElementsByName("fn");
  var poix = document.getElementsByName("fx");
  var poiy = document.getElementsByName("fy");
  var poic = document.getElementsByName("fc");
  var poir = document.getElementsByName("fr");
  var poiclr = document.getElementsByName("fco");
  var i;
  for (i=1; i < poinames.length; i=i+1) {
    var p = { name : poinames[i].value , 
	      x : poix[i].value , 
	      y : poiy[i].value, 
	      c : poic[i].checked, 
	      r : poir[i].value, 
	      co : poiclr[i].value }
    if ((p.x == null || p.x.trim() == "") || (p.y == null || p.y.trim() == "")) {
      alert("Invalid POI at index " + i + " points of interest must have X and Y values defined");
      continue;
    }
    poitab[p.name] = p;
  }
  return poitab;
}

function createLinesTable() {
  var ltab = [];
  var sx = document.getElementsByName("sx");
  var sy = document.getElementsByName("sy");
  var ex = document.getElementsByName("ex");
  var ey = document.getElementsByName("ey");
  var cx1 = document.getElementsByName("cx1");
  var cy1 = document.getElementsByName("cy1");
  var cx2 = document.getElementsByName("cx2");
  var cy2 = document.getElementsByName("cy2");

  var ags = document.getElementsByName("ags");
  var col = document.getElementsByName("lco");
  var i;

  for (i=1; i < sx.length; i++) {
    var l = { sx : sx[i].value , 
	      sy : sy[i].value, 
	      ex : ex[i].value, 
	      ey : ey[i].value,
	      cx1 : cx1[i].value,
	      cy1 : cy1[i].value,
	      cx2 : cx2[i].value,
	      cy2 : cy2[i].value,
	      ags : ags[i].value,
	      co : col[i].value }
    if ((l.sx == null || l.sx.trim() == "") || (l.ex == null || l.ex.trim() == ""))
      continue;
    ltab.push(l);
  }
  return ltab;
}

function createTextTable() {
  var x = document.getElementsByName("tx");
  var y = document.getElementsByName("ty");
  var txt = document.getElementsByName("maptext");
  var col = document.getElementsByName("tco");
    
  var ttab = [];
  var i;
  for (i = 1; i < x.length; ++i) {
    var t = { x: x[i].value,
	      y: y[i].value,
	      txt: txt[i].value,
	      co: col[i].value};
    if ((t.x == null || t.x.trim() == ""))
      continue;
    ttab.push(t);
  }
  return ttab;
}


/* Map draw commands */
function mapcolor(co) {
  return ".mapcolor " + aat(co) + "\n";
}

function mapline(poitable, l) {
  return ".mapline " + dtf_xy_text(poitable, l.sx, l.sy) 
    + " " 
    + dtf_xy_text(poitable, l.ex, l.ey) + "\n";
}

function mapcircle(poitable, x, y, r) {
  return ".mapcircle " + dtf_xy_text(poitable, x, y) 
    + " " + feet(r) + "\n";
}

function maptext_multi(x, y, txt) {
  var lines = txt.split("\n");
  var t = "";
  var i;
  for (i=0; i < lines.length; ++i) {
    if (lines[i].trim() == "")
      continue;
    t += maptext(x,y,lines[i]); 
    y -= 4000;
  }
  return t;
}

function maptext(x, y, txt) {
  return ".mapworldtext " + x + " " + y + " " + txt + "\n";
}

/* Utility Functions */

/* Convert variables to X, Y values */
function xy(px,py, poitable) {
  if (isNaN(px)) {
    if (px in poitable) {
      return { x : parseInt(poitable[px].x), y : parseInt(poitable[px].y) }
    } else {
      return {};
    }
  } else {
    return { x : parseInt(px) , y : parseInt(py) };
  }
}

/* Returns back a string suiteable to use in a dtf file for values x and y,
 * The values are seperated by a space charecter */

function dtf_xy_text(poitable, x, y) {
  var r = "";
  /* If it is not a number it is a variable */
  if (isNaN(x)) {
    r += aat(x) + " ";
  } else {
    r += x + " " + y;
  }

  return r;
}

function aat(str) {
  return "@" + str + "@";
}

function distance (s,e) {
  return Math.sqrt( Math.pow((e.y - s.y), 2) + Math.pow((e.x - s.x), 2));
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


function miles(f) {
  return f / 5280;
}

function feet(m) {
  return m * 5280;
}

String.prototype.trim = function () {
  return this.replace(/^\s*/, "").replace(/\s*$/, "");
}
