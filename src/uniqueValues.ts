import Collection from "@arcgis/core/core/Collection";
import ActionButton from "@arcgis/core/support/actions/ActionButton";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { yearMonthDay } from "./query";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
export const portalItem_url = {
  url: "https://gis.railway-sector.com/portal",
};

//--- cp list
export const cp_list = [
  "S-01",
  "S-02",
  "S-03a",
  "S-03b",
  "S-03c",
  "S-04",
  "S-05",
  "S-06",
  "S-07",
];

export const monitorLists = ["Land Acquisition", "Structure", "Non Land Owner"];

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
// chart width
export const chart_width = "26vw";
export const chart_box_width = 250;

// labeling and value label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

//----------------------------------------------//
//          Lot Layer Parameters                //
//----------------------------------------------//
//--- Layer Fields
// Acronym:
// ho: handed over
// hoa: handed-over area
// hod: handed-over date
// pri: priority
// lu: land use
// pho: percent handed-over area
// aa: affected area
export const lot_hod_f = "HandOverDate";
export const lot_id_f = "LotID";
export const lot_pri_f = "Priority1_1";
export const lot_status_f = "StatusLA";
export const municipality_f = "Municipality";
export const barangay_f = "Barangay";
export const lot_lo_f = "LandOwner";
export const cp_f = "CP";
export const lot_lu_f = "LandUse";
export const lot_endorsed_f = "Endorsed";
export const lot_ho_f = "HandedOver";
export const lot_hoa_f = "HandedOverArea";
export const lot_pho_f = "percentHandedOver";
export const lot_aa_f = "AffectedArea";
export const lot_tunnel_f = "TunnelAffected";
export const lot_endorsed_arr = ["Not Endorsed", "Endorsed", "NA"];

//--- LOT LAYER ---//
//Layer Query
export const lot_status_q = [
  { value: 1, category: "Paid", color: "#00734d" },
  { value: 2, category: "For Payment Processing", color: "#0070ff" },
  { value: 3, category: "For Legal Pass", color: "#ffff00" },
  { value: 4, category: "For Offer to Buy", color: "#ffaa00" },
  { value: 5, category: "For Notice of Taking", color: "#FF5733" },
  { value: 6, category: "With PTE", color: "#70AD47" },
  { value: 7, category: "For Expropriation", color: "#6f0000" },
  { value: 8, category: "Optimized", color: "#B2B2B2" },
];

//--- Layer Labels
export const lot_label = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 0.5,
    font: {
      size: 11,
      weight: "bold",
    },
  },
});

export const lot_symbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    color: [110, 110, 110],
    width: 0.7,
  },
});

export const lot_uniqueV = lot_status_q.map((item: any) => {
  return Object.assign({
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({
      color: item.color,
    }),
  });
});

export const lot_renderer = new UniqueValueRenderer({
  field: lot_status_f,
  defaultSymbol: lot_symbol, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: lot_uniqueV,
});

//--- Layer Popup
const highlight = (value: unknown) =>
  `<span style="color: #d9dc00ff; font-weight: bold">${value}</span>`;

const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;

    const hoa = attrs[lot_pho_f];
    const statusV = attrs[lot_status_f];
    const lu = attrs[lot_lu_f];
    const municipal = attrs[municipality_f];
    const barangay = attrs[barangay_f];
    const lo = attrs[lot_lo_f];
    const cpNo = attrs[cp_f];
    const endorsed = lot_endorsed_arr[attrs[lot_endorsed_f]];
    const { year, month, day } = yearMonthDay(attrs[lot_hod_f]);

    const status =
      lot_status_q.find((f: any) => f.value === statusV)?.category ?? "";
    const lu_label = lu >= 1 ? lot_lu_arr[lu - 1] : "";

    return `
      <div style="color: #eaeaea">
        <ul>
          <li>Handed-Over Area: ${highlight(`${hoa} %`)}</li>
          <li>Handed-Over Date: ${highlight(`${year}-${month}-${day}`)}</li>
          <li>Status: ${highlight(status)}</li>
          <li>Land Use: ${highlight(lu_label)}</li>
          <li>Municipality: ${highlight(municipal)}</li>
          <li>Barangay: ${highlight(barangay)}</li>
          <li>Land Owner: ${highlight(lo)}</li>
          <li>CP: ${highlight(cpNo)}</li>
          <li>Endorsed: ${highlight(endorsed)}</li>
        </ul>
      </div>
    `;
  },
});

