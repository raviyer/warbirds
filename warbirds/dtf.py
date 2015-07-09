import distances
import math

def dtf_line(s, e):
    return ".mapline %.2f %.2f %.2f %.2f\n" % (s.x, s.y, e.x, e.y)

def dtf_text(p, text):
    return ".mapworldtext %.2f %.2f %s\n" % (p.x, p.y, text)

def dtf_circle(p, r):
    return ".mapcircle %.2f %.2f %.2f\n" % (p.x, p.y, r)

def dtf_color(cs):
    return ".mapcolor %s\n" % cs

def dtf_clear():
    return ".mapclear\n"

def dtf_point_var(varname, point):
    return ".strsto %s %d %d\n" % (varname, point.x, point.y)

def dtf_polygon(points):
    """return back a set of warbirds line commands such that all the points
    in points are joined together"""
    s = ""
    for i,p in enumerate(points[:-1]):
        pn = points[i+1]
        s = s + dtf_line(pn, p)
    return s

class Comment(object):
    def __init__(self, txt):
        self.txt = txt
    def __repr__(self):
        return self.txt

class Line(object):
    def __init__(self, s, e):
        self.start = s
        self.end = e

    def __repr__(self):
        return dtf_line(self.start, self.end)

class Circle(object):
    def __init__(self, c, r):
        self.c = c
        self.r = float(r)

    def __repr__(self):
        return dtf_circle(self.c, self.r)

class Text(object):
    def __init__(self, p, txt):
        self.point = p
        self.txt = txt
    def __repr__(self):
        return dtf_text(self.point, self.txt)

class Clear(object):
    def __init__(self):
        pass
    def __repr__(self):
        return dtf_clear()

variables = {}
class Variable(object):
    INT = 0
    STR = 1
    def __init__(self, name, typ, value):
        self.name = name
        self.typ = typ
        self.value = value
        variables[self.name] = self
    
    def __repr__(self):
        s = ".intsto " if self.typ == Variable.INT else ".strsto "
        s += self.name
        s += " "
        s += " ".join(self.value)
        return s


    def color(self):
        return Color(self.name, self.value[0], self.value[1],
                     self.value[2], self.value[3])

    def point(self):
        return distances.Point(self.value[0], self.value[1])

class Color(object):
    def __init__(self, name, r, g, b, t):
	self.name = name
        self.red = r
        self.green = g
        self.blue = b
        self.gamma = t

    def __repr__(self):
        return dtf_color(" ".join([self.red, self.green, self.blue, self.gamma]))

def dtf_darcircle(point, radius_miles, max_segments=12):
    radius = distances.feet(radius_miles)
    if max_segments <= 0:
        raise Exception("max_segments must be between 1 and 360")
    thetas = [math.radians(a) for a in range(0, 360, 360/max_segments)]
    thetas.append(math.radians(360))
    
    pts = []
    for t in thetas:
        pts.append(distances.Point(point.x + radius*math.cos(t),
                                   point.y + radius*math.sin(t)))

    return dtf_polygon(pts)

def resolve_variable(vstr):
    if not vstr.startswith("@"):
        return vstr
    n = vstr[1:-1]
    v = variables[n]
    return v

def dtf_parse(infile):
    """Return back the DTF as a set of points, lines, circles and text"""
    f = open(infile)
    lines = []
    for l in f:
        if l.startswith("#"):
            lines.append(Comment(l))
        w = l.split()
        if len(w) == 0:
            continue
        # when parsing variables, it's dicy if this is a color
        # point or something else alltogether. We'll only handle
        # color and points
        if w[0] == ".strsto":
            o = Variable(w[1], Variable.STR, w[2:])
        elif w[0] == ".mapline":
            i = 1
            p = resolve_variable(w[i])
            i += 1
            if isinstance(p, Variable):
                p1 = p.point()
            else:
                p1 = distances.Point(p, w[i])
                i += 1

            p = resolve_variable(w[i])
            i += 1
            if isinstance(p, Variable):
                p2 = p.point()
            else:
                p2 = distances.Point(p, w[i])
                i += 1
            o = Line(p1, p2)
        elif w[0] == ".mapcircle":
            i = 1
            p = resolve_variable(w[i])
            i += 1
            if isinstance(p, Variable):
                p1 = p.point()
            else:
                p1 = distances.Point(p, w[i])
                i += 1
            r = w[i]
            o = Circle(p1, r)
        elif w[0] == ".mapcolor":
            c = resolve_variable(w[1])
            if isinstance(c, Variable):
                o = c.color()
            else:
                o = Color("", w[1], w[2], w[3], w[4])
        elif w[0] == ".mapworldtext":
            i = 1
            p = resolve_variable(w[i])
            i += 1
            if isinstance(p, Variable):
                p1 = p.point()
            else:
                p1 = distances.Point(p, w[i])
                i += 1
            o = Text(p1, " ".join(w[i:]))
        else:
            continue
        lines.append(o)
    return lines

def _test(inf):
    lines = dtf_parse(inf)
    t = 0
    for l in lines:
        if isinstance(l, Line):
            m = distances.miles(distances.distance(l.start, l.end))
            t += m
            print dtf_text(distances.midpoint(l.start, l.end),
                           "Head %d for %0.2f miles" % (distances.heading(l.start,
                                                                          l.end),
                                                        m)),
    print "\nTotal of %f miles\n" % t

#_test("pappyb.dtf")
