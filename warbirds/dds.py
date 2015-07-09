import terrain
import distances

class dds:
	def __init__(self, ter):
		self.terrain = terrain.terrains[ter]
	def feet_to_pixals(self, feet):
		feet_per_pixal = self.terrain["max_x"] / 2048
		return feet / feet_per_pixal
	def dtf_point_to_dds(self, p):
		return distances.Point(self.feet_to_pixals(p.x),
				       2048-self.feet_to_pixals(p.y))

d = dds("greece")
print d.feet_to_pixals(5280)
print d.dtf_point_to_dds(distances.Point(0,0))
