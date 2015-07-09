def blend(points, n):
    def func(x):
        answer = 0
        answers = ""
        answersv = ""
        for i,p in enumerate(points):
            num = 1
            den = 1
            nums = ""
            dens = ""
            numsv = ""
            densv = ""
            
            for j,p1 in enumerate(points):
                if j == i:
                    continue
                nums = nums + "(X - x%d)" % j
                numsv = numsv + "(X - %d)" % points[j]['x']
                num = num *(x - points[j]['x'])
                
                #dens = dens + "(x%d - x%d)" % (i,j)
                #densv = densv + "(%d - %d)" % (points[i]['x'], points[j]['x'])
                den = den * (points[i]['x'] - points[j]['x'])
            answer = answer + points[i]['y']*(num / den)
            #answers = answers + "y%d(%s/%s) + " % (i , nums, dens)
            #answersv = answersv + "%d(%s/%s) +" % (points[i]['y'],
            # numsv, densv)
        #print answers
        #print answersv
        return answer
    return func
    
def lgcurve(points):
    result = []
    n = len(points)-1
    blender = blend(points, n)
    # Sort points in increasing order of 'x'
    def cmp_pts(a,b):
        if a['x'] == b['x']:
            return 0
        elif a['x'] < b['x']:
            return -1
        else:
            return 1
        
    spoints = sorted(points, cmp=cmp_pts)
    minval = int(spoints[0]['x'])
    maxval = int(spoints[-1]['x'])
    step = (maxval - minval) / 100
    if step == 0:
        step = 1
    for x in range( minval, maxval, step):
        result.append({'x' : x , 'y' : blender(int(x))})

    # always get the last value to complete the curve.
    result.append({'x' : maxval, 'y' : blender(maxval)})
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
print mappoints
#print mappoints
# mappoints = [{'x':1, 'y' :1},
#              {'x':2, 'y' :2},
#              {'x':17, 'y' :1}]

#y = blender(mappoints[0]['x'])
#print y , mappoints[0]['y']
points = lgcurve(mappoints)
print points
for i,n in enumerate(points[:-1]):
    print mapline(points[i], points[i+1])

#print blender(mappoints[0]['x'])


