num_fields = 110
rd_names = ["RD", "RS"]
terrain = "eto"
print "%%"
for f in range(1,num_fields+1):
    for r in rd_names:
        ob = "F%03d%s%03d" % (f, r, 1)
        print "if (DESTROYED(GROUNDOBJECT(\"%s\")))" % ob
        print "{"
        print ".intsto EX_%s%d 1" % (r, f)
        print "}"
print ".varsave Radars-%s.var" % (terrain)
for f in range(1,num_fields+1):
    for r in rd_names:
        print ".varfree EX_%s%d" % (r, f)


print "%%"
for f in range(1,num_fields+1):
    for r in rd_names:
        print ".destroyob F%03d%s%03d" % (f, r, 1)