export const lot_popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Lot No.: <b>{LotID}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

//--- Land use Array
export const lot_lu_arr = [
  "Agricultural",
  "Agricultural & Commercial",
  "Agricultural / Residential",
  "Commercial",
  "Industrial",
  "Irrigation",
  "Residential",
  "Road",
  "Road Lot",
  "Special Exempt",
];

//--- HANDED-OVER LOTS (PUBLIC + PRIATE LOTS) ---//
export const lot_ho_renderer = new UniqueValueRenderer({
  valueExpression:
    "When($feature.HandedOver == 1 && $feature.StatusLA != 8, 'Handed-Over', 'others')",
  uniqueValueInfos: [
    {
      value: "Handed-Over",
      label: "Handed-Over",
      symbol: new SimpleFillSymbol({
        color: [0, 255, 255, 0.3],
        outline: new SimpleLineSymbol({
          color: "#00ffff",
          width: "4px",
        }),
      }),
    },
  ],
});

//--- OPTIMIZED LOT FOR PASSENGER LINE ---//
export const lot_opt_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#bbbbbb",
    style: "diagonal-cross",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#FF5733", // [0, 255, 255, 1],
      width: "6px",
    },
  }),
});

//--- STUDIED LOTS: PASSENGER & FREIGHT LINE FOR OPTIMIZATION ---//
export const lot_studied_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#808080",
    style: "horizontal",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#808080", //#DF73FF,
      width: "6px",
    },
  }),
});

//--- TUNNEL AFFECTED LOTS ---//
export const lot_tunnel_renderer = new UniqueValueRenderer({
  field: lot_tunnel_f,
  uniqueValueInfos: [
    {
      value: 1,
      label: "Tunnel Affected",
      symbol: new SimpleFillSymbol({
        color: [255, 0, 0, 0],
        outline: {
          color: "#00c5ff",
          width: 0.3,
        },
      }),
    },
  ],
});

//--- ACCESSIBLE LOT AREA BY CONTRACTORS ---//
export const lot_access_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "purple",
    // style: 'cross',
    style: "solid",

    outline: {
      width: 1,
      color: "black",
    },
  }),
});

//----------------------------------------------//
//       Structure Layer Parameters             //
//----------------------------------------------//
//--- STRUCTURE LAYER ---//
export const str_status_f = "StatusStruc";
export const str_id_f = "StrucID";
export const str_pte_f = "PTE";

export const rgb = [
  [0, 197, 255, 0.6],
  [112, 173, 71, 0.6],
  [0, 112, 255, 0.6],
  [255, 255, 0, 0.6],
  [255, 170, 0, 0.6],
  [255, 83, 73, 0.6],
  [178, 190, 181, 0.6],
];

export const str_status_q = [
  {
    value: 1,
    category: "Demolished",
    color: "#00C5FF",
    colrgb: rgb[0],
  },
  { value: 2, category: "Paid", color: "#70AD47", colrgb: rgb[1] },
  {
    value: 3,
    category: "For Payment Processing",
    color: "#0070FF",
    colrgb: rgb[2],
  },
  { value: 4, category: "For Legal Pass", color: "#FFFF00", colrgb: rgb[3] },
  {
    value: 5,
    category: "For Offer to Compensate",
    color: "#FFAA00",
    colrgb: rgb[4],
  },
  {
    value: 6,
    category: "For Notice of Taking",
    color: "#FF5733",
    colrgb: rgb[5],
  },
  {
    value: 7,
    category: "No Need to Acquire",
    color: "#B2BEB5",
    colrgb: rgb[6],
  },
];

const height = 5;
const edgeSize = 0.3;

const str_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 5,
      material: {
        color: [0, 0, 0, 0.4],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: edgeSize,
      }),
    }),
  ],
});

