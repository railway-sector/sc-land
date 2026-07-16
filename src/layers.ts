import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  lot_label,
  lot_popup,
  lot_renderer,
  lot_ho_f,
  lot_status_f,
  lot_tunnel_f,
  str_renderer,
  str_popup,
  lot_opt_renderer,
  lot_studied_renderer,
  lot_ho_renderer,
  lot_tunnel_renderer,
  lot_access_renderer,
  str_owner_renderer,
  nlo_renderer,
  nlo_popup,
  str_occup_renderer,
  str_occup_popup,
  somco_renderer,
  portalItems,
  label_chainage,
  chainage_renderer,
  stationbox_renderer,
  prow_renderer,
  prow716_renderer,
  prow393_renderer,
  temp_fencing_renderer,
  permanent_fencing_renderer,
  maintenance_road_renderer,
  drainage_renderer,
  freight_line_renderer,
  ngcp_wa_renderer,
  ngcp_line_renderer,
  ngcp_pole_renderer,
  label_ngcp_pole,
  prow_tunnel_renderer,
  label_stationp,
  east_service_rd_renderer,
  pnr_renderer,
  pnr_popup,
  pierhead_renderer,
  pier_access_label,
  cp_breakline_renderer,
  substation_renderer,
  prow506_renderer,
} from "./uniqueValues";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- STATION LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 6,
  title: "SC Stations",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

//--- CHAINAGE LAYER ---//
export const chainageLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 2,
  title: "Chainage",
  elevationInfo: { mode: "relative-to-ground" },
  labelingInfo: [label_chainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainage_renderer,
  popupEnabled: false,
});

//--- STATION BOX LAYER ---//
export const stationBoxLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 7,
  renderer: stationbox_renderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PIER HEAD & COLUMN LAYER ---//
export const pierHeadColumnLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 4,
  title: "Pile Cap/Column",
  definitionExpression: "Layer <> 'Pier_Head'",
  minScale: 150000,
  maxScale: 0,
  renderer: pierhead_renderer,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PIER ACCESS POINT LAYER ---//
export const pierAccessLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 3,
  labelingInfo: [pier_access_label], // [pierAccessReadyDateLabel, pierAccessNotYetLabel, pierAccessDateMissingLabel], //[pierAccessDateMissingLabel, pierAccessReadyDateLabel, pierAccessNotYetLabel],
  title: "Pier Number", //'Pier with Access Date',
  minScale: 150000,
  maxScale: 0,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- CP BREAKLINE LAYER ---//
export const cp_break_lines = new FeatureLayer({
  portalItem: portalItems("1a2be501a0f54e048a7200e482eb0dd5"),
  title: "CP Break Line",
  renderer: cp_breakline_renderer,
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- SC SUBSTATION LAYER ---//
export const substationLayer = new FeatureLayer({
  portalItem: portalItems("fd0fd77c428b4fae8f47ac46b26614ec"),
  layerId: 61,
  renderer: substation_renderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Substation",
  elevationInfo: { mode: "on-the-ground" },
});

//--- PROW LAYER ---//
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  popupEnabled: false,
  renderer: prow_renderer,
});

// ROW Layer version 7.1.6
export const prowLaye716 = new FeatureLayer({
  portalItem: portalItems("84ba987eed264fe9b18938000ddf702d"),
  title: "SC Alignment 7.1.6",
  definitionExpression: "Version = 'v.7.1.6b'",
  popupEnabled: false,
  renderer: prow716_renderer,
});

// ROW Layer version 5.0.6
export const prowLayer506 = new FeatureLayer({
  portalItem: portalItems("84ba987eed264fe9b18938000ddf702d"),
  title: "SC Alignment 5.0.6",
  definitionExpression: "Version = 'v.5.0.6'",
  popupEnabled: false,
  renderer: prow506_renderer,
});

