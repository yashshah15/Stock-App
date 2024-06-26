import { useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaRegStar, FaStar } from "react-icons/fa";
import classes from "./detailsheader.module.css";
import { useState } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import StockData from "../../store/stock-context";
import BuySellModal from "../Modal/BuySellModal";
import SuccessAlert from "../alerts/SuccessAlert";

const DetailsHeader = () => {
  const stockCtx = useContext(StockData);
  const companyData = stockCtx.companyDetails;
  const priceData = stockCtx.stockPrices;
  console.log(stockCtx)
  const datetime = new Date(priceData.t * 1000);
  const [isFavorite, toggleFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [isBought, setIsBought] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null)

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (watchlist.length === 0 || !watchlist.includes(companyData.ticker)) {
      toggleFavorite(false);
    } else if (watchlist.includes(companyData.ticker)) {
      toggleFavorite(true);
    }

    const portfolioStocks =
      JSON.parse(localStorage.getItem("portfolioList")) || [];
    if (
      portfolioStocks.length === 0 ||
      !portfolioStocks.includes(companyData.ticker)
    ) {
      setIsBought(false);
    } else {
      setIsBought(true);
    }
  }, [companyData.ticker]);
  
  console.log(stockCtx);
  const favouriteStock = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.push(companyData.ticker);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    toggleFavorite(true);
    setAlertMessage(`${companyData.ticker} successfully added to Watchlist`)
  };

  const unfavouriteStock = () => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist") || []);
    watchlist = watchlist.filter((item) => item !== companyData.ticker);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    toggleFavorite(false);
    setAlertMessage(`${companyData.ticker} removed from Watchlist`)
  };

  const buyHandler = () => {
    setShowModal(true);
    setModalType("Buy");
  };

  const sellHandler = () => {
    setShowModal(true);
    setModalType("Sell");
  };

  const closeHandler = () => {
    setShowModal(false);
    const portfolioStocks =
      JSON.parse(localStorage.getItem("portfolioList")) || [];
    if (
      portfolioStocks.length === 0 ||
      !portfolioStocks.includes(companyData.ticker)
    ) {
      setIsBought(false);
    } else {
      setIsBought(true);
    }
  };

  const clearAlert = () =>{
    setAlertMessage(null)
  }

  const showBuyAlert = () =>{
    setAlertMessage(`${companyData.ticker} Bought Successfully`)
  }

  const showSellAlert = () =>{
    setAlertMessage(`${companyData.ticker} Sold successfully`)
  }

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col>
              <h3 className={classes.stockTicker}>{companyData.ticker}</h3>
              {!isFavorite && (
                <FaRegStar
                  className={classes.starIcon}
                  onClick={favouriteStock}
                ></FaRegStar>
              )}
              {isFavorite && (
                <FaStar
                  className={classes.filedStarIcon}
                  onClick={unfavouriteStock}
                ></FaStar>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h4 className={classes.companyName}>{companyData.name}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <h7>{companyData.exchange}</h7>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="success"
                className={classes.buyButton}
                onClick={buyHandler}
              >
                Buy
              </Button>
              {isBought && (
                <Button variant="danger" onClick={sellHandler}>
                  Sell
                </Button>
              )}
            </Col>
          </Row>
        </Col>
        <Col md="auto">
          <img
            className={classes.logo}
            alt="Company Logo"
            src={`${companyData.logo}`}
          ></img>
        </Col>
        <Col>
          <Row>
            <Col>
              {priceData.d < 0 && (
                <h3 className={classes.stockPriceDown}>{priceData.c.toFixed(2)}</h3>
              )}
              {priceData.d >= 0 && (
                <h3 className={classes.stockPriceUp}>{priceData.c.toFixed(2)}</h3>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {priceData.d >= 0 && (
                <h4
                  className={`${classes.displayRight} ${classes.positivePrice}`}
                >
                  <BiSolidUpArrow style={{marginTop:"auto"}}></BiSolidUpArrow>
                  {priceData.d.toFixed(2)} ({priceData.dp.toFixed(2)}%)
                </h4>
              )}
              {priceData.d < 0 && (
                <h4
                  className={`${classes.displayRight} ${classes.negativePrice}`}
                >
                  <BiSolidDownArrow style={{marginTop:"auto"}}></BiSolidDownArrow>
                  {priceData.d.toFixed(2)} ({priceData.dp.toFixed(2)}%)
                </h4>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h7 className={classes.displayRight}>
                {`${datetime.getFullYear()}-${
                  datetime.getMonth() + 1
                }-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`}{" "}
                {/* 2023-06-27 12:25:03 */}
              </h7>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          {priceData.market_open && (
            <p className={`${classes.marketStatus} ${classes.positivePrice}`}>
              Market is open
            </p>
          )}
          {!priceData.market_open && (
            <p className={`${classes.marketStatus} ${classes.negativePrice}`}>
              Market closed on{" "}
              {`${datetime.getFullYear()}-${
                datetime.getMonth() + 1
              }-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`}
            </p>
          )}
        </Col>
      </Row>
      {showModal && (
        <BuySellModal
          type={modalType}
          ticker={companyData.ticker}
          currentPrice={priceData.c}
          onClose={closeHandler}
          companyName={companyData.name}
          buyAlert={showBuyAlert}
          sellAlert={showSellAlert}
        ></BuySellModal>
      )}
      {alertMessage && <SuccessAlert message={alertMessage} clear={clearAlert}></SuccessAlert>}
    </Container>
  );
};
export default DetailsHeader;