const str_uniqueV = str_status_q.map((item: any) => {
  return {
    value: item.value,
    symbol: new PolygonSymbol3D({
      symbolLayers: [
        new ExtrudeSymbol3DLayer({
          size: height,
          material: {
            color: item.colrgb,
          },
          edges: new SolidEdges3D({
            color: "#4E4E4E",
            size: edgeSize,
          }),
        }),
      ],
    }),
    label: item.category,
  };
});

export const str_renderer = new UniqueValueRenderer({
  defaultSymbol: str_symbol,
  defaultLabel: "Other",
  field: str_status_f,
  uniqueValueInfos: str_uniqueV,
});

export const str_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "StrucOwner",
          label: "Structure Owner",
        },
        {
          fieldName: "Municipality",
        },
        {
          fieldName: "Barangay",
        },
        {
          fieldName: "StatusStruc",
          label: "<p>Status for Structure</p>",
        },
        {
          fieldName: "Name",
        },
        {
          fieldName: "Status",
          label: "Households Ownership (structure) ",
        },
      ],
    },
  ],
};

//--- STRUCUTURE OWNERSHIP LAYER ---//
export const str_owner_status_f = "Status";
const str_owner_q = [
  { value: 1, category: "LO (Land Owner)", color: [128, 128, 128, 1] },
  { value: 2, category: "Households", color: [128, 128, 128, 1] },
];

export const str_uniqueV_owner = str_owner_q.map((item: any) => {
  return {
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({
      style: "forward-diagonal",
      color: item.color,
      outline: {
        color: "#6E6E6E",
        width: 0.3,
      },
    }),
  };
});

export const str_owner_renderer = new UniqueValueRenderer({
  field: str_owner_status_f,
  uniqueValueInfos: str_uniqueV_owner,
});

//----------------------------------------------//
//       Households Layer Parameters             //
//----------------------------------------------//
//--- NLO LAYER ---//
export const nlo_status_f = "StatusRC";

export const nlo_status_symbol = [
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Relocated.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Paid.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_PaymentProcess.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LegalPass.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_OtC.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LBP.svg",
];

export const nlo_status_q = [
  {
    value: 1,
    category: "Relocated",
    color: "#00C5FF",
    logo: nlo_status_symbol[0],
  },
  { value: 2, category: "Paid", color: "#70AD47", logo: nlo_status_symbol[1] },
  {
    value: 3,
    category: "For Payment Processing",
    color: "#0070FF",
    logo: nlo_status_symbol[2],
  },
  {
    value: 4,
    category: "For Legal Pass",
    color: "#FFFF00",
    logo: nlo_status_symbol[3],
  },
  {
    value: 5,
    category: "For Appraisal/OtC/Requirements for Other Entitlements",
    color: "#FFAA00",
    logo: nlo_status_symbol[4],
  },
  {
    value: 6,
    category: "For Notice of Taking",
    color: "#FF0000",
    logo: nlo_status_symbol[5],
  },
];

const symbolSize = 30;

const nlo_uniqueV = nlo_status_q.map((item: any) => {
  return Object.assign({
    value: item.value,
    label: item.category,
    symbol: new PointSymbol3D({
      symbolLayers: [
        new IconSymbol3DLayer({
          resource: {
            href: item.logo,
          },
          size: symbolSize,
          outline: {
            color: "white",
            size: 2,
          },
        }),
      ],
    }),
  });
});

export const nlo_renderer = new UniqueValueRenderer({
  field: nlo_status_f,
  uniqueValueInfos: nlo_uniqueV,
});

export const nlo_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "StrucOwner",
          label: "Structure Owner",
        },
        {
          fieldName: "Municipality",
        },
        {
          fieldName: "Barangay",
        },
        {
          fieldName: "StatusRC",
          label: "<p>Status for Relocation</p>",
        },
        {
          fieldName: "Name",
        },
        {
          fieldName: "Status",
          label: "Households Ownership (structure) ",
        },
      ],
    },
  ],
};

//--- HOUSEHOLDS OCCUPANCY (STATUS OF RELOCATION) ---//
export const str_occup_f = "Occupancy";
export const str_occup_q = [
  {
    value: 0,
    category: "Occupied",
    ref: "https://EijiGorilla.github.io/Symbols/Demolished.png",
  },
  {
    value: 1,
    category: "Relocated",
    ref: "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
  },
];

