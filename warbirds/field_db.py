import os
import re

import terrain
import distances
import dtf


def _parse_fld_file(terrain_out, fld):
    first_line = True

    def parse_texture(line):
        fields = line.split()
        if fields[0] == "TEXTURE":
            state = TEXTURE
        if fields[0] == "{":
            pass
        elif fields[0] == "TYPE":
            pass
        elif fields[0] == "FILE":
            terrain_out["icon"] = fields[1]
        elif fields[0] == "}":
            state = NONE
        else:
            raise Exception("Syntax error processing line: %s" % line)
        
    def parse_icon(line):
        fields = line.split()
        if fields[0] == "ICON":
            state = ICON
            state_vars[state]["current_icon"] = field[1]
        if fields[0] == "{":
            pass
        elif fields[0] == "BITMAP":
            terrain_out["icons"][state_vars[state]["current_icon"]] = {
                "top" : int(fields[2]), "left" : int(fields[3]),
                "width" : int(fields[4]), "height" : int(fields[5])
                }
        elif fields[0] == "}":
            state = NONE
        else:
            raise Exception("Syntax error processing line: %s" % line)
    def parse_font(line):
        pass
    def parse_fields(line):
        pass
    def parse_newfield(line):
        pass
    def parse_oldfield(line):
        (number, icon) = line.split()
        terrain_out["fields"][int(number)] = {
            "name" : "",
            "font" : "small",
            "icon" : type,
            "icon_scale" : 0.6
            }

    NONE = 1
    TEXTURE = 2
    ICON = 3
    FONT = 4
    FIELDS = 5
    NEWFIELD = 6
    OLDFIELD = 7
    states = {
        TEXTURE : "TEXTURE",
        ICON : "ICON",
        FONT : "FONT",
        FIELDS : "FIELDS",
        NEWFIELD : "NEWFIELD"
        }
    states_s = {
        "TEXTURE" : TEXTURE,
        "ICON" : ICON,
        "FONT" : FONT,
        "FIELDS" : FIELDS,
        }
    state_vars = { ICON : {current_icon : ""} }
    state = NONE
    parser_fns = {
        "TEXTURE" : parse_texture,
        "ICON" : parse_icon,
        "FONT" : parse_font,
        "FIELDS" : parse_fields,
        "FIELD" : parse_newfield
        }
    
    for line in fld:
        version = ""
        line = line.strip()
        if first_line:
            if line[0] == "#":
                version = "new"
            else:
                version = "old"
                terrain_out["icon"] = "ui/textures/icons.tga"
                terrain_out["fonts"] = { "small" : {
                    "name" : "Arial",
                    "pointsize" : 8,
                    "antialias" : False
                    }}
                terrain_out["icons"] = {
                    "LAF" : { top: 0, left: 224, width: 32, height: 32},
                    "MAF" : { top: 32, left: 224, width: 32, height: 32},
                    "SAF" : { top: 96, left: 224, width: 32, height: 32},
                    "GAF" : { top: 130, left: 226, width: 28, height: 28}
                    }

            first_line = False
            

        # Skip over comments and blank lines
        if line[0] == "#" or line == "":
            continue
        if state == NONE:
            k = line.split()[0] 
            if  k in parser_fns:
                parser_fns[k](line)
            else:
                parse_oldfield(line)
        else:
            parser_fns[states[state]](line)
            

def build_field(terrain_out, map_fld_file, fld_loc_file):
    """terrain - the terrain_out dictionary entry from terrain.terrains
    note this will be modified to add the data gleaned from the .fld file and
    from the .var file
    map_fld_file - path to .fld file that contains details about the terrain
    fld_loc_file - path to the .var file that contains the VOR data for the
                   fields of the terrain.

    updates terrain_out with the following:
    
    {
       icon : "<path>",
       fonts : {...},
       icons :  {...},
       fields : {...}
    }

    fonts is a dictionary that looks like:
    {
        <name> :
        {
            "name" : <string>,
            "pointsize" : <integer>,
            "antialize" : <boolean>
        }
    }

    icons is a dictionary that looks like:
    {   <name> :
    	{
            "top" : <integer>,
            "left" : <integer>,
            "height" : <integer>,
            "width" : <integer>
        }
    }

    fields contains a list of field objects, these are either the old style
    or new represented as a dictionary:
    {
       <integer> :
       {
           "name" : <string>,
           "font" : <font-name>,
           "icon" : <icon-name>,
           "icon_scale" : <float> # value between 0 and 1 to multiply to the
                                  # size of the icon
       }
    }

    Note there are two types of fields, old and new. For the old fields the
    only available information is the field name.
    """
    fld = open(map_fld_file)
    vor = open(fld_loc_file)

