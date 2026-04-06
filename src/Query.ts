/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */

import {
  dateTable,
  lotLayer,
  structureLayer,
  lotDefaultSymbol,
  uniqueValueInfosLotStatus,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import {
  lotHandedOverAreaField,
  handedOverLotField,
  municipalityField,
  barangayField,
  affectedAreaField,
  cpField,
} from "./uniqueValues";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import type { statisticsType } from "./uniqueValues";

// ****************************
//    Chart Parameters
// ****************************
// Dynamic chart size
export function responsiveChart(
  chart: any,
  pieSeries: any,
  legend: any,
  pieSeriesScale: any,
) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.7; // original 0.7
    const new_fontSize = width / 29;
    const new_pieSeries_scale = width / pieSeriesScale;
    const new_legendMarkerSize = width * 0.045;

    legend.labels.template.setAll({
      width: availableSpace,
      maxWidth: availableSpace,
      fontSize: new_fontSize,
    });

    legend.valueLabels.template.setAll({
      fontSize: new_fontSize,
    });

    legend.markers.template.setAll({
      width: new_legendMarkerSize,
      height: new_legendMarkerSize,
    });

    pieSeries.animate({
      key: "scale",
      to: new_pieSeries_scale,
      duration: 100,
    });
  });
}

interface chartType {
  chart: any;
  pieSeries: any;
  legend: any;
  root: any;
  municipals: any;
  status_field: any;
  arcgisScene: any;
  updateChartPanelwidth: any;
  data: any;
  pieSeriesScale: any;
  pieInnerLabel?: any;
  pieInnerLabelFontSize?: any;
  pieInnerValueFontSize?: any;
  layer: FeatureLayer;
  statusArray: any;
}
export function chartRenderer({
  chart,
  pieSeries,
  legend,
  root,
  municipals,
  status_field,
  arcgisScene,
  updateChartPanelwidth,
  data,
  pieSeriesScale,
  pieInnerLabel,
  pieInnerLabelFontSize,
  pieInnerValueFontSize,
  layer,
  statusArray,
}: chartType) {
  // values inside a donut
  let inner_label = pieSeries.children.push(
    am5.Label.new(root, {
      text: `[#ffffff]{valueSum}[/]\n[fontSize: ${pieInnerLabelFontSize}; #d3d3d3; verticalAlign: super]${pieInnerLabel}[/]`,
      // text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.45em; #d3d3d3; verticalAlign: super]PRIVATE LOTS[/]",
      fontSize: `${pieInnerValueFontSize}`,
      centerX: am5.percent(50),
      centerY: am5.percent(40),
      populateText: true,
      oversizedBehavior: "fit",
      textAlign: "center",
    }),
  );

  pieSeries.onPrivate("width", (width: any) => {
    inner_label.set("maxWidth", width * 0.7);
  });

  // Set slice opacity and stroke color
  pieSeries.slices.template.setAll({
    toggleKey: "none",
    fillOpacity: 0.9,
    stroke: am5.color("#ffffff"),
    strokeWidth: 0.5,
    strokeOpacity: 1,
    templateField: "sliceSettings",
    tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
  });

  // Disabling labels and ticksll
  pieSeries.labels.template.set("visible", false);
  pieSeries.ticks.template.set("visible", false);

  // EventDispatcher is disposed at SpriteEventDispatcher...
  // It looks like this error results from clicking events
  pieSeries.slices.template.events.on("click", (ev: any) => {
    const Selected: any = ev.target.dataItem?.dataContext;
    const Category = Selected.category;
    const find = statusArray.find((emp: any) => emp.category === Category);
    const statusSelected = find?.value;
    const qExpression = `Municipality = '${municipals}' AND ${status_field} = ${statusSelected}`;

    polygonViewQueryFeatureHighlight({
      polygonLayer: layer,
      qExpression: qExpression,
      view: arcgisScene?.view,
    });
  });

  pieSeries.data.setAll(data);

  // Disabling labels and ticksll
  pieSeries.labels.template.setAll({
    visible: false,
    scale: 0,
  });

  // pieSeries.labels.template.set('visible', true);
  pieSeries.ticks.template.setAll({
    visible: false,
    scale: 0,
  });

  // Legend
  // Change the size of legend markers
  legend.markers.template.setAll({
    width: 17,
    height: 17,
  });

  // Change the marker shape
  legend.markerRectangles.template.setAll({
    cornerRadiusTL: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusBR: 10,
  });

  responsiveChart(chart, pieSeries, legend, pieSeriesScale);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  // Change legend labelling properties
  // To have responsive font size, do not set font size
  legend.labels.template.setAll({
    oversizedBehavior: "truncate",
    fill: am5.color("#ffffff"),
  });

  legend.valueLabels.template.setAll({
    textAlign: "right",
    fill: am5.color("#ffffff"),
  });

  legend.itemContainers.template.setAll({
    paddingTop: 3,
    paddingBottom: 1,
  });

  pieSeries.appear(1000, 100);
}

