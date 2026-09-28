import { useRef, useState, useEffect, memo, use } from "react";
import {
  queryDefinitionExpression,
  thousands_separators,
  toAsofdate,
  useDateFields,
  fieldStatistic,
} from "../query";
import {
  nlo_status_f,
  nlo_status_q,
  municipality_f,
  barangay_f,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { lotLayer, nloLayer } from "../layers";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import { FilterContext } from "../contexts/FilterContext";
import ChartPieSeries from "chart-pie-series";
import QueryExpressionLayers from "query-layers-expression";
import { StatBlock } from "./statBlock";

//--------------------------//
//        useNloData        //
//--------------------------//
function useNloData(
  municipality: string,
  barangay: string,
  statusField: string,
  baseFilter: any,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, statusField, nloLayer],
    queryFn: async () => {
      const q1 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${nlo_status_f} >= 1`,
      });

      queryDefinitionExpression({
        queryExpression: q1.queryExpression(),
        featureLayer: [nloLayer],
      });

      const baseArgs = {
        layer: nloLayer,
        statisticField: "OBJECTID",
        statisticType: "count" as const,
      };

      const [chartData, totalNumber, totalHouseholds] = await Promise.all([
        new ChartPieSeries({
          ...baseArgs,
          where: q1.queryExpression(),
          statusList: nlo_status_q,
          statusField: nlo_status_f,
        }).pieSeries(),

        fieldStatistic({
          ...baseArgs,
          where: new QueryExpressionLayers({ ...baseFilter }).queryExpression(),
        }),

        fieldStatistic({
          ...baseArgs,
          where: q1.queryExpression(),
        }),
      ]);

      return { chartData, totalNumber, totalHouseholds, q1 };
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
//--- memo prevents re-rendering the Component when the parent Component
//--- (ChartMain) is rendered.
const ChartNlo = memo(() => {
  const { municipality, barangay } = use(FilterContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer);
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- Chart parameters
  const new_fontSize = chartPanelwidth / 30;
  const new_valueSize = chartPanelwidth / 19;
  const new_imageSize = chartPanelwidth * 0.028;
  const seriesScale = 280;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const innerValueFontSize = "1.3rem";
  const innerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<any>(null);
  const legendRef = useRef<any>(null);
  const renderRef = useRef<ChartPieSeriesRender | null>(null);
  const chartID = "nlo-chart";

  //--- Base filter
  const baseFilter = {
    qFields: [municipality_f, barangay_f],
    qValues: [municipality, barangay],
  };

  //--- Fetch data
  const { data, isLoading } = useNloData(
    municipality,
    barangay,
    nlo_status_f,
    baseFilter,
  );

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totalNumber = data?.totalNumber || 0;
  const totalHouseholds =
    thousands_separators(data?.totalHouseholds.toFixed(0)) || 0;

  //--- Keep click-handler-relevant values fresh without rebuilding the
  //    chart. view lives here too (not passed statically to the
  //    renderer) since arcgis-scene's view may not be ready on first
  //    mount.
  const configRef = useRef({
    qChart: data?.q1,
    q2Expression: undefined,
    status_field: nlo_status_f,
    view: arcgisScene?.view,
  });

  useEffect(() => {
    configRef.current = {
      qChart: data?.q1,
      q2Expression: undefined,
      status_field: nlo_status_f,
      view: arcgisScene?.view,
    };
  }, [data, nlo_status_f, arcgisScene]);

  //--- Pie Chart Renderer - created ONCE (mount only)
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: -10 });

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText: "{category}",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
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
    });
    legendRef.current = legend;
    legend.setAll({ marginBottom: 30 });
    legend.data.setAll(pieSeries.dataItems);

    //--- NOTE: no `view` here — it's read live from configRef.current
    //    inside chartrender.ts, since arcgis-scene may not have a
    //    ready `.view` yet at this point.
    const renderer = new ChartPieSeriesRender({
      chart,
      pieSeries,
      legend,
      root,
      configRef,
      updateChartPanelwidth: setChartPanelwidth,
      data: [],
      seriesScale,
      innerValue: totalHouseholds,
      innerLabel: "HOUSEHOLDS",
      innerLabelColor: "#ffffff",
      innerLabelFontSize,
      innerValueFontSize,
      layer: nloLayer,
      statusArray: nlo_status_q,
      seriesFillHash: undefined,
    });
    renderRef.current = renderer;
    renderer.chartDataRenderer();

    return () => {
      root.dispose();
      renderRef.current = null;
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-once — do not add dependencies here

  //--- Push new data / inner value / affected-area figures into the
  //    already-mounted chart. No dispose, no rebuild -> no blink.
  //    NOTE: affectedAreaValue is NOT called here directly — it's
  //    registered once inside chartrender.ts and reads live data via
  //    closures, which updateData() keeps in sync. Calling it here on
  //    every render would both miss the first paint and stack
  //    duplicate adapters.
  useEffect(() => {
    if (!renderRef.current) return;
    renderRef.current.updateData(chartData, totalHouseholds, nlo_status_q);
  }, [chartData, totalHouseholds, nlo_status_q]);

  return (
    <>
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "center",
          gap: "25%",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/NLO_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{
            paddingTop: "5px",
            paddingLeft: "5px",
            opacity: isLoading ? 0 : 1,
          }}
        />
        <StatBlock
          label="TOTAL HOUSEHOLDS"
          value={thousands_separators(totalNumber)}
          fontSize={new_fontSize}
          valueSize={new_valueSize}
          isLoading={isLoading}
          labelMarginRight="20px"
        />
      </div>
      <div
        style={{
          color: "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
        }}
      >
        {latestDate ? `As of ${latestDate}` : `As of `}
      </div>
      <div
        id={chartID}
        style={{
          height: "70vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
    </>
  );
});

export default ChartNlo;
