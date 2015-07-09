// This file is part of Warbirds BDA Script Generator.

//     Foobar is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     Warbirds BDA Script Generator is distributed in the hope that it will 
//     be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

// (c) Noflyz - United Mud Movers - noflyz.wix.com/united-mud-movers

(function() {
  var assets = [{"name": "G0", "label" : "88Flack", "damage" : "500", "sdesc" : "0 otOT_88_FLACK Runway gun or 88 Flack", "required" : "N", "description" : "Large flak gun in sandbag ring."},
  {"name": "G1", "label" : "MG", "damage" : "200", "sdesc" : "1 otOT_RUNWAY_GUN Aircraft factory gun", "required" : "N", "description" : "Twin MG position with man."},
  {"name": "G2", "label" : "20mm", "damage" : "200", "sdesc" : "2 otOT_FUEL_FACTORY_GUN Fuel factory gun", "required" : "N", "description" : "Small flak position in dirt ring OR medium sandbag ring with MG and man." },
  {"name": "G3", "label" : "40mm", "damage" : "300", "sdesc" : "3 otOT_MUNITION_FACTORY_GUN Munition factory gun", "required" : "N", "description" : "Medium flak postion in dirt ring OR large sandbag ring with wheeled gun." },
  {"name": "G4", "label" : "HQGun", "damage" : "500", "sdesc" : "4 otOT_HQ_GUN HQ gun", "required" : "Y", "description" : "Camo Arty Ring Position with special significance." },
  {"name": "HG", "label" : "Hanger", "damage" : "2500", "sdesc" : "5 otOT_HANGER Hangar", "required" : "Y", "description" : "Airfield Structures of various types and sizes to house aircraft." },
  {"name": "RW", "label" : "Runway", "damage" : "20000", "sdesc" : "6 otOT_RUNWAY Runway", "required" : "N", "description" : "Ground texture representing base layer of airfields and towns." },
  {"name": "HQ", "label" : "HQ", "damage" : "2000", "sdesc" : "7 otOT_HQ HQ (head quarters)", "required" : "Y", "description" : "Any building with special significance." },
  {"name": "TW", "label" : "Tower", "damage" : "2000", "sdesc" : "8 otOT_TOWER Tower", "required" : "N", "description" : "Control object for each field of various types, needed for capture." },
  {"name": "TX", "label" : "TaxiWay", "damage" : "8000", "sdesc" : "9 otOT_TAXY_WAY Taxi way", "required" : "N", "description" : "Ground texture representing a specific base area of airfields and towns." },
  {"name": "BO", "label" : "Unit", "damage" : "100", "sdesc" : "10 otOT_BOMBABLE_OBJECT Bombable object", "required" : "N", "description" : "Any small unimportant structure not necessary for base closure." },
  {"name": "BE", "label" : "BoatEntry", "damage" : "20000", "sdesc" : "11 otOT_BOAT_ENTRY Boat entry", "required" : "N", "description" : "Any very large structure not necessary for base closure." },
  {"name": "CB", "label" : "Carrier", "damage" : "250", "sdesc" : "12 otOT_CARRIER Carrier", "required" : "Y", "description" : "Trucks and M5 HTs - carrier of supplies and troops." },
  {"name": "BB", "label" : "Boat", "damage" : "1000", "sdesc" : "13 otOT_BOMBABLE_BOAT Bombable boat", "required" : "Y", "description" : "Vic56 small coastal boat" },
  {"name": "ST", "label" : "Strat", "damage" : "10000", "sdesc" : "14 otOT_STRAT_OBJECT Strat object", "required" : "N", "description" : "Not in use - possible special strategic target" },
  {"name": "RD", "label" : "RadarEm", "damage" : "2000", "sdesc" : "15 otOT_RADAR_EMITTER Radar emitter", "required" : "Y", "description" : "Square radar mast or circular listening dish - determines radar ingame." },
  {"name": "C0", "label" : "ReadyRoom", "damage" : "1250", "sdesc" : "16 otOT_READY_ROOM Ready room", "required" : "Y", "description" : "Squadron assembly room at airfields" },
  {"name": "C1", "label" : "Capital", "damage" : "2000", "sdesc" : "17 otOT_CAPITAL Capital", "required" : "Y", "description" : "DD1 or DD2 Destroyer - capital ship" },
  {"name": "AS", "label" : "Asteroid", "damage" : "500", "sdesc" : "18 otOT_ASTERIOD Asteroid", "required" : "Y", "description" : "Barrage or Observation Balloons" },
  {"name": "FM", "label" : "FacMod", "damage" : "4000", "sdesc" : "19 otOT_FACTORY_MODULE Factory module", "required" : "Y", "description" : "Various medium-sized associated factory buildings." },
  {"name": "LM", "label" : "LivMod", "damage" : "2000", "sdesc" : "20 otOT_LIVING_MODULE Living module", "required" : "Y", "description" : "Various large housing developments at industry and urban areas." },
  {"name": "DM", "label" : "Dock", "damage" : "1000", "sdesc" : "21 otOT_DOCKING_MODULE Docking module", "required" : "Y", "description" : "Wood dock or steel bridge span" },
  {"name": "SM", "label" : "Struct", "damage" : "500", "sdesc" : "22 otOT_STRUCTURE_MODULE Structure module", "required" : "Y", "description" : "Any small structure necessary for base closure." },
  {"name": "CM", "label" : "Cargo", "damage" : "1500", "sdesc" : "23 otOT_CARGO_MODULE Cargo module", "required" : "Y", "description" : "Freighter - cargo ship" },
  {"name": "WM", "label" : "Weapon", "damage" : "750", "sdesc" : "24 otOT_WEAPONS_MODULE Weapons module", "required" : "Y", "description" : "Tanks, M16s or M3s - armoured weapons" },
  {"name": "PL", "label" : "Planet", "damage" : "50000", "sdesc" : "25 otOT_PLANET Planet", "required" : "N", "description" : "Not in use - possible terrain object indestructable" },
  {"name": "X?","label" :  "Link", "damage" : "100", "sdesc" : "26 otOT_LINK Link", "required" : "N", "description" : "Not in use - possible communication link between fields" },
  {"name": "PA", "label" : "ParkedAC", "damage" : "350", "sdesc" : "27 otOT_PARKED_AIRCRAFT Parked Aircraft", "required" : "Y", "description" : "Parked a/c types - various types specific to terrains." },
  {"name": "A0", "label" : "Arty0", "damage" : "500", "sdesc" : "28 otOT_ARTILLERY0 Artillery Type 0", "required" : "Y", "description" : "Camo Arty Ring Position representing field artillery(up to 105mm)" },
  {"name": "A1", "label" : "Arty1", "damage" : "700", "sdesc" : "29 otOT_ARTILLERY1 Artillery Type 1", "required" : "Y", "description" : "Camo Arty Ring Position representing heavy artillery(above 105mm)" },
  {"name": "A2", "label" : "Arty2", "damage" : "1000", "sdesc" : "30 otOT_ARTILLERY2 Artillery Type 2", "required" : "Y", "description" : "Camo Arty Ring Position representing coastal artillery(above 200mm)" },
  {"name": "FD", "label" : "FuelDmp", "damage" : "500", "sdesc" : "31 otOT_FUEL_DUMP Fuel Dump", "required" : "Y", "description" : "Small fuel tanks at airfields and other locations." },
  {"name": "RS", "label" : "RadarStn", "damage" : "1500", "sdesc" : "32 otOT_RADAR_STATION Radar Station", "required" : "Y", "description" : "Radar control building with mast - does not determine radar ingame." },
  {"name": "WH", "label" : "Warehouse", "damage" : "2000", "sdesc" : "33 otOT_WAREHOUSE Warehouse", "required" : "Y", "description" : "Various large buildings that store goods at all locations." },
  {"name": "AD", "label" : "AmmoDump", "damage" : "1250", "sdesc" : "34 otOT_AMMO_DUMP Ammunition Dump", "required" : "Y", "description" : "Various fortified ammunition storage bunkers at airfields and tactical positions." },
  {"name": "HT", "label" : "Hut", "damage" : "600", "sdesc" : "35 otOT_HUT Hut/Tent", "required" : "Y", "description" : "Tent and tent hangars." },
  {"name": "HS", "label" : "House", "damage" : "800", "sdesc" : "36 otOT_HOUSE House", "required" : "Y", "description" : "Various small general structures at all locations." },
  {"name": "RK", "label" : "Rock", "damage" : "500", "sdesc" : "37 otOT_ROCK Rock", "required" : "Y", "description" : "Stone bridge span OR similar stone structure like walls." },
  {"name": "TR", "label" : "Tree", "damage" : "200", "sdesc" : "38 otOT_TREE Tree", "required" : "N", "description" : "Tree object - different than tree clutter objects" },
  {"name": "B1", "label" : "Bridge", "damage" : "2500", "sdesc" : "39 otOT_BRIDGE", "required" : "N", "description" : "Port base object - TERRAIN SPECIFIC" },
  {"name": "G5", "label" : "37mm-AT", "damage" : "300", "sdesc" : "40 otOT_ANTITANK_1", "required" : "Y", "description" : "Large sandbag ring with wheeled gun." },
  {"name": "G6", "label" : "75mm-AT", "damage" : "400", "sdesc" : "41 otOT_ANTITANK_2", "required" : "Y" , "description" :  "Camo Arty Ring Position representing large AT guns." },
  {"name": "EA", "label" : "Factory", "damage" : "3000", "sdesc" : "42 otOT_FACTORY Factory", "required" : "Y", "description" : "Various large factory buildings at industry locations." },
  {"name": "EB", "label" : "FactComplex", "damage" : "5000", "sdesc" : "43 otOT_FACTCOMPLEX FactComplex", "required" : "Y", "description" : "Very large factory building at industry locations." },
  {"name": "EC", "label" : "FactAvionics", "damage" : "3000", "sdesc" : "44 otOT_FACTAVIONICS FactAvionics", "required" : "Y", "description" : "Large peaked factory building at industry locations." },
  {"name": "ED", "label" : "FactBall1", "damage" : "3000", "sdesc" : "45 otOT_FACTBALL FactBall1", "required" : "Y", "description" : "Medium factory building at industry locations." },
  {"name": "EE", "label" : "FactBall2", "damage" : "4000", "sdesc" : "46 otOT_FACTBALL2 FactBall2", "required" : "Y", "description" : "Large factory building at industry locations." },
  {"name": "EF", "label" : "Warehouse2", "damage" : "3000", "sdesc" : "47 otOT_WAREHOUSE2 Warehouse2", "required" : "Y", "description" : "Various very large buildings that store goods at major locations." },
  {"name": "EG", "label" : "Crane", "damage" : "1000", "sdesc" : "48 otOT_CRANE Crane", "required" : "Y", "description" : "Cranes at ports, industry and railway yards - two types." },
  {"name": "EH", "label" : "Pontoon", "damage" : "300", "sdesc" : "49 otOT_PONTOON Pontoon", "required" : "Y", "description" : "Pontoon bridge span" },
  {"name": "EI", "label" : "ReFinBuild1", "damage" : "4000", "sdesc" : "50 otOT_REFINBUILD1 ReFinBuild1", "required" : "Y", "description" : "Medium refinery building at industry locations." },
  {"name": "EJ", "label" : "RefFinSep", "damage" : "700", "sdesc" : "51 otOT_REFINSTEP RefFinSep", "required" : "Y", "description" : "Oil industry refinery seperation tower." },
  {"name": "EK", "label" : "ReFinTank", "damage" : "1250", "sdesc" : "52 otOT_REFINTANK ReFinTank", "required" : "Y", "description" : "Large fuel tanks at industry and port locations." },
  {"name": "EL", "label" : "RefinPipe", "damage" : "700", "sdesc" : "53 otOT_REFINPIPE RefinPipe", "required" : "Y", "description" : "Industry smoke stack - all industry types" },
  {"name": "EM", "label" : "Power1", "damage" : "1000", "sdesc" : "54 otOT_POWER1 Power1", "required" : "Y", "description" : "Small power generator building at industry locations." },
  {"name": "EN", "label" : "Power2", "damage" : "1500", "sdesc" : "55 otOT_POWER2 Power2", "required" : "Y", "description" : "Medium power generator building at industry locations." },
  {"name": "EO", "label" : "Power3", "damage" : "2000", "sdesc" : "56 otOT_POWER3 Power3", "required" : "Y", "description" : "Large power generator building at industry locations." },
  {"name": "EP", "label" : "Uboat", "damage" : "1000", "sdesc" : "57 otOT_UBOAT Uboat", "required" : "Y", "description" : "Not in use - possible submarine target" },
  {"name": "EQ", "label" : "Gas1", "damage" : "750", "sdesc" : "58 otOT_GAS1 Gas1", "required" : "Y", "description" : "Medium sized fuel tanks at industry locations." },
  {"name": "ER", "label" : "Subpen", "damage" : "3000", "sdesc" : "59 otOT_SUBPEN Subpen", "required" : "Y", "description" : "Large concrete sub hangars at ports OR dam sections across rivers." },
  {"name": "ES", "label" : "ObsCnCr", "damage" : "1000", "sdesc" : "60 otOT_OBSCNCR ObsCnCr", "required" : "Y", "description" : "Observation Control Center - control bunker in fortified defenses." },
  {"name": "ET", "label" : "Barracks01", "damage" : "2000", "sdesc" : "61 otOT_BARRACKS01 Barracks01", "required" : "Y", "description" : "Various large buildings that house troops at airfields, bases and ports." },
  {"name": "EU", "label" : "Bunker", "damage" : "1500", "sdesc" : "62 otOT_BUNKER Bunker", "required" : "Y", "description" : "Various small fortified buildings at airfields or tactical postions." },
  {"name": "EV", "label" : "LightTower", "damage" : "1000", "sdesc" : "63 otOT_LIGHTTOWER LightTower", "required" : "Y", "description" : "Coastal lighthouse - on coastlines and at seaports." },
  {"name": "EW", "label" : "CntrlRail", "damage" : "1500", "sdesc" : "64 otOT_CNTRLRAIL CntrlRail", "required" : "Y", "description" : "Railway platform for passenger trains." },
  {"name": "EX", "label" : "MLine1", "damage" : "2000", "sdesc" : "65 otOT_MLINE1 MLine1", "required" : "Y", "description" : "Small concrete blockhouse with MG turrets - in fortified areas." },
  {"name": "EY", "label" : "MLine2", "damage" : "3000", "sdesc" : "66 otOT_MLINE2 MLine2", "required" : "Y", "description" : "Large concrete blockhouse with gun turrets - in fortified areas." },
  {"name": "G7", "label" : "DOAFlack", "damage" : "500", "sdesc" : "67 otOT_DOA_FLACK", "required" : "N", "description" : "DOA specific" },
  {"name": "G8", "label" : "BritRifle", "damage" : "10", "sdesc" : "68 otOT_BRITRIFLE", "required" : "N", "description" : "DOA specific" },
  {"name": "G9", "label" : "GermRifle", "damage" : "10", "sdesc" : "69 otOT_GERMRIFLE", "required" : "N", "description" : "DOA specific" },
  {"name": "GA", "label" : "TrenchMG", "damage" : "200", "sdesc" : "70 otOT_TRENCHMG", "required" : "N", "description" : "DOA specific" },
  {"name": "GB", "label" : "AAAMG", "damage" : "200", "sdesc" : "71 otOT_AAAMG", "required" : "N", "description" : "DOA specific"}];

  var app = angular.module('assets', []);
  app.directive('assetList', function() {
     var o= { restrict: 'E',
              templateUrl: 'asset-list.html',

              controller:
              function() {
                var ctrl = this;
                this.assets = assets;
                this.sel = assets[0];
                this.dtf = "%%\n%%\n";
                this.selNo = 1;
                this.startNo = 1;
                this.fieldNum = 1;
                this.numbers = [1,2,3,4,5,6,7,8,9,10];
                this.needed = {};

                this.get_asset = function(k) {
                  for (var i = 0; i < this.assets.length; ++i) {
                    if (this.assets[i].name === k) {
                      return this.assets[i];
                    }
                  }
                  return null;
                };
                this.add_asset = function() {
                  this.needed[this.sel.name] = [this.sel.description, this.startNo, this.selNo];
                  this.gen_dtf();
                };
                this.remove_asset = function(k) {
                  console.log(k);
                  delete this.needed[k];
                  this.gen_dtf();
                };

                this.gen_dtf = function() {
                  Number.prototype.pad = function(size) {
                    var s = String(this);
                    while (s.length < (size || 2)) {s = "0" + s;}
                    return s;
                  };
                  this.dtf = "%%\n";
                  // Initialize variables
                  for (var k in this.needed) {
                    this.dtf += ".intsto " + k + "_count 0\n";
                  };

                  // Generate counts
                  for (var k in this.needed) {
                    var o = this.needed[k];
                    var s = o[1];
                    var e = o[2];
                    for (var i = s; i <= e; ++i) {
                      this.dtf += "if (DESTROYED(GROUNDOBJECT(\"F" +
                       this.fieldNum.pad(3) + k + i.pad(3)
                       + "\")))\n{\n}\nelse\n{\n"
                       + ".intadd " + k + "_count 1\n}\n";
                    }
                  };
                  
                  // Print Report
                  for (var k in this.needed) {
                    console.log(k);
                    this.dtf += ".echo @" + k + "_count@ - "
                     + this.get_asset(k).description + "\n";
                  };
                  
                  // Free the variables
                  for (var k in this.needed) {
                    this.dtf += ".varfree " + k + "_count\n";
                  };

                  this.dtf += "%%\n";
                };
              },
              
              controllerAs: 'assetCtrl'
     };
     return o;
   });
 
})();
