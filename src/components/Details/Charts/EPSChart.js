import { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import StockData from "../../../store/stock-context";


const EPSChart = () => {
  const stockCtx = useContext(StockData)
  const EPSdata = stockCtx.EPSdata
  let companyEarnings =[]
  console.log(EPSdata)
  for (let i of EPSdata){
    companyEarnings.push({
      period:i.period,
      surprise: i.surprise,
      actual: i.actual,
      estimate: i.estimate
    })
  }

  // const companyEarnings = [
  //   {
  //     period: "2021-13-05",
  //     surprise: "0.123",
  //     actual: 1.23,
  //     estimate: 1.1,
  //   },
  //   {
  //     period: "2043-05-98",
  //     surprise: "0.456",
  //     actual: 2.34,
  //     estimate: 2.1,
  //   },
  //   {
  //     period: "230-98-78",
  //     surprise: "0.789",
  //     actual: 3.45,
  //     estimate: 3.2,
  //   },
  //   {
  //     period: "2025-07-13",
  //     surprise: "0.987",
  //     actual: 4.56,
  //     estimate: 4.3,
  //   },
  // ];

  const chartOptions = {
    chart: {
      type: "spline",
    },
    title: {
      text: "Historical EPS Surprises",
    },
    xAxis: {
      reversed: false,
      maxPadding: 0.05,
      showLastLabel: true,
      categories: companyEarnings.map(
        (earning) => `${earning.period}<br> Surprise:${earning.surprise}`
      ),
    },
    yAxis: {
      min: 0,
      title: {
        text: "Quarterly EPS",
      },
      lineWidth: 2,
    },

    legend: {
      align: "center",
      verticalAlign: "bottom", // Display legend below X-axis
      layout: "horizontal",
      backgroundColor: "white",
      borderColor: "#CCC",
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    series: [
      {
        type: "spline",
        name: "Actual",
        data: companyEarnings.map((earning) => [
          earning.period,
          earning.actual,
        ]),
      },
      {
        type: "spline",
        name: "Estimate",
        data: companyEarnings.map((earning) => [
          earning.period,
          earning.estimate,
        ]),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default EPSChart;
