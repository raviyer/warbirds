import re
MAX_FIELDS=280

CODE = 0
NAME = 1
DAMAGE = 2
OT_CLASS = 3
REQUIRED = 4
DESCRIPTION = 5

asset_fields = {
    CODE : "code",
    NAME : "name",
    DAMAGE : "damage",
    OT_CLASS : "ot_class",
    REQUIRED : "required",
    DESCRIPTION : "description"
    }

bomb_damage = {
    "100lb" : 320,
    "250lb" : 480,
    "500lb" : 765,
    "1000lb" : 1100,
    "1600lb" : 1530,
    "2000lb" : 2100,
    "4000lb" : 3900,
    "50kg" : 330,
    "60kg" : 350,
    "100kg" : 430,
    "250kg" : 775,
    "500kg" : 1109,
    "800kg" : 1640,
    "1000kg" : 2175,
    "2000kg" : 4020
    }

loadout = {
    "KATE" : {1 : {"800kg" : 1} },
    "VAL" : {1 : {"250kg" : 1, "100kg" : 1}},
    "B25c" : { 1 : {"500lb" : 6}},
    "B24D" : { 1 : {"500lb": 12}, 2 : {"1600lb": 8}}
    }

def read_assets(f):
    assets = []
    first = True
    prog = re.compile('"([^\"]+)"')
    for line in f:
        if first:
            first = False
            continue
        data = prog.findall(line)
        a = {}
        for i,d in enumerate(data):
            a[asset_fields[i]] = d
        assets.append(a)
    return assets

def find_asset(ob, assets):
    for a in assets:
        if a[asset_fields[CODE]] == ob:
            return a
    return None

SWITCH_FORMAT ="""
switch @fn@
{
%s
}
"""

def init_count_var(asset):
    s = ".intsto %s_count 0\n" % asset[asset_fields[CODE]]
    return s

def free_count_var(asset):
    s = ".varfree %s_count\n" % asset[asset_fields[CODE]]
    return s

def incr_var(var, n):
    s = ".intadd %s %d\n" % (var,n)
    return s

def incr_count(asset, n):
    s = incr_var("%s_count" % asset[asset_fields[CODE]], n)
    return s

def init_count_vars(assets, filt):
    s = ""
    for ob in filt.keys():
        a = find_asset(ob, assets)
        s += init_count_var(a)
    return s

def free_count_vars(assets, filt):
    s = ""
    for ob in filt.keys():
        a = find_asset(ob, assets)
        s += free_count_var(a)
    return s

def asset_name(fn, an, a):
    return "F%03d%s%03d" % (fn, a[asset_fields[CODE]], an)
    
def _gen_incr_asset(field_number, asset_number, asset, standing):
    name = asset_name(field_number, asset_number, asset)
    #print ".destroyob %s" % name
    s = 'if (DESTROYED(GROUNDOBJECT("%s")))\n' % name
    s += "{\n"
    if not standing:
        s += incr_count(asset, 1)
    s += "}\nelse\n{\n"
    if standing:
        s += incr_count(asset, 1)
    s += "}\n"
    return s

def gen_incr_down_asset(field_number, asset_number, asset):
    return _gen_incr_asset(field_number, asset_number, asset, False)

def gen_incr_standing_asset(field_number, asset_number, asset):
    return _gen_incr_asset(field_number, asset_number, asset, True)

def gen_field_ob_file(fn, assets, filt):
    s = ""
    for ob, count in filt.iteritems():
        for an in range(count[1],count[0]+count[1]):
            s += gen_incr_standing_asset(fn, an, find_asset(ob, assets))
    return s

def gen_results(assets, f):
    s = ""
    for ob in f.keys():
        a = find_asset(ob, assets)
        s += ".echo @%s_count@ %s %s\n" % (a[asset_fields[CODE]],
                                           a[asset_fields[NAME]],
                                           a[asset_fields[DESCRIPTION]])
    return s

def gen_inventory(assets, f):
    objs = []
    for ob in f.keys():
        a = find_asset(ob, assets)
        objs.append((f[ob][0], a))
    return objs

def print_inventory(objs):
    s = ""
    for ob in objs:
        s += "%d %s(%s) %s %s %s Required\n" % (ob[0],
                                ob[1][asset_fields[NAME]],
                                ob[1][asset_fields[CODE]],
                                ob[1][asset_fields[DESCRIPTION]],
                                ob[1][asset_fields[DAMAGE]],
                                "Not" if ob[1][asset_fields[REQUIRED]] == "N" else "")
    return s

def get_asset_types(filename):
    f = open(filename)
    return read_assets(f)

def write_remains_dtf_for_fields(all_assets, asset_filters, prefix):
    for fn, asset_filter in asset_filters.iteritems():
            of = open("/Applications/Warbirds.app/Contents/Resources/%sf%d.dtf" % (prefix, fn), "w")
            init_variables = init_count_vars(all_assets, asset_filter)
            if_stmts = gen_field_ob_file(fn, all_assets, asset_filter)
            print_results = gen_results(all_assets, asset_filter)
            free_variables = free_count_vars(all_assets, asset_filter)

            TEMPLATE="""%%%%
%s
%s
%s
%s
%%%%
"""

            s =  TEMPLATE % (init_variables,
                             if_stmts, print_results,
                             free_variables)
            of.write(s)
#             print "Inventory %sF%d" % (prefix, fn)
#             print "--------------"
#             objs = gen_inventory(all_assets, asset_filter)
#             print print_inventory(objs)

all_assets = get_asset_types("assets.txt")