// ROW Layer version 3.9.3
export const prowLayer393 = new FeatureLayer({
  portalItem: portalItems("84ba987eed264fe9b18938000ddf702d"),
  title: "SC Alignment 3.9.3",
  definitionExpression: "Version = 'v.3.9.3'",
  popupEnabled: false,
  renderer: prow393_renderer,
});

// ROW (Meralco site 1)
export const meralco_site1_prowLayer = new FeatureLayer({
  portalItem: portalItems("87ec32eacf194b91b040ca052574234b"),
  title: "Meralco Site 1 Additional PROW",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
  renderer: prow_renderer,
});

// ROW (SC TUNNEL ALIGNMENT)
export const prow_tunnelLayer = new FeatureLayer({
  portalItem: portalItems("63605177aec648e5b3ad232d2b181874"),
  elevationInfo: { mode: "on-the-ground" },
  renderer: prow_tunnel_renderer,
  popupEnabled: false,
  title: "PROW for Tunnel Alignment",
});

//--- TEMPORARY FENCING ---//
export const temporaryFencingLayer = new FeatureLayer({
  portalItem: portalItems("e37f3dab086c4063ba28c7e4d4075d60"),
  layerId: 1,
  title: "Temporary Fencing",
  renderer: temp_fencing_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PERMANENT FENCING ---//
export const permanentFencingLayer = new FeatureLayer({
  portalItem: portalItems("e37f3dab086c4063ba28c7e4d4075d60"),
  layerId: 2,
  title: "Permanent Fencing",
  renderer: permanent_fencing_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//--- MAINTENANCE ROAD ---//
export const maintenanceRoadLayer = new FeatureLayer({
  portalItem: portalItems("e37f3dab086c4063ba28c7e4d4075d60"),
  layerId: 3,
  title: "Maintenance Road",
  renderer: maintenance_road_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//--- DRAINAGE LAYER ---//
export const drainageLayer = new FeatureLayer({
  portalItem: portalItems("e37f3dab086c4063ba28c7e4d4075d60"),
  layerId: 4,
  title: "Drainage",
  renderer: drainage_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//--- FUTURE TRACK LAYER ---//
export const provisionForFreightLineLayer = new FeatureLayer({
  portalItem: portalItems("e37f3dab086c4063ba28c7e4d4075d60"),
  layerId: 5,
  title: "Provision for Freight Line",
  renderer: freight_line_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//--- PROPOSED EAST SERVICE ROAD ---//
export const proposedEastServiceRoadLayer = new FeatureLayer({
  portalItem: portalItems("3b160b3125ab42759be419be7fbf1edc"),
  title: "Proposed East Service Road",
  renderer: east_service_rd_renderer,
  elevationInfo: { mode: "on-the-ground" },
});

//----------------------------------------------//
//                Other Layers                  //
//----------------------------------------------//
//--- DATES FEATURE TABLE ---//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//--- SOMCO FENSE ---//
export const somco_fense_layer = new FeatureLayer({
  portalItem: portalItems("5c14f6e9e59b40ef87bb4da0f611e5e5"),
  title: "SOMCO Fence",
  elevationInfo: { mode: "on-the-ground" },
  renderer: somco_renderer,
  popupEnabled: false,
});

//--- NGCP WORKING AREA LAYER ---//
export const ngcp_working_area6 = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 7,
  renderer: ngcp_wa_renderer,
  elevationInfo: { mode: "on-the-ground" },
  definitionExpression: "SiteNo = '6'",
  title: "Proposed Pole Working Areas",
});

//--- NGCP LINE LAYERS ---//
export const ngcp_line7 = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 2,
  title: "Proposed/Recorded NGCP Lines",
  elevationInfo: { mode: "on-the-ground" },
  renderer: ngcp_line_renderer,
  definitionExpression: "SiteNo = '7' AND LAYER = 2", // 2 is 'Relocation'
});

export const ngcp_line6 = new FeatureLayer({
  portalItem: portalItems("b7d01020d54c4015ba0ba9454475d1dc"),
  layerId: 2,
  title: "Proposed/Recorded NGCP Lines",
  elevationInfo: { mode: "on-the-ground" },
  renderer: ngcp_line_renderer,
  definitionExpression: "SiteNo = '6' AND LAYER = 2",
});

//--- NGCP POLE SITE LAYERS ---//
// PROPOSED POLE RELOCATION (SITE 7)
export const ngcp_pole7 = new FeatureLayer({
  portalItem: portalItems("d5b30a79bdae40c492771ec1e46ab0e9"),
  definitionExpression: "SiteNo = '7'",
  layerId: 3,
  renderer: ngcp_pole_renderer,
  labelingInfo: [label_ngcp_pole],
  elevationInfo: { mode: "on-the-ground" },
  popupEnabled: true,
  title: "Proposed Pole Relocation",
});

// PROPOSED POLE RELOCATION (SITE 6)
export const ngcp_pole6 = new FeatureLayer({
  portalItem: portalItems("d5b30a79bdae40c492771ec1e46ab0e9"),
  definitionExpression: "SiteNo = '6'",
  layerId: 3,
  renderer: ngcp_pole_renderer,
  labelingInfo: [label_ngcp_pole],
  elevationInfo: { mode: "on-the-ground" },
  popupEnabled: true,
  title: "Proposed Pole Relocation",
});

//--- PNR ---//
export const pnrLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  title: "Land (Excluded for Acquisition)",
  definitionExpression: "OwnershipType IN (1, 2)",
  elevationInfo: { mode: "on-the-ground" },
  labelsVisible: false,
  renderer: pnr_renderer,
  popupTemplate: pnr_popup,
});

//-----------------------------------------------//
//                Lot, Structure, NLO            //
//-----------------------------------------------//
//--- LOT LAYER ---//
export const lotLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  labelingInfo: [lot_label],
  renderer: lot_renderer,
  popupTemplate: lot_popup,
  title: "Land Acquisition",
  minScale: 30000,
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- OPTIMIZED LOT FOR PASSENGER LINE ---//
export const optimizedLots_passengerLineLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  definitionExpression: "OptLotsIIA_NoT = 1",
  labelingInfo: [lot_label],
  renderer: lot_opt_renderer,
  popupTemplate: lot_popup,
  title: "Optimized Lots with Issued Notice of Taking",
  minScale: 150000,
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- STUDIED LOTS: PASSENGER & FREIGHT LINE FOR OPTIMIZATION ---//
export const studiedLots_optimizationLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  definitionExpression: "OptLotsIIB = 1",
  labelingInfo: [lot_label],
  renderer: lot_studied_renderer,
  popupTemplate: lot_popup,
  title: "Candidate Lots of NSCR-Ex Passenger & Freight Line for Optimization",
  minScale: 150000,
  maxScale: 0,
  elevationInfo: { mode: "on-the-ground" },
});

//--- HANDED-OVER LOTS (PUBLIC + PRIATE LOTS) ---//
export const handedOverLotLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  definitionExpression: `${lot_ho_f} = 1 AND ${lot_status_f} <> 8`,
  renderer: lot_ho_renderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Handed-Over (public + private)",
  elevationInfo: { mode: "on-the-ground" },
});

