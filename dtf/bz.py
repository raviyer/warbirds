def factorial(n):
    if n <= 1:
        return 1
    return n*factorial(n-1)

def bcoeff(i,n):
    return factorial(n) / (factorial(i) * factorial(n-i))

def bcurve(points):
    result = []
    n = len(points)-1
    step = .01
    for t in map(lambda x : x / 100.0, range(101)):
        x = 0
        y = 0
        for i,p in enumerate(points):
            x = x + (bcoeff(i,n) * (t**i)) * (1-t)**(n-i) * p['x']
            y = y + (bcoeff(i,n) * (t**i)) * (1-t)**(n-i) * p['y']
        result.append({'x': x, 'y' : y})

    return result


def mbl2points(mbl_file):
    points = []
    f = open(mbl_file, "r")
    for l in f:
        if not l.startswith("WAY"):
            continue
        s = l.split()
        p = {'x' : float(s[2]), 'y' : float(s[4]) }
        points.append(p)
    return points


def mapline(p1, p2):
    return ".mapline %f %f %f %f" % (p1['x'], p1['y'], p2['x'], p2['y'])

mappoints =  mbl2points("Drone01.mbl")
points = bcurve(mappoints)

for i in range(len(points)-1):
    print mapline(points[i], points[i+1])

