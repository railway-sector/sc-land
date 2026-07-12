import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D.js";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer.js";

import {
  lot_label,
  lot_popup,
  lot_renderer,
  lot_ho_f,
  lot_status_f,
  portalItem_url,
  valueLabelColor,
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
} from "./uniqueValues";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

const line_3d = new LineSymbol3D({
  symbolLayers: [
    new PathSymbol3DLayer({
      profile: "quad",
      width: 0.5,
      height: 5,
      material: { color: "#ffff00" },
    }),
  ],
});

const somco_renderer = new SimpleRenderer({
  symbol: line_3d,
});

export const somco_fense_layer = new FeatureLayer({
  portalItem: {
    id: "5c14f6e9e59b40ef87bb4da0f611e5e5",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "SOMCO Fence",
  elevationInfo: {
    mode: "on-the-ground",
  },
  // labelingInfo: [labelChainage],
  // minScale: 150000,
  // maxScale: 0,
  renderer: somco_renderer,
  popupEnabled: false,
});

/* Chainage Layer  */
const labelChainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: {
      size: 15,
      weight: "bold",
    },
  },
});

const chainageRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: {
      width: 0.2,
      color: "black",
    },
  }),
});

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
  labelingInfo: [labelChainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainageRenderer,

  popupEnabled: false,
});

/* Station Box */
const stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "00_Platform",
      label: "Platform",
      symbol: new SimpleFillSymbol({
        color: [160, 160, 160],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "00_Platform 10car",
      label: "Platform 10car",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "cross",
        outline: {
          width: 1,
          color: "black",
          style: "short-dash",
        },
      }),
    },
    {
      value: "00_Station",
      label: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: [115, 0, 0],
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 7,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* ROW Layer */
const prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  popupEnabled: false,
  renderer: prowRenderer,
});
// prowLayer.listMode = "hide";

/* ROW Layer version 7.1.6 */
const prowoldRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#DF00FF",
    width: "2px",
    // style: "long-dash-dot",
  }),
});

export const prowLayerold = new FeatureLayer({
  portalItem: {
    id: "84ba987eed264fe9b18938000ddf702d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "SC Alignment 7.1.6",
  definitionExpression: "Version = 'v.7.1.6b'",
  popupEnabled: false,
  renderer: prowoldRenderer,
});

/* ROW Layer version 3.9.3 */
const prowold2renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ffc800",
    width: "2px",
    // style: "long-dash-dot",
  }),
});

export const prowLayerold2 = new FeatureLayer({
  portalItem: {
    id: "84ba987eed264fe9b18938000ddf702d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "SC Alignment 3.9.3",
  definitionExpression: "Version = 'v.3.9.3'",
  popupEnabled: false,
  renderer: prowold2renderer,
});

/* Meralco site 1 additioinal PROW Layer */

export const meralco_site1_prowLayer = new FeatureLayer({
  portalItem: {
    id: "87ec32eacf194b91b040ca052574234b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "Meralco Site 1 Additional PROW",
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: prowRenderer,
});

/* Temporary Fencing */
var temporaryFencingRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#FFEBBE",
    width: "2px",
  }),
});

export const temporaryFencingLayer = new FeatureLayer({
  portalItem: {
    id: "e37f3dab086c4063ba28c7e4d4075d60",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Temporary Fencing",
  renderer: temporaryFencingRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Permanent Fencing */
const permanentFencingRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#FFA77F",
    width: "2px",
  }),
});

export const permanentFencingLayer = new FeatureLayer({
  portalItem: {
    id: "e37f3dab086c4063ba28c7e4d4075d60",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Permanent Fencing",
  renderer: permanentFencingRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Maintenance Road */
const maintenanceRoadRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#98E600",
    width: "2px",
  }),
});

export const maintenanceRoadLayer = new FeatureLayer({
  portalItem: {
    id: "e37f3dab086c4063ba28c7e4d4075d60",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "Maintenance Road",
  renderer: maintenanceRoadRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Drainage */
const drainageRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#0070FF",
    width: "2px",
  }),
});

export const drainageLayer = new FeatureLayer({
  portalItem: {
    id: "e37f3dab086c4063ba28c7e4d4075d60",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Drainage",
  renderer: drainageRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Future Track */
const provisionForFreightLineRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#00FFC5",
    width: "2px",
  }),
});

export const provisionForFreightLineLayer = new FeatureLayer({
  portalItem: {
    id: "e37f3dab086c4063ba28c7e4d4075d60",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "Provision for Freight Line",
  renderer: provisionForFreightLineRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/*------- NGCP Layers ---------- */
/* NGCP Working Area */
const ngcpPoleWARenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [197, 0, 255],
    style: "backward-diagonal",
    outline: {
      color: "#C500FF",
      width: 0.7,
    },
  }),
});

