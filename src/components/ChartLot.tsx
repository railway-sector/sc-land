import { use, useEffect, useRef, useState } from "react";
import { handedOverLotLayer, lotLayer } from "../layers";
import {
  fieldStatistic,
  makeQuery,
  pieChartData,
  PieChartRenderType,
  queryDefinitionExpression,
  thousands_separators,
  toAsofdate,
  useDateFields,
  zoomToLayer,
} from "../query";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import {
  affectedAreaField,
  barangayField,
  lotHandedOverAreaField,
  lotHandedOverField,
  lotIdField,
  lotStatusField,
  lotStatusLabel,
  lotStatusQuery,
  municipalityField,
  primaryLabelColor,
  valueLabelColor,
} from "../uniqueValues";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  affectedAreaValue,
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import ChartPieSeries from "chart-pie-series";
import { MyContext } from "../contexts/MyContext";

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartLot = () => {
  const {
    asofdate,
    timesliderOn,
    newStatusField,
    newHoaField,
    newAfaField,
    newHoField,
    municipality,
    barangay,
  } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<any>(false);

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer);
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- New status field by timeslider state
  const stats_field = timesliderOn ? newStatusField : lotStatusField;

  //--- Common qValues and qFields for QueryExpressionLayers class
  const qV = [municipality, barangay];
  const qF = [municipalityField, barangayField];

  const queryc_lot = makeQuery(qV, qF);
  const queryc_lot2 = makeQuery(qV, qF, `${stats_field} <> 8`);
  const queryc_lot3 = makeQuery(qV, qF, `${stats_field} >= 1`);

  //--- Generate chart data
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [
      municipality,
      barangay,
      newStatusField,
      lotStatusField,
      lotLayer,
      timesliderOn,
    ],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: queryc_lot.queryExpression(),
        featureLayer: [lotLayer, handedOverLotLayer],
      });

      //--- Independent queries: run in parallel instead of sequentially
      const [
        chartData,
        totaln,
        total_affected_area,
        total_ho_area,
        total_ho_lot,
        affected_area_pie,
      ] = await Promise.all([
        //--- Chart data
        pieChartData({
          piechart: new ChartPieSeries(),
          qChart: queryc_lot,
          layer: lotLayer,
          statusList: lotStatusQuery,
          statusField: stats_field,
          statisticField: stats_field,
          statisticType: "count",
        }),

        //--- Total number of lots (public + private)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: lotIdField,
          statisticType: "count",
        }),

        //--- Total affected area (m2)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newAfaField : affectedAreaField,
          statisticType: "sum",
        }),

        //--- Total handed-over area (m2)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newHoaField : lotHandedOverAreaField,
          statisticType: "sum",
        }),

        //--- Total number of handed-over
        fieldStatistic({
          qChart: queryc_lot2.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newHoField : lotHandedOverField,
          statisticType: "sum",
        }),

        //--- Affected are for each status
        pieChartData({
          piechart: new ChartPieSeries(),
          qChart: queryc_lot3,
          layer: lotLayer,
          statusList: lotStatusQuery,
          statusField: stats_field,
          statisticField: timesliderOn ? newAfaField : affectedAreaField,
          statisticType: "sum",
        }),
      ]);

      //--- Handed-Over percent
      const handedover_percent = Number(
        ((total_ho_lot / totaln) * 100).toFixed(0),
      );

      if (!timesliderOn) {
        zoomToLayer(lotLayer, arcgisScene);
      }

      return {
        chartData: chartData[0] || [],
        lotNumber: totaln,
        totalAffectedArea: total_affected_area,
        handedOverArea: total_ho_area,
        handedOverNumber: total_ho_lot,
        affectedAreaPie: affected_area_pie[0] || [],
        handedOverPercent: handedover_percent,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  //--- Call chart data
  const chartData = data?.chartData || [];
  const lotNumber = data?.lotNumber || 0;
  const totalAffectedArea = data?.totalAffectedArea || 0;
  const totalHandedOver = data?.handedOverNumber || 0;
  const totalHandedOverPercent = data?.handedOverPercent || 0;
  const totalHandedOverArea = data?.handedOverArea || 0;
  const affectedAreaStatus = data?.affectedAreaPie || [];

  // ************************************
  //  Chart
  // ***********************************
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.03;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<any>(null);
  const legendRef = useRef<any>(null);
  const chartID = "pie-two";

  useEffect(() => {
    handedOverLotLayer.visible = handedOverCheckBox;
  }, [handedOverCheckBox]);

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: 10 });

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText:
        '{category}[/] ([#C9CC3F; bold]{valuePercentTotal.formatNumber("#.")}%[/]) ',
      radius: 45,
      innerRadius: 28,

      // scale: 1.7,
    });
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      x: 50,
      scale: 1.0,
    });
    legendRef.current = legend;
    legend.setAll({ marginBottom: 10 });
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    PieChartRenderType({
      render: new ChartPieSeriesRender(),
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: queryc_lot,
      q2Expression: undefined,
      status_field: stats_field,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "PRIVATE LOTS",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: lotLayer,
      statusArray: lotStatusQuery,
      bkg_color_switch: false,
      seriesFillHash: undefined,
    });
    affectedAreaValue(legend, affectedAreaStatus, lotStatusLabel);

    // Dispose root
    return () => {
      root.dispose();
    };
  }, [chartID, chartData, affectedAreaStatus]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <img
          src="https://eijigorilla.github.io/Symbols/Land_Acquisition/Land_Logo2.png"
          alt="Land Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Lots
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(lotNumber)}
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Affected Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {totalAffectedArea &&
              thousands_separators(totalAffectedArea.toFixed(0))}
            <label
              style={{ fontWeight: "normal", fontSize: `${new_fontSize}px` }}
            >
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>

      {}

      <div
        style={{
          color: "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
          opacity: isLoading ? 0 : 1,
        }}
      >
        {asofdate ? `As of ${asofdate}` : `As of ${latestDate}`}
      </div>

      {/* Lot Chart */}
      <div
        id={chartID}
        style={{
          width: "100%",
          height: "57vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginBottom: "3%",
          marginTop: "2%",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>

      {/* Handed-Over */}
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "green",
            height: "0",
            marginTop: "13px",
            marginRight: "-10px",
          }}
        >
          <calcite-checkbox
            name="handover-checkbox"
            label="VIEW"
            scale="l"
            oncalciteCheckboxChange={() =>
              setHandedOverCheckBox(handedOverCheckBox === false ? true : false)
            }
          ></calcite-checkbox>
        </div>
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Handed-Over
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {totalHandedOverPercent}% ({thousands_separators(totalHandedOver)})
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Handed-Over Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {totalHandedOverArea &&
              thousands_separators(totalHandedOverArea.toFixed(0))}
            <label
              style={{ fontWeight: "normal", fontSize: `${new_fontSize}px` }}
            >
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>
    </>
  );
}; // End of lotChartgs

export default ChartLot;
