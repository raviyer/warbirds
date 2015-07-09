import distances
import math
import dtf
import sys
class mbl(object):
    def __init__(self, mbl_name):
        self.filename = mbl_name
        self.points = []
            
    def parse(self):
        inf = open(self.filename)
        for s in inf:
            f = s.split()
            if len(f) > 0 and f[0].startswith("WAYPOINT"):
                self.points.append(distances.Point(float(f[2]),
                                                   float(f[4])))
        
    def gen_darcircles(self, dtfname, radius_miles, max_segments=12):
        radius = distances.feet(radius_miles)
        if max_segments <= 0:
            raise Exception("max_segments must be between 1 and 360")
        thetas = [math.radians(a) for a in range(0, 360, 360/max_segments)]
        thetas.append(math.radians(360))
        f = open(dtfname, "w")
        for p in self.points:
            pts = []
            for t in thetas:
                pts.append(distances.Point(p.x + radius*math.cos(t),
                                           p.y + radius*math.sin(t)))
            
            f.write("# Center %s\n" % p)
            f.write(dtf.dtf_polygon(pts))

        
    def gen_dtf(self, dtfname):
        pass


def _test():
    inf = sys.argv[1]
    otf = sys.argv[2]
    
    m = mbl(inf)
    m.parse()
    print m.points
    m.gen_darcircles(otf, 15,16)

_test()
