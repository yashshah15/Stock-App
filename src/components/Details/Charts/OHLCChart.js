import React, { useContext } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators";
import VolumeByPrice from "highcharts/indicators/volume-by-price";
import StockData from "../../../store/stock-context";
import { useParams } from "react-router-dom";

// Highcharts.maps['indicators/indicators'] = null;
Indicators(Highcharts);
VolumeByPrice(Highcharts);

const OHLCChart = () => {

  const params = useParams()
  const stockCtx = useContext(StockData);
  const ohlcDdata = stockCtx.historicalData;

  let ohlc_data = [];
  for (let i = 0; i < ohlcDdata.o.length; i++) {
    ohlc_data.push([
      ohlcDdata.t[i] * 1000,
      ohlcDdata.o[i],
      ohlcDdata.h[i],
      ohlcDdata.l[i],
      ohlcDdata.c[i],
    ]);
  }
  // const ohlc_data = [
  //   [1615248000000, 123.45, 130.67, 120.32, 128.56],
  //   [1615334400000, 129.87, 135.21, 128.34, 133.42],
  //   [1615420800000, 132.56, 137.98, 130.45, 136.78],
  //   // Add more data points...
  // ];
  let stock_volume = [];
  for (let i = 0; i < ohlcDdata.v.length; i++) {
    stock_volume.push([ohlcDdata.t[i] * 1000, ohlcDdata.v[i]]);
  }

  // const stock_volume = [
  //   [1615248000000, 1000000],
  //   [1615334400000, 1500000],
  //   [1615420800000, 1200000],
  //   // Add more data points...
  // ];

  const options = 
    {
      series: [
        {
          type: 'candlestick',
          name: params.ticker.toUpperCase(),
          id: params.ticker,
          zIndex: 2,
          data: ohlc_data,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: stock_volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: params.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: params.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: params.ticker.toUpperCase() + ' Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      xAxis: {
        labels: {
          formatter: function () {
            return Highcharts.dateFormat("%d-%m-%Y %H:%M", this.value);
          }
        }
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 6,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      rangeSelector: {
        enabled:true,
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
      },
      legend:{
        enabled:false
      },
      navigator:{
        enabled:true
      }
    
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default OHLCChart;