//--- TUNNEL AFFECTED LOTS ---//
export const tunnelAffectedLotLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 1,
  definitionExpression: `${lot_tunnel_f} = 1`,
  renderer: lot_tunnel_renderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Tunnel Affected",
  elevationInfo: { mode: "on-the-ground" },
});

//--- ACCESSIBLE LOT AREA BY CONTRACTORS ---//
export const accessibleLotAreaLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  renderer: lot_access_renderer,
  title: "Handed-Over Area",
  elevationInfo: { mode: "on-the-ground" },
});

//--- STRUCUTURE LAYER ---//
export const structureLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 2,
  title: "Structure",
  renderer: str_renderer,
  elevationInfo: { mode: "on-the-ground" },
  popupTemplate: str_popup,
});

//--- STRUCUTURE OWNERSHIP LAYER ---//
export const strucOwnershipLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  renderer: str_owner_renderer,
  layerId: 2,
  title: "Households Ownership (Structure)",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- NLO LAYER ---//
export const nloLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 3,
  renderer: nlo_renderer,
  title: "Households",
  elevationInfo: { mode: "relative-to-scene" },
  minScale: 10000,
  maxScale: 0,
  popupTemplate: nlo_popup,
});

//--- HOUSEHOLDS OCCUPANCY (STATUS OF RELOCATION) ---//
export const occupancyLayer = new FeatureLayer({
  portalItem: portalItems("99500faf0251426ea1df934a739faa6f"),
  layerId: 4,
  title: "Occupancy (Structure)",
  renderer: str_occup_renderer,
  elevationInfo: { mode: "relative-to-scene" },
  popupTemplate: str_occup_popup,
});

