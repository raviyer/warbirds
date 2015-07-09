import math
import dtf

class point(object):
    tm = 0.0
    ias = 0.0
    tas = 0.0
    alt = 0.0
    roc = 0.0
    wt = 0.0
    gs = 0.0
    fuel = 0.0
    hdng = 0.0
    x = 0.0
    y = 0.0
    eng = 0.0
    flap = 0.0
    pitch = 0.0
    roll = 0.0
    yaw = 0.0

    def offset_miles(this, x, y):
        return this.offset_feet(feet(x), feet(y))
    
    def offset_feet(this, x,y):
        p = point()
        p.tm = this.tm
        p.ias = this.ias
        p.tas = this.tas
        p.alt = this.alt
        p.roc = this.roc
        p.wt = this.wt
        p.gs = this.gs
        p.fuel = this.fuel
        p.hdng = this.hdng
        p.x = this.x + x
        p.y = this.y + y
        p.eng = this.eng
        p.flap = this.flap
        p.pitch = this.pitch
        p.roll = this.roll
        p.yaw = this.yaw
        return p

def read_points(filename, skip):
    """Read and return a list of points from the file filename.
    each row has 2 values x and y"""
    f = open(filename)
    points = []
    title = True
    count = 0
    for l in f:
        if title:
            title = False
            continue
        count += 1
        if (count % skip) != 0:
            continue
        p = point()
        p.tm, p.ias, p.tas, p.alt, p.roc, p.wt, p.gs, p.fuel, p.hdng, p.x, p.y, p.eng, p.flap, p.pitch, p.roll, p.yaw = [float(x) for x in l.split()]
        points.append(p)
    return points

def miles(feet):
    return feet / 5280.0

def feet(miles):
    return miles * 5280.0

def alt_text(feet):
    feet /= 1000.0
    return "%.1fk feet" % feet
        
def distance(s, e):
    return math.sqrt((e.x - s.x)**2 + (e.y - s.y)**2)

def midpoint(s,e):
    p = point()
    p.x = (e.x+s.x)/2
    p.y = (e.y+s.y)/2
    return p

def arrow(s, e):
    arrowLength = 5280
    dx = e.x - s.x
    dy = e.y - s.y

    theta = math.atan2(dy, dx)

    rad = math.radians(35); # 35 angle, can be adjusted
    p1 = point()
    p2 = point()
    p1.x = e.x - arrowLength * math.cos(theta + rad)
    p1.y = e.y - arrowLength * math.sin(theta + rad)

    phi2 = math.radians(-35) # -35 angle, can be adjusted
    p2.x = e.x - arrowLength * math.cos(theta + phi2)
    p2.y = e.y - arrowLength * math.sin(theta + phi2)

    return (p1,p2)

def slope(s, e):
    dx = e.x - s.x
    dy = e.y - s.y
    h = 0
    if dx != 0:
        slope = dy/dx
    return slope

def heading(s,e):
    dx = e.x - s.x
    dy = e.y - s.y
    h = 0
    if dx != 0:
        slope = dy/dx
        angle = math.atan(slope) * (180/math.pi)
        f = 0
        if dx < 0 and dy >= 0:
          f = 270
        elif dx < 0 and dy < 0:
          f = 270
        elif dx >= 0 and dy >= 0:
          f = 90
        elif dx >=0 and dy < 0:
          f = 90
        h = f - angle
    else:
        if dy < 0:
            h = 180
        else:
            h = 0
    return h


def dtf_connect_points(points):
    d = ""
    total_distance = 0
    last_dist = 0
    for i,s in enumerate(points[:-1]):
        e = points[i+1]
        total_distance += distance(s, e)
        if (total_distance - last_dist) > feet(40):
            offset = e.offset_miles(1,0)
            d += dtf.dtf_text(offset,
                             "T+%02d %.2f miles, %s, %dmph. tas" %
                             (int(e.tm/60), miles(total_distance),
                              alt_text(e.alt), int(e.tas)))
            d += dtf.dtf_circle(e, feet(1))
            last_dist = total_distance
            m = midpoint(s,e)
            a1,a2 = arrow(s,m)
            d += dtf.dtf_line(m,a1)
            d += dtf.dtf_line(m,a2)
            d += dtf.dtf_line(a1,a2)
        d += dtf.dtf_line(s,e)
    return d

def main():
    import sys
    if len(sys.argv) < 3:
        print "Usage: hud2dtf.py <infile> <outfile> [<skip>]"
        exit()
    skip = 0
    infile = sys.argv[1]
    outfile = sys.argv[2]
    if len(sys.argv) == 4:
        skip = int(sys.argv[3])

    if skip == 0:
        skip = 1

    points = read_points(infile, skip)

    dtf = dtf_connect_points(points)
    o = open(outfile, "w")
    o.write(".mapclear\n")
    o.write(".mapcolor 255 255 255 255\n")
    o.write(dtf)
    o.close()

main()