# asset_filters = { 82 : {"B1" : 2, "G1" : 2, "G3" : 1, "HG" : 3, "HS" : 8,
#                         "EF" : 1, "G1" : 2, "EU" : 7, "CM" : 1, "FD" : 4,
#                         "AD" : 4, "PA" : 2, "G3" : 2, "G1" : 1, "BB" : 1},
#                   81 : {"HS" : 13, "HG" : 4, "AD" : 4, "G0" : 1, "G3" : 1,
#                         "FD" : 6, "G1" : 1, "G2" : 1, "PA" : 2},
#                   67: {"B1" : 1, "WH" : 4, "G1" : 2},
#                   76 : {"DM" : 1, "WH" : 4, "G1" : 2}
                  
#                   }

#asset_filters = { 96 : {"EK" : 25, "EF" : 12, "G0" : 10, "G1" : 9, "EI" : 7} }
#Dublon - Port 22
asset_filters = {
    # Railyard
    117: {
        "B1": (8,1),
        "CB": (2,1),
        "EF": (3,1),
        "EG": (2,1),
        "EJ": (2,1),
        "EW": (1,1),
        "G0": (4,1),
        "G3": (2,1),
        "HS": (4,1),
        "WH": (2,1)
        },
    # City
    14 : {
        "AD" : (3,1),
        "BO" : (1,1),
        "CB" : (3,1),
        "EF" : (1,1),
        "EW" : (1,1),
        "FD" : (2,1),
        "G0" : (1,1),
        "G2" : (2,1),
        "HT" : (6,1),
        "LM" : (19,1),
        "WH" : (8,1)

    },
    # MAF
    157 : {
        "AD" : (4,1),
        "BE" : (2,1),
        "ET" : (2,1),
        "FD" : (5,1),
        "G2" : (2,1),
        "G3" : (2,1),
        "HG" : (2,1),
        "HS" : (4,1),
        "PA" : (8,1),
        "RD" : (1,1),
        "RS" : (1,1),
        "WH" : (2,1)
        },
    7 : {
        "AD": (5,1),
        "EF": (2,1),
        "ET": (1,1),
        "FD": (5,1),
        "G0": (3,1),
        "G2": (2,1),
        "G3": (2,1),
        "HG": (4,1),
        "HS": (11,1),
        "PA": (6,1),
        "RD": (2,1),
        "RS": (1,1),
        "WH": (2,1)
        },
    217 : {
        "FD" : (2,1),
        "G2" : (2,1),
        "G3" : (1,1),
        "HS" : (2,1),
        "HT" : (6,1),
        "PA" : (5,1),
        "RD" : (1,1),
        "RS" : (1,1)
        },
    99 : {
        "AD" : (2,1),
        "FD" : (2,1),
        "G2" : (2,1),
        "G3" : (1,1),
        "HS" : (3,1),
        "HT" : (2,1),
        "PA" : (4,1),
        "RD" : (1,1),
        "RS" : (1,1)
        },
    # Dock
    216 : {
        "B1" : (5,1),
        "BB" : (2,1),
        "BE" : (2,1),
        "CM" : (1,1),
        "EF" : (1,1),
        "EG" : (1,1),
        "G2" : (1,1),
        "G3" : (1,1),
        "WH" : (2,1)
        },
    # Arty
    215 : {
        "G6" : (1,1),
        "A2" : (2,1),
        "EX" : (2,1),
        "EY" : (2,1),
        "G2" : (1,1),
        "G3" : (1,1),
        "G0" : (1,1),
        "HT" : (4,1)
        },
    # Supply
    40 : {
        "EQ" : (2, 1),
        "AD" : (4,1),
        "B1" : (4,1),
        "CB" : (3,1),
        "EH" : (6,1),
        "FD" : (5,1),
        "G3" : (3,1),
        "G0" : (1,1),
        "HT" : (3,1),
        "RS" : (1,1)
        }
    }

def damage(filter):
    d = 0
    for k, v in filter.iteritems():
        ob = find_asset(k, all_assets)
        if ob[asset_fields[REQUIRED]] == "Y":
            d += (int(ob[asset_fields[DAMAGE]]) * v[0])
    return d

def sort_fields(filters):
    fields = []
    for k,v in filters.iteritems():
        fields.append((k,v,damage(v)))
    return sorted(fields, key=lambda x : x[2])

def aircraft_loadout_dmg(name):
    ac = loadout[name]
    m = {}
    for ln, lo in ac.iteritems():
        m[ln] = {}
        for b, bn in lo.iteritems():
            m[ln][b] = bomb_damage[b] * bn
    return m
            
    
#write_remains_dtf_for_fields(all_assets, asset_filters,"OH")
CITY = [14]
MAF = [157, 7]
SAF = [217, 99]
DOCK = [216, 40]
ARTY = [217]
RAILYARD = [117]
ALL_TYPES = {
    "CITY" : CITY,
    "MAF" : MAF,
    "SAF" : SAF,
    "ARTY" : ARTY,
    "DOCK" : DOCK,
    "Railyard" : RAILYARD
    }

for n, field_list in ALL_TYPES.iteritems():
    for k, v in asset_filters.iteritems():
        if k in field_list:
            objs = gen_inventory(all_assets, v)
            print "Inventory for Field: %s %s" % (n,k)
            print "-------------------------------------"
            print print_inventory(objs)

f = sort_fields(asset_filters)
print "Field - TOT  - Bombers Needed"
for ff in f:
    dmg = aircraft_loadout_dmg("B24D")
    dstr = ""
    for lon, lo in dmg.iteritems():
        for name, tot in lo.iteritems():
            dstr += "%s(%d) " % (name, ff[2]/(tot)+1)
    print "%3d - %6d - %s" % (ff[0], ff[2], dstr)

#print aircraft_loadout_dmg("KATE")
write_remains_dtf_for_fields(all_assets, asset_filters, "r")
