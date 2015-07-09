import math

class Point(object):
    def __init__(self, x, y):
        self.x = float(x)
        self.y = float(y)
    
    def __repr__(self):
        return "(%d, %d)" % (self.x,self.y)

    def to_graphic(self, terrain, max_x=2047, max_y=2047):
        """Convert from warbirds coordinates (bottom left is 0, 0) to
        graphics coordinates (top left is 0, 0)"""

        #First scale
        if self.x > 0:
            x = float(max_x)/terrain["max_x"] * self.x
        else:
            x = 0

        if self.y > 0:
            y = float(max_y)/terrain["max_y"] * self.y
        else:
            y = 0

        #then transpose
        y = max_y - y
        return Point(int(x), int(y))

def feet(miles):
    return miles * 5280

def miles(feet):
    return feet / 5280

def distance(s, e):
    return math.sqrt((e.x - s.x)**2 + (e.y - s.y)**2)

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

def midpoint(s,e):
    return Point((e.x+s.x)/2, (e.y+s.y)/2)


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

def get_point_at(x, y, a, dfeet):
    a = 90 - a
    return Point(x + dfeet*math.cos(math.radians(a)),
                 y + dfeet*math.sin(math.radians(a)))



def test_get_point_at():
    f = open("/Applications/Warbirds.app/Contents/Resources/t.dtf", "w")
    #F 83
    p = get_point_at(0, 0, 50, 621886)
    f.write(".mapclear\n")
    f.write(".mapcircle %d %d %d\n" % (p.x, p.y, 5280*5))

    p1 = get_point_at(p.x, p.y, 90, 52800)
    f.write(".mapcircle %d %d %d\n" % (p1.x, p1.y, 5280*5))
    p1 = get_point_at(p.x, p.y, 0, 52800)
    f.write(".mapcircle %d %d %d\n" % (p1.x, p1.y, 5280*5))
    p1 = get_point_at(p.x, p.y, 180, 52800)
    f.write(".mapcircle %d %d %d\n" % (p1.x, p1.y, 5280*5))
    p1 = get_point_at(p.x, p.y, 270, 52800)
    f.write(".mapcircle %d %d %d\n" % (p1.x, p1.y, 5280*5))

def test_to_graphics():
    import terrain
    for k, t in terrain.terrains.iteritems():
        p = Point (0,0)
        p = p.to_graphic(t)
        if p.x != 0:
            raise Exception("%s Failed x for (0,0) p=%s" % (k, p))
        if p.y != 2047:
            raise Exception("%s Failed y for (0,0) p=%s" % (k, p))
        p = Point(t["max_x"], t["max_y"])
        p = p.to_graphic(t)
        if p.x != 2047:
            raise Exception("%s Failed x for (0,0) p=%s" % (k, p))
        if p.y != 0:
            raise Exception("%s Failed y for (0,0) p=%s" % (k, p))


#test_to_graphics()

def frame2():
    po = []
    po.append(Point(198157, 755521)) # F66
    po.append(get_point_at(198157, 755521, 36, 5280*10)) #WP1
    po.append(get_point_at(234395, 315567, 114, 5280*10)) #WP2
    po.append(Point(234395, 315567)) # F92
    po.append(get_point_at(234395, 315567, 294, 5280*10)) #WP3
    po.append(Point(198157, 755521)) # F66
    for i,p in enumerate(po[:-1]):
        p1 = po[i+1]
        print ".mapline ", p.x, p.y, p1.x, p1.y
    print ".mapcircle ", po[0].x, po[0].y, 52800
    print ".mapcircle ", po[3].x, po[3].y, 52800
    
    

def get_marks(s,e, label):
    h = heading(s,e)
    d = distance(s,e)
    m = int(miles(d))
    k = 0
    for i in range(0,m,10):
        k = k + 1
        p =  get_point_at(s.x, s.y,h, 5280*i)
        print ".mapworldtext %d %d %s%d " % (p.x, p.y, label, k)


        

