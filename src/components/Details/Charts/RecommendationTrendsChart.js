import { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import StockData from "../../../store/stock-context";

const RecommendationTrendsChart = () => {
  const stockCtx = useContext(StockData)
  const trendsData = stockCtx.trends

  const chartOptions = {
    chart: {
      type: "column",
    },
    colors: ["#01750F", "#04CF1C", "#DB7E04", "#CC1D28", "#730202"],
    title: {
      text: "Recommendation trends",
    },
    xAxis: {
      categories: trendsData.year,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Analysis",
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
        },
      },
      reversedStacks: true, // Reverse the order of stacks
    },
    legend: {
        align: 'center',
        verticalAlign: 'bottom', // Display legend below X-axis
        layout: 'horizontal',
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        type: "column",
        name: "StrongBuy",
        data: trendsData.strongBuy,
      },
      {
        type: "column",
        name: "Buy",
        data: trendsData.buy,
      },
      {
        type: "column",
        name: "Hold",
        data: trendsData.hold,
      },
      {
        type: "column",
        name: "Sell",
        data: trendsData.sell,
      },
      {
        type: "column",
        name: "StrongSell",
        data: trendsData.strongSell,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default RecommendationTrendsChart;
