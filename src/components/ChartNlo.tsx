/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, useEffect, memo, use } from "react";
import {
  pieChartData,
  queryDefinitionExpression,
  thousands_separators,
  toAsofdate,
  useDateFields,
} from "../query";
import {
  nloStatusField,
  primaryLabelColor,
  nloStatusQuery,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { lotLayer, nloLayer, piechart_nlo, queryc_nlo } from "../layers";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  maybeDisposeRoot,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import { MyContext } from "../contexts/MyContext";

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//

//--- memo prevents re-rendering the Component when the parent Component
//--- (ChartMain) is rendered.
const ChartNlo = memo(() => {
  const { municipality, barangay } = use(MyContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- As of date
  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer);
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- Chart parameters
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.028;
  const new_pieSeriesScale = 280;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieInnerValueFontSize = "1.3rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartID = "nlo-chart";

  //--- 2. Streamlined Data Fetching with useQuery
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, nloStatusField, nloLayer],
    queryFn: async () => {
      queryc_nlo.qValues = [municipality, barangay];
      queryc_nlo.qExpression = `${nloStatusField} >= 1`;

      queryDefinitionExpression({
        queryExpression: queryc_nlo.queryExpression(),
        featureLayer: [nloLayer],
      });

      //--- Pie chart data
      const chartData = await pieChartData({
        piechart: piechart_nlo,
        qChart: queryc_nlo,
        layer: nloLayer,
        statusList: nloStatusQuery,
        statusField: nloStatusField,
        statisticField: nloStatusField,
        statisticType: "count",
      });

      return {
        chartData: chartData[0] || [],
        totalNumber: chartData[1],
      };
    },
    staleTime: Infinity,
  });

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totalNumber = data?.totalNumber || 0;

  useEffect(() => {
    maybeDisposeRoot(chartID);
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
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    const crender = new ChartPieSeriesRender(
      chart,
      pieSeries,
      legend,
      root,
      queryc_nlo,
      undefined,
      nloStatusField,
      arcgisScene?.view,
      setChartPanelwidth,
      chartData,
      new_pieSeriesScale,
      "HOUSEHOLDS",
      new_pieInnerLabelFontSize,
      new_pieInnerValueFontSize,
      nloLayer,
      nloStatusQuery,
    );
    crender.chartDataRenderer();

    return () => {
      root.dispose();
    };
  }, [chartID, chartData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          // marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/NLO_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "20px",
            }}
          >
            TOTAL HOUSEHOLDS
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
            {thousands_separators(totalNumber)}
          </dd>
        </dl>
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
}); // End of lotChartgs

export default ChartNlo;