// export const ngcp_working_area7 = new FeatureLayer({
//   portalItem: {
//     id: "b7d01020d54c4015ba0ba9454475d1dc",
//     portal: {
//       url: "https://gis.railway-sector.com/portal",
//     },
//   },
//   renderer: ngcpPoleWARenderer,
//   elevationInfo: {
//     mode: "on-the-ground",
//   },
//   definitionExpression: "SiteNo = '7'",
//   layerId: 7,
//   title: "Proposed Pole Working Areas",
// });

export const ngcp_working_area6 = new FeatureLayer({
  portalItem: {
    id: "b7d01020d54c4015ba0ba9454475d1dc",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: ngcpPoleWARenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
  definitionExpression: "SiteNo = '6'",
  layerId: 7,
  title: "Proposed Pole Working Areas",
});

/* NGCP Line  */
const bufferColor = ["#55FF00", "#FFFF00", "#E1E1E1"];
const ngcpLineRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: bufferColor[0],
    width: "3px",
    style: "dash",
  }),
});

export const ngcp_line7 = new FeatureLayer({
  portalItem: {
    id: "b7d01020d54c4015ba0ba9454475d1dc",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: ngcpLineRenderer,
  definitionExpression: "SiteNo = '7' AND LAYER = 2", // 2 is 'Relocation'
  layerId: 2,
  title: "Proposed/Recorded NGCP Lines",
});

export const ngcp_line6 = new FeatureLayer({
  portalItem: {
    id: "b7d01020d54c4015ba0ba9454475d1dc",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: ngcpLineRenderer,
  definitionExpression: "SiteNo = '6' AND LAYER = 2",
  layerId: 2,
  title: "Proposed/Recorded NGCP Lines",
});

/* NGCP Pole site */
const label_ngcp_pole = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: [255, 255, 0],
        },
        size: 15,
        halo: {
          color: "black",
          size: 0.5,
        },
        // font: {
        //   family: 'Ubuntu Mono',
        //   //weight: "bold"
        // },
      }),
    ],
    verticalOffset: {
      screenLength: 30,
      maxWorldLength: 20,
      minWorldLength: 10,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.POLE_ID",
    //value: "{TEXTSTRING}"
  },
});

const ngcpDpwhRoadRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [255, 255, 0],
    style: "backward-diagonal",
    outline: {
      color: "#FFFF00",
      width: 0.7,
    },
  }),
});

export const ngcp_pole7 = new FeatureLayer({
  portalItem: {
    id: "d5b30a79bdae40c492771ec1e46ab0e9",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "SiteNo = '7'",
  layerId: 3,
  renderer: ngcpDpwhRoadRenderer,
  labelingInfo: [label_ngcp_pole],
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: true,
  title: "Proposed Pole Relocation",
});

export const ngcp_pole6 = new FeatureLayer({
  portalItem: {
    id: "d5b30a79bdae40c492771ec1e46ab0e9",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "SiteNo = '6'",
  layerId: 3,
  renderer: ngcpDpwhRoadRenderer,
  labelingInfo: [label_ngcp_pole],
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: true,
  title: "Proposed Pole Relocation",
});

/* PROW for SC Tunnel Alignment */
const prow_tunnel_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "3px",
    style: "dash",
  }),
});

export const prow_tunnelLayer = new FeatureLayer({
  portalItem: {
    id: "63605177aec648e5b3ad232d2b181874",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "on-the-ground",
  },
  renderer: prow_tunnel_renderer,
  popupEnabled: false,
  title: "PROW for Tunnel Alignment",
});

/* PNR */
const pnrRenderer = new UniqueValueRenderer({
  field: "OwnershipType",
  uniqueValueInfos: [
    {
      value: 1, // RP
      label: "RP",
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: 2, // PNR
      label: "PNR",
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
  ],
});

export const pnrLayer = new FeatureLayer({
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Land (Excluded for Acquisition)",
  definitionExpression: "OwnershipType IN (1, 2)",
  elevationInfo: {
    mode: "on-the-ground",
  },
  labelsVisible: false,
  renderer: pnrRenderer,
  popupTemplate: {
    title: "<div style='color: #eaeaea'>{LandOwner} ({LotID})</div>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "OwnershipType",
            label: "Ownership Type",
          },
          {
            fieldName: "HandOverDate",
            label: "Hand-Over Date",
          },
          {
            fieldName: "Municipality",
          },
          {
            fieldName: "Barangay",
          },
          {
            fieldName: "LandOwner",
            label: "Land Owner",
          },
        ],
      },
    ],
  },
});

/* Station Layer */
const labelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 15,
        halo: {
          color: "black",
          size: 0.5,
        },
        // font: {
        //   family: 'Ubuntu Mono',
        //   //weight: "bold"
        // },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Station",
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  title: "SC Stations",
  labelingInfo: [labelClass],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* Proposed East Service Road */
const proposedEastServiceRoadRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#d9dddc",
    width: "2px",
    style: "dash",
  }),
});

