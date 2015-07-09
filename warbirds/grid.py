import terrain
import distances
import dtf

def generate_grid(ter):
    mx = ter.max_x / ter.grid_feet + 1
    my = ter.max_y / ter.grid_feet + 1
    points = []
    for xg in range(mx):
        for yg in range(my):
            p1 = distances.Point(xg*ter.grid_feet + ter.grid0_x, 0)
            p2 = distances.Point(p1.x, ter.max_y)
            points.append((p1,p2))
        p1 = distances.Point(0, ter.grid0_y+xg*ter.grid_feet)
        p2 = distances.Point(ter.max_x, p1.y)
        points.append((p1,p2))
    return points

def generate_grid_numbers(ter):
    mx = ter.max_x / ter.grid_feet + 1
    my = ter.max_y / ter.grid_feet + 1
    labels = []
    for xg in range(mx):
        for yg in range(my):
            p = distances.Point(xg*ter.grid_feet + ter.grid0_x,
                                 yg*ter.grid_feet + ter.grid0_y)
            labels.append(("%d,%d" % (xg, yg), p))
    return labels



def draw_lines(t):
    points = generate_grid(t)
    s = ""
    for (p1,p2) in points:
        s += dtf.dtf_line(p1, p2)
    return s

def draw_grid_labels(t):
    labels = generate_grid_numbers(t)
    s = ""
    for (l,p) in labels:
        s += dtf.dtf_text(p, l)
    return s

def draw_grid(name):
    s = ""
    mm = terrain.terrains[name]
    t = terrain.Terrain(mm)
    l = draw_lines(t)
    lb = draw_grid_labels(t)
    s += dtf.dtf_clear()
    s += l
    s += dtf.dtf_color("128 128 128 255")
    s += lb
    return s

#draw_grid("newguinea")
g = draw_grid("greece")
f = open("/Applications/Warbirds.app/Contents/Resources/greece_grid.dtf", "w")
f.write(g)