const str_occup_offsetV = {
  screenLength: 10,
  maxWorldLength: 10,
  minWorldLength: 10,
};
const occupancyPointSize = 20;

const str_occup_uniqueV = str_occup_q.map((item: any) => {
  return {
    value: item.value,
    label: item.category,
    symbol: new PointSymbol3D({
      symbolLayers: [
        new IconSymbol3DLayer({
          resource: {
            href: item.ref,
          },
          size: occupancyPointSize,
          outline: {
            color: "white",
            size: 2,
          },
        }),
      ],
      verticalOffset: str_occup_offsetV,

      callout: {
        type: "line", // autocasts as new LineCallout3D()
        color: [128, 128, 128, 0.6],
        size: 0.4,
        border: {
          color: "grey",
        },
      },
    }),
  };
});

export const str_occup_renderer = new UniqueValueRenderer({
  field: str_occup_f,
  uniqueValueInfos: str_occup_uniqueV,
});

export const str_occup_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "StrucOwner",
          label: "Structure Owner",
        },
        {
          fieldName: "Municipality",
        },
        {
          fieldName: "Barangay",
        },
        {
          fieldName: "Occupancy",
          label: "<p>Status for Relocation(structure)</p>",
        },
        {
          fieldName: "Name",
        },
        {
          fieldName: "Status",
          label: "Households Ownership",
        },
      ],
    },
  ],
};

//----------------------------------------------//
//                Other Layers                  //
//----------------------------------------------//s

// Layter list
export async function defineActions(event: any) {
  const { item } = event;

  // NGCP Site 6
  if (item.title === "Proposed Pole Working Areas") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpwa6",
        }),
      ]),
    ]);
  }

  if (item.title === "Proposed/Recorded NGCP Lines") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpline6",
        }),
      ]),
    ]);
  }

  if (item.title === "Proposed Pole Relocation") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcppolerelo6",
        }),
      ]),
    ]);
  }

  // NGCP Site 7
  // if (item.title === "Proposed Pole Working Areas") {
  //   item.actionsSections = new Collection([
  //     new Collection([
  //       new ActionButton({
  //         title: "Zoom to Area",
  //         icon: "zoom-in-fixed",
  //         id: "full-extent-ngcpwa7",
  //       }),
  //     ]),
  //   ]);

  //   // highlightLot(ngcp_tagged_structureLayer);
  // }

  if (item.title === "Proposed/Recorded NGCP Lines") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpline7",
        }),
      ]),
    ]);
  }

  if (item.title === "Proposed Pole Relocation") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcppolerelo7",
        }),
      ]),
    ]);
  }

  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  // if (item.title === "Super Urgent Lot") {
  //   // highlightLot(superUrgentLotLayer);
  // } else if (item.title === "Handed-Over (public + private)") {
  //   // highlightLot(handedOverLotLayer);
  // } else if (item.title === "Tunnel Affected") {
  //   highlightLot(tunnelAffectedLotLayer, arcgisScene);
  // }

  item.title === "Chainage" ||
  item.title === "SC Alignment 7.1.6" ||
  item.title === "SC Alignment 3.9.3" ||
  item.title === "Substation" ||
  item.title === "Households Ownership (Structure)" ||
  item.title === "Super Urgent Lot" ||
  item.title === "Handed-Over (public + private)" ||
  item.title === "For Land Optimization" ||
  item.title === "Tunnel Affected" ||
  item.title ===
    "Candidate Lots of NSCR-Ex Passenger & Freight Line for Optimization" ||
  item.title === "Optimized Lots with Issued Notice of Taking" ||
  item.title === "Structure" ||
  item.title === "Households" ||
  item.title === "Occupancy (Structure)" ||
  item.title === "Proposed Pole Working Areas" ||
  item.title === "Proposed/Recorded NGCP Lines" ||
  item.title === "Proposed Pole Relocation" ||
  item.title === "Proposed East Service Road" ||
  item.title === "Temporary Fencing" ||
  item.title === "Permanent Fencing" ||
  item.title === "Drainage" ||
  item.title === "Provision for Freight Line" ||
  item.title === "Maintenance Road" ||
  item.title === "Handed-Over Area"
    ? (item.visible = false)
    : (item.visible = true);
}