export const proposedEastServiceRoadLayer = new FeatureLayer({
  portalItem: {
    id: "3b160b3125ab42759be419be7fbf1edc",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "Proposed East Service Road",
  renderer: proposedEastServiceRoadRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

//-----------------------------------------------//
//                Lot, Structure, NLO            //
//-----------------------------------------------//

//--- LOT LAYER ---//
export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "4692e76be5804db2b38c23df86c7eaa8",
    portal: portalItem_url,
  },
  renderer: lot_access_renderer,
  title: "Handed-Over Area",
  elevationInfo: { mode: "on-the-ground" },
});

//--- STRUCUTURE LAYER ---//
export const structureLayer = new FeatureLayer({
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
  layerId: 2,
  title: "Structure",
  renderer: str_renderer,
  elevationInfo: { mode: "on-the-ground" },
  popupTemplate: str_popup,
});

//--- STRUCUTURE OWNERSHIP LAYER ---//
export const strucOwnershipLayer = new FeatureLayer({
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
  renderer: str_owner_renderer,
  layerId: 2,
  title: "Households Ownership (Structure)",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- NLO LAYER ---//
export const nloLayer = new FeatureLayer({
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: portalItem_url,
  },
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
  portalItem: {
    id: "99500faf0251426ea1df934a739faa6f",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Occupancy (Structure)",
  renderer: str_occup_renderer,
  elevationInfo: { mode: "relative-to-scene" },
  popupTemplate: str_occup_popup,
});

/* Pier Head and Column */
const pHeight = 0;

const pierColumn = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 10,
      material: {
        color: [78, 78, 78, 0.5],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 0.3,
      }),
    }),
  ],
});

const pileCap = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 3,
      material: {
        color: [200, 200, 200, 0.7],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 1.0,
      }),
    }),
  ],
});

const pierHeadRenderer = new UniqueValueRenderer({
  // defaultSymbol: new PolygonSymbol3D({
  //   symbolLayers: [
  //     {
  //       type: "extrude",
  //       size: 5, // in meters
  //       material: {
  //         color: "#E1E1E1",
  //       },
  //       edges: new SolidEdges3D({
  //         color: "#4E4E4E",
  //         size: 1.0,
  //       }),
  //     },
  //   ],
  // }),
  // defaultLabel: "Other",
  field: "Layer",
  legendOptions: {
    title: "Pile Cap/Column",
  },
  uniqueValueInfos: [
    {
      value: "Pier_Column",
      symbol: pierColumn,
      label: "Column",
    },
    /*
  {
    value: "Pier_Head",
    symbol: pierHead,
    label: "Pier Head"
  },
  */
    {
      value: "Pile_Cap",
      symbol: pileCap,
      label: "Pile Cap",
    },
  ],
});

export const pierHeadColumnLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Pile Cap/Column",
  definitionExpression: "Layer <> 'Pier_Head'",

  minScale: 150000,
  maxScale: 0,
  renderer: pierHeadRenderer,
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});
// pierHeadColumnLayer.listMode = "hide";

/* Pier Access Point  */
const defaultPierAccessLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: valueLabelColor,
        },
        size: 15,
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: "$feature.PierNumber",
    //'DefaultValue($feature.GeoTechName, "no data")'
    //"IIF($feature.Score >= 13, '', '')"
    //value: "{Type}"
  },
  labelPlacement: "above-center",
  // where: 'AccessDate IS NULL',
});

export const pierAccessLayer = new FeatureLayer(
  {
    portalItem: {
      id: "e09b9af286204939a32df019403ef438",
      portal: {
        url: "https://gis.railway-sector.com/portal",
      },
    },
    layerId: 3,
    labelingInfo: [defaultPierAccessLabel], // [pierAccessReadyDateLabel, pierAccessNotYetLabel, pierAccessDateMissingLabel], //[pierAccessDateMissingLabel, pierAccessReadyDateLabel, pierAccessNotYetLabel],
    title: "Pier Number", //'Pier with Access Date',
    minScale: 150000,
    maxScale: 0,
    popupEnabled: false,
    elevationInfo: {
      mode: "on-the-ground",
    },
  },
  //{ utcOffset: 300 },
);

const cp_break_line_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#4ce600",
    width: "2px",
  }),
});
export const cp_break_lines = new FeatureLayer({
  portalItem: {
    id: "1a2be501a0f54e048a7200e482eb0dd5",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "CP Break Line",
  renderer: cp_break_line_renderer,
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* For SC Substation */
const scSubstationRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [115, 178, 255],
    style: "backward-diagonal",
    outline: {
      color: "#004DA8",
      width: 1.5,
    },
  }),
});

export const substationLayer = new FeatureLayer({
  portalItem: {
    id: "fd0fd77c428b4fae8f47ac46b26614ec",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 61,
  renderer: scSubstationRenderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Substation",
  elevationInfo: {
    mode: "on-the-ground",
  },
});

// Group layers //
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
    prowLayerold,
    prowLayerold2,
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

export const nloLoOccupancyGroupLayer = new GroupLayer({
  title: "Households Occupancy",
  visible: true,
  visibilityMode: "independent",
  layers: [occupancyLayer, strucOwnershipLayer, nloLayer],
});

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

export // Search components
const sources: any = [
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