// ****************************
//    Dropdown Parameters
// ****************************
interface queryExpressionType {
  municipal: string;
  barangay: string;
  queryField?: any;
}
export function queryExpression({
  municipal,
  barangay,
  queryField,
}: queryExpressionType) {
  const queryMunicipality = `${municipalityField} = '${municipal}'`;
  const queryBarangay = `${barangayField} = '${barangay}'`;
  const queryMunicipalBarangay = `${queryMunicipality} AND ${queryBarangay}`;

  let expression = "";
  if (queryField) {
    if (!municipal) {
      expression = "1=1" + " AND " + queryField;
    } else if (municipal && !barangay) {
      expression = `${queryMunicipality} AND ${queryField}`;
    } else if (municipal && barangay) {
      `${queryMunicipalBarangay} AND ${queryField}`;
    }
  } else {
    if (!municipal) {
      expression = "1=1";
    } else if (municipal && !barangay) {
      expression = queryMunicipality;
    } else if (municipal && barangay) {
      expression = queryMunicipalBarangay;
    }
  }

  return expression;
}

// Query function for lotLayer
export const queryDropdownTypes = (municipal: any, barangay: any) => {
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;

  return [queryMunicipality, queryMunicipalBarangay];
};

interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
  arcgisScene?: any;
  timesliderstate?: boolean;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
  timesliderstate,
  arcgisScene,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
      }
    }
  }

  if (!timesliderstate) {
    zoomToLayer(lotLayer, arcgisScene);
    zoomToLayer(structureLayer, arcgisScene);
  }
}

//---------------------------------------------//
//           Pie Chart Data Generation         //
//---------------------------------------------//

interface pieChartStatusDataType {
  municipal: string;
  barangay: string;
  layer: any;
  statusList?: any;
  statusColor?: any;
  statusField?: any;
  idField?: any;
  valueSumField?: any;
  queryField?: any;
  statisticType?: statisticsType;
}
export async function pieChartStatusData({
  municipal,
  barangay,
  layer,
  statusList,
  statusColor,
  statusField,
  valueSumField,
  queryField,
  statisticType,
}: pieChartStatusDataType) {
  //--- Main statistics
  let statsCollect: any;
  if (statisticType === "count") {
    statsCollect = new StatisticDefinition({
      onStatisticField: statusField,
      outStatisticFieldName: "statsCollect",
      statisticType: statisticType,
    });
  } else if (statisticType === "sum") {
    statsCollect = new StatisticDefinition({
      onStatisticField: valueSumField,
      outStatisticFieldName: "statsCollect",
      statisticType: statisticType,
    });
  }

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];

  const expression = queryExpression({
    municipal: municipal,
    barangay: barangay,
    queryField: queryField,
  });

  query.where = expression;
  queryDefinitionExpression({
    queryExpression: expression,
    featureLayer: [layer],
  });
  query.orderByFields = [statusField];
  query.groupByFieldsForStatistics = [statusField];

  //--- Query features using statistics definitions
  let total_count = 0;
  return layer?.queryFeatures(query).then(async (response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      total_count += attributes.statsCollect;
      return Object.assign({
        category: statusList[attributes[statusField] - 1],
        value: attributes.statsCollect,
      });
    });

    //--- Account for zero count
    const data0 = statusList.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      return Object.assign({
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusColor[index]),
        },
      });
    });
    return [data0, total_count];
  });
}

