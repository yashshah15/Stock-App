import { Fragment, useState, useEffect, useCallback } from "react";
import DetailsTabs from "./details-tabs";
import DetailsHeader from "./detailsheader";
import { Container } from "react-bootstrap";
import classes from "./detailspage.module.css";
import StockData from "../../store/stock-context";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";


const DetailsPage = () => {
  
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState();
  const [priceData, setPriceData] = useState();
  const [peers, setPeers] = useState([]);
  const [hourlyData, setHourlyData] = useState();
  const [newsData, setNewsData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const [sentiments, setSentiments] = useState();
  const [recommendationData, setRecommendationData] = useState();
  const [EPSdata, setEPSdata] = useState();
  
  

  const fetchData = useCallback(async () => {
    const flag = JSON.parse(localStorage.getItem("cache"))
    console.log(flag)
    if (flag){
      
      const cacheData = JSON.parse(localStorage.getItem("cacheData"))
      console.log(cacheData)
      setCompanyData(cacheData.companyDetails)
      setPriceData(cacheData.priceData)
      setPeers(cacheData.peers)
      setHistoricalData(cacheData.historicalData)
      setHourlyData(cacheData.hourlyData)
      setNewsData(cacheData.newsData)
      setSentiments(cacheData.sentimentData)
      setEPSdata(cacheData.EPSdata)
      setIsLoading(false)
      return
    }
    let cacheObject = {};
    setIsLoading(true);
    let response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-description?symbol=" + params.ticker
    );
    const companyDetails = await response.json();
    
    cacheObject.companyDetails = companyDetails;

    console.log(companyDetails);
    setCompanyData(companyDetails);

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-latest-price?&symbol=" + params.ticker
    );
    let data = await response.json();
    setPriceData(data);
    cacheObject.priceData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-peers?symbol=" + params.ticker
    );
    data = await response.json();
    setPeers(data);
    cacheObject.peers = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-historical-data?&symbol=" +
        params.ticker +
        "&resolution=5"
    );
    data = await response.json();
    setHourlyData(data);
    cacheObject.hourlyData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-latest-news?symbol=" + params.ticker
    );
    data = await response.json();
    setNewsData(data);
    cacheObject.newsData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-historical-data?&symbol=" +
        params.ticker +
        "&resolution=D"
    );
    data = await response.json();
    setHistoricalData(data);
    cacheObject.historicalData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-sentiment?symbol=" + params.ticker
    );
    data = await response.json();
    setSentiments(data);
    cacheObject.sentimentData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-recommendation-trends?symbol=" + params.ticker
    );
    data = await response.json();
    setRecommendationData(data);
    cacheObject.recommendationData = data;

    response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-earnings?symbol=" + params.ticker
    );
    data = await response.json();
    setEPSdata(data);
    cacheObject.EPSdata = data;
    localStorage.setItem("cacheData", JSON.stringify(cacheObject))
    localStorage.setItem("cacheTicker", JSON.stringify(params.ticker))


    setIsLoading(false);
  }, [params.ticker]);

  const fetchCurrentPrice = useCallback( async () =>{
    // console.log(priceData)
    // if(!priceData.market_open){
    //   return
    // }
    const response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-latest-price?&symbol=" + params.ticker
    );
    let data = await response.json();
    const cacheObject = JSON.parse(localStorage.getItem("cacheData"))
    cacheObject.priceData = data
    localStorage.setItem("cacheData", JSON.stringify(cacheObject))
    setPriceData(data);
  }, [params.ticker ])

  useEffect(() => {
    console.log("Fetch Data called");
    fetchData();
    const intervalCall = setInterval(() => {
      fetchCurrentPrice();
    }, 10000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, [fetchData, fetchCurrentPrice]);

  

  return (
    <Fragment>
      <Container className={classes.containerParent}>
        {isLoading && (
          <Spinner
            animation="border"
            variant="primary"
            className={classes.spinner}
          />
        )}

        {!isLoading && (
          <StockData.Provider
            value={{
              companyDetails: companyData,
              stockPrices: priceData,
              companyPeers: peers,
              hourlyData: hourlyData,
              newsData: newsData,
              historicalData: historicalData,
              socialMedia: sentiments,
              trends: recommendationData,
              EPSdata: EPSdata,
            }}
          >
            <DetailsHeader></DetailsHeader>
            <DetailsTabs></DetailsTabs>
          </StockData.Provider>
        )}
      </Container>
      
    </Fragment>
  );
};

export default DetailsPage;