//----------------------------------------------//
//                Group Layers                  //
//----------------------------------------------//
//--- ALIGNMENT LAYERS ---//
export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [
    cp_break_lines,
    stationBoxLayer,
    pierHeadColumnLayer,
    chainageLayer,
    substationLayer,
    meralco_site1_prowLayer,
    prowLayer393,
    prowLayer506,
    prowLaye716,
    prowLayer,
    prow_tunnelLayer,
    temporaryFencingLayer,
    permanentFencingLayer,
    maintenanceRoadLayer,
    drainageLayer,
    provisionForFreightLineLayer,
    proposedEastServiceRoadLayer,
  ],
}); //map.add(alignmentGroupLayer, 0);

//--- STRUCTURE/NLO/OCCUPANCY LAYERS ---//
export const nloLoOccupancyGroupLayer = new GroupLayer({
  title: "Households Occupancy",
  visible: true,
  visibilityMode: "independent",
  layers: [occupancyLayer, strucOwnershipLayer, nloLayer],
});

//--- LOT LAYERS ---//
export const lotGroupLayer = new GroupLayer({
  title: "Land",
  visible: true,
  visibilityMode: "independent",
  layers: [
    lotLayer,
    optimizedLots_passengerLineLayer,
    studiedLots_optimizationLayer,
    tunnelAffectedLotLayer,
    pnrLayer,
    accessibleLotAreaLayer,
  ],
});

//--- NGCP LAYERS ---//
export const ngcp6_groupLayer = new GroupLayer({
  title: "NGCP Site 6",
  visible: false,
  visibilityMode: "independent",
  layers: [ngcp_line6, ngcp_pole6, ngcp_working_area6],
});

export const ngcp7_groupLayer = new GroupLayer({
  title: "NGCP Site 7",
  visible: false,
  // listMode: 'hide-children',
  visibilityMode: "independent",
  // layers: [ngcp_line7, ngcp_pole7, ngcp_working_area7],
  layers: [ngcp_line7, ngcp_pole7],
});

//----------------------------------------------//
//                Other Parameters              //
//----------------------------------------------//
export const sources: any = [
  {
    layer: lotLayer,
    searchFields: ["LotID"],
    displayField: "LotID",
    exactMatch: false,
    outFields: ["LotID"],
    name: "Lot ID",
    placeholder: "example: 10083",
  },
  {
    layer: structureLayer,
    searchFields: ["StrucID"],
    displayField: "StrucID",
    exactMatch: false,
    outFields: ["StrucID"],
    name: "Structure ID",
    placeholder: "example: NSRP-01-02-ML007",
  },
  {
    layer: pierAccessLayer,
    searchFields: ["PierNumber"],
    displayField: "PierNumber",
    exactMatch: false,
    outFields: ["PierNumber"],
    name: "Pier No",
    zoomScale: 1000,
    placeholder: "example: P-288",
  },
];