export async function totalFieldCount({
  municipal,
  barangay,
  layer,
  idField,
  queryField,
}: pieChartStatusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: idField,
    outStatisticFieldName: "statsCollect",
    statisticType: "count",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = queryExpression({
    municipal: municipal,
    barangay: barangay,
    queryField: queryField,
  });

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

export async function totalFieldSum({
  municipal: municipal,
  barangay: barangay,
  layer,
  valueSumField,
  queryField,
}: pieChartStatusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: valueSumField,
    outStatisticFieldName: "statsCollect",
    statisticType: "sum",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = queryExpression({
    municipal: municipal,
    barangay: barangay,
    queryField: queryField,
  });

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

//-----------------------------------------------------------
// Change symbology of lot layer
export function updateLotSymbology(new_date_field: any) {
  try {
    const lotLayerRenderer = new UniqueValueRenderer({
      field: new_date_field,
      defaultSymbol: lotDefaultSymbol, // autocasts as new SimpleFillSymbol()
      uniqueValueInfos: uniqueValueInfosLotStatus,
    });
    lotLayer.renderer = lotLayerRenderer;
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// get last date of month
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

// Updat date
export async function dateUpdate(category: any) {
  const query = dateTable.createQuery();
  const queryExpression =
    "project = 'SC'" + " AND " + "category = '" + category + "'";
  query.where = queryExpression; // "project = 'N2'" + ' AND ' + "category = 'Land Acquisition'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      // get today and date recorded in the table
      const today = new Date();
      const date = new Date(result.attributes.date);

      // Calculate the number of days passed since the last update
      const time_passed = today.getTime() - date.getTime();
      const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

      const year = date.getFullYear();
      const month = date.toLocaleString("en-US", {
        month: "long",
      });
      const day = date.getDate();
      const as_of_date = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return [as_of_date, days_passed, date];
    });
    return dates;
  });
}

export async function generateHandedOverAreaData() {
  const total_affected_area = new StatisticDefinition({
    onStatisticField: affectedAreaField,
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  const total_handedover_area = new StatisticDefinition({
    onStatisticField: lotHandedOverAreaField,
    outStatisticFieldName: "total_handedover_area",
    statisticType: "sum",
  });

  const query = lotLayer.createQuery();
  query.where = `${cpField} IS NOT NULL`;
  query.outStatistics = [total_affected_area, total_handedover_area];
  query.orderByFields = [cpField];
  query.groupByFieldsForStatistics = [cpField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const affected = attributes.total_affected_area;
      const handedOver = attributes.total_handedover_area;
      const cp = attributes.CP;

      const percent = ((handedOver / affected) * 100).toFixed(0);

      return Object.assign(
        {},
        {
          category: cp,
          value: percent,
        },
      );
    });

    return data;
  });
}

export const dateFormat = (inputDate: any, format: any) => {
  //parse the input date
  const date = new Date(inputDate);

  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  }

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
};

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}
// Zoom to Layer
// const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

let highlight: any;
export function highlightLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    const query = layer.createQuery();
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      const objID = [];
      for (let i = 0; i < length; i++) {
        const obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightHandedOverLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    const query = layer.createQuery();
    query.where = `${handedOverLotField} = 1`;
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      const objID = [];
      for (let i = 0; i < length; i++) {
        const obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightRemove() {
  if (highlight) {
    highlight.remove();
  }
}

// Highlight selected utility feature in the Chart
export const highlightSelectedUtil = (
  featureLayer: any,
  qExpression: any,
  view: any,
) => {
  const query = featureLayer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(featureLayer).then((layerView: any) => {
    featureLayer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      const queryExt = new Query({
        objectIds: objID,
      });

      try {
        featureLayer?.queryExtent(queryExt).then((result: any) => {
          if (result?.extent) {
            view?.goTo(result.extent);
          }
        });
      } catch (error) {
        console.error("Error querying extent for point layer:", error);
      }

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

type layerViewQueryProps = {
  pointLayer1?: FeatureLayer;
  pointLayer2?: FeatureLayer;
  lineLayer1?: FeatureLayer;
  lineLayer2?: FeatureLayer;
  polygonLayer?: FeatureLayer;
  qExpression?: any;
  view: any;
};

export const polygonViewQueryFeatureHighlight = ({
  polygonLayer,
  qExpression,
  view,
}: layerViewQueryProps) => {
  highlightSelectedUtil(polygonLayer, qExpression, view);
};