def pre_parse_fld_file(terrains, name, map_fld_file):
    try:
        terr = terrains[name]
        
        fields = []
        f = open(map_fld_file)
        first_line = True
        for l in f:
            if first_line:
                if l[0] == '#':
                    version = "new"
                else:
                    version = "old"
                first_line = False
            l = l.strip()
            if version == "new":
                if l.startswith("FIELD "):
                    d = l.split(",")
                    if d and d[0]:
                        d[0] = int(d[0].split(" ")[-1])
                        fields.append(d)
            else:
                d = l.split(" ")
                if d and d[0]:
                    d[0] = int(d[0])
                    fields.append(d)
    except Exception, e:
        print "Exception %s processing %s" % (map_fld_file, str(e))
        raise
    return fields

def gen_gather_dtf(terrains, name, map_fld_file, out_file):
    fields = pre_parse_fld_file(terrains, name, map_fld_file)
    of = open(out_file, "w")
    ter_name = os.path.basename(map_fld_file).split(".")[0]
    of.write(".terrain %s\n" % ter_name)
    of.write(".flightstart 0 0 0 0\n")
    of.write(".fly\n")
    for f in fields:
        of.write(".intsto F%d_ANGLE @:PLYR:VOR:%d@\n" % (f[0], f[0]))
        of.write(".intsto F%d_DIST @:PLYR:DFIELD:%d@\n" % (f[0], f[0]))
    of.write(".e\n")
    of.write(".varsave %s" % out_file + ".var\n")
    of.write(".echo data saved to %s" % out_file + ".var\n")
    for f in fields:
        of.write(".varfree F%d_ANGLE\n" % (f[0]))
        of.write(".varfree F%d_DIST\n" % (f[0]))
    of.write(".e\n")
    of.close()

wb_dir = "/Applications/Warbirds.app/Contents/Resources"
output_dir = "%s/fld_data" % wb_dir



def gen_gather_all(terrains):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    gather_all = "%s/gather_all.dtf" % output_dir
    master_dtf = open(gather_all, "w")
    for f in terrains.keys():
        gen_gather_dtf(terrains, f, "%s/%s.fld" % (wb_dir, f),
                       "%s/%s_gather.dtf" % (output_dir, f))
        master_dtf.write(".dotfile %s/%s_gather.dtf\n"
                         % (os.path.basename(output_dir), f))
    master_dtf.close()
    print "generated %s\n Start warbirds and run .dotfile fld_data/gather_all" % gather_all


def gen_fields_js():
    """Generates field database for all of the terrains:

    +=================+            +=================+
    |  Terrain        |            |  Map            |
    +=================+            +=================+
    | name            |            | name            |
    | icon_file       |            | scale_feet      |
    +-----------------+            | grid0_x         |
                                   | grid0_y         |
                                   +-----------------+

    """

def parse_var_file(tername):
    """given a terrain name, parse the data generated by gen_gather_dtf
    and produce DTF data that gives coords for each field"""
    fname = "%s/%s_gather.dtf.var" % (output_dir, tername)
    f = open(fname)
    distp = re.compile(".INTSTO F([0-9]+)_DIST ([0-9]+)$")
    angp = re.compile(".INTSTO F([0-9]+)_ANGLE ([0-9]+)$")
    fields = {}
    for l in f:
        m1 = distp.search(l)
        m2 = angp.search(l)
        if m1:
            fld = int(m1.group(1))
            if not fld in fields:
                fields[fld] = {}
            fields[fld]["dfeet"] = int(m1.group(2))
        elif m2:
            fld = int(m2.group(1))
            if not fld in fields:
                fields[fld] = {}
            fields[fld]["angle"] = int(m2.group(2))
        else:
            pass
    variables = []
    return fields

def gen_fields_vars(tername):
    fields = parse_var_file(tername)
    s = ""
    for k,v in fields.iteritems():
        pt = distances.get_point_at(0,0, v["angle"], v["dfeet"])
        s += dtf.dtf_point_var("F%d" % k, pt)
    return s

def gen_perimeter(tername, radius):
    fields = parse_var_file(tername)

    s = ""
    for k,v in fields.iteritems():
        pt = distances.get_point_at(0,0, v["angle"], v["dfeet"])
        s += dtf.dtf_darcircle(pt, radius, 14)
    return s

def gen_dar_circles(tername, dars, radius):
    fields = parse_var_file(tername)

    s = ""
    for d in dars:
        v = fields[d]
        pt = distances.get_point_at(0,0, v["angle"], v["dfeet"])
        s += dtf.dtf_darcircle(pt, radius, 16)
    return s

#gen_gather_all(terrain.terrains)
#print gen_fields_vars("truk")
#print gen_perimeter("truk", 15)
#print gen_dar_circles("truk", [9,28,8,3,24,31,30,27,26,25], 50)
