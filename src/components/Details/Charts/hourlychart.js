import React, { useEffect, useRef, useContext, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import StockData from "../../../store/stock-context";
import { useParams } from "react-router-dom";

const StockChart = () => {
  const params = useParams();
  const chartRef = useRef(null);
  const chartCtxData = useContext(StockData);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const hourlyStockPrices = chartCtxData.hourlyData;
    const chartFields = hourlyStockPrices.c.map((value, index) => [
      hourlyStockPrices.t[index] * 1000,
      value,
    ]);
    setChartData(chartFields);
  }, [chartCtxData.hourlyData]);

  useEffect(() => {
    const chart = chartRef.current.chart;
    chart.series[0].setData(chartData);
  }, [chartData]);

  const options = {
    yAxis: {
      opposite: true,
      title: {
        text: "",
      },
      labels: {
        x: -15,
      },
    },
    xAxis: {
      type: "datetime",
      timezone: "America/Los_Angeles",
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%H:%M", this.value);
        },
      },
    },
    series: [
      {
        data: chartData,
        name: "",
        type: "line",
        color: `${chartCtxData.stockPrices.d > 0 ? "green": "red"}`,
        lineWidth: 2,
        tooltip: {
          valueDecimals: 2,
        },
        marker: {
          enabled: false,
        },
      },
    ],
    chart: {
      height: 340,
      width: 400,
    },
    title: { text: params.ticker + " Hourly Price Variation" },
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
};

export default StockChart;