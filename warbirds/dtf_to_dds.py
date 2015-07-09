import distances
import terrain
import dds
import dtf

def dtf_obj_to_imgck(d):
	def _inner(o):
		if isinstance(o, dtf.Line):
			o.start = d.dtf_point_to_dds(o.start)
			o.end = d.dtf_point_to_dds(o.end)
		elif isinstance(o, dtf.Circle):
			o.c = d.dtf_point_to_dds(o.c)
			o.r = d.feet_to_pixals(o.r)
		elif isinstance(o, dtf.Text):
			o.point = d.dtf_point_to_dds(o.point)
		else:
			pass
		return o
	return _inner

def dtf_to_imgck(ter_name, dtf_name):
	objs = dtf.dtf_parse(dtf_name)
	d = dds.dds(ter_name)
	objs = map(dtf_obj_to_imgck(d), objs)
	return objs
		
print dtf_to_imgck("greece", "pappyb.dtf")
