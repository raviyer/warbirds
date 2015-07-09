f = open("asset_codes.txt")
c = 1
for line in f:
    print '"%s"' % line.strip(),
    if c % 6 == 0:
        print ""
    c += 1

