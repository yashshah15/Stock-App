import { Fragment, useEffect, useCallback, useState } from "react";
import classes from "./portfolio.module.css";
import { Box, Alert, Stack } from "@mui/material";
import { Card, Row, Col, Button } from "react-bootstrap";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import BuySellModal from "../components/Modal/BuySellModal";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../components/alerts/SuccessAlert";

const Portfolio = () => {
  const navgate = useNavigate();
  const [isEmpty, setIsEmpty] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [walletAmount, setWalletAmount] = useState(0);

  const fetchData = useCallback(async (portfolioItem) => {
    const response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-latest-price?&symbol=" + portfolioItem.ticker
    );
    let data = await response.json();

    // console.log(data);
    portfolioItem.currentPrice = data.c;
    portfolioItem.change = data.c - portfolioItem.avgCost;
    setPortfolioData((prevState) => [...prevState, portfolioItem]);
  }, []);

  useEffect(() => {
    console.log("Portfolio");
    localStorage.setItem("cache", JSON.stringify(true));
    const portfolio = JSON.parse(localStorage.getItem("portfolioData")) || [];
    if (portfolio.length > 0) {
      setIsEmpty(false);

      for (let i of portfolio) {
        fetchData(i);
      }
    } else {
      setIsEmpty(true);
    }
    const money = JSON.parse(localStorage.getItem("wallet"));
    setWalletAmount(money);
  }, [fetchData]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [alertMessage, setAlertMessage] = useState(null);

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
    setPortfolioData([]);
    const portfolio = JSON.parse(localStorage.getItem("portfolioData")) || [];
    if (portfolio.length > 0) {
      setIsEmpty(false);

      for (let i of portfolio) {
        fetchData(i);
      }
    } else {
      setIsEmpty(true);
    }
    const money = JSON.parse(localStorage.getItem("wallet"));
    setWalletAmount(money);
  };

  const clearAlert = () => {
    setAlertMessage(null);
  };

  const showBuyAlert = () => {
    setAlertMessage(`${selectedItem.ticker} Bought Successfully`);
  };

  const showSellAlert = () => {
    setAlertMessage(`${selectedItem.ticker} Sold successfully`);
  };

  return (
    <Fragment>
      <h1 className={classes.pageTitle}>My Portfolio</h1>
      <h4 className={classes.pageTitle}>
        Money in wallet: ${walletAmount.toFixed(2)}
      </h4>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stack sx={{ width: "60%" }} spacing={2}>
          {isEmpty && (
            <Alert severity="warning">
              Currently you do not have any stock in your Portfolio
            </Alert>
          )}
          {portfolioData.map((item) => (
            <Card key={item.ticker}>
              <Card.Header>
                <h4 className={classes.cardTitle}>{item.ticker}</h4>{" "}
                <span className={classes.companyName}>{item.companyName}</span>
              </Card.Header>
              <Card.Body
                onClick={() => {
                  localStorage.setItem("cache", JSON.stringify(false));
                  navgate("/search/" + item.ticker);
                }}
              >
                <Row>
                  <Col>Quantity:</Col>
                  <Col className={classes.displayRight}>{item.quantity}</Col>
                  <Col>Change:</Col>
                  {item.change >= 0 && (
                    <Col className={classes.stockPriceUp}>
                      <BiSolidUpArrow style={{marginTop:"0.3rem"}}></BiSolidUpArrow>

                      {item.change.toFixed(2)}
                    </Col>
                  )}
                  {item.change < 0 && (
                    <Col className={classes.stockPriceDown}>
                      <BiSolidDownArrow style={{marginTop:"0.3rem"}}></BiSolidDownArrow>
                      {item.change.toFixed(2)}
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col>Avg. Cost/Share:</Col>
                  <Col className={classes.displayRight}>
                    {item.avgCost.toFixed(2)}
                  </Col>
                  <Col>Current Price:</Col>
                  {item.change >= 0 && (
                    <Col className={classes.stockPriceUp}>
                      {item.currentPrice.toFixed(2)}
                    </Col>
                  )}
                  {item.change < 0 && (
                    <Col className={classes.stockPriceDown}>
                      {item.currentPrice.toFixed(2)}
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col>Total Cost:</Col>
                  <Col className={classes.displayRight}>
                    {(item.avgCost * item.quantity).toFixed(2)}
                  </Col>
                  <Col>Market Value</Col>
                  {item.change >= 0 && (
                    <Col className={classes.stockPriceUp}>
                      {(item.currentPrice * item.quantity).toFixed(2)}
                    </Col>
                  )}
                  {item.change < 0 && (
                    <Col className={classes.stockPriceDown}>
                      {(item.currentPrice * item.quantity).toFixed(2)}
                    </Col>
                  )}
                </Row>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  variant="success"
                  className={classes.buyButton}
                  onClick={() => {
                    setSelectedItem(item);
                    buyHandler();
                  }}
                >
                  Buy
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedItem(item);
                    sellHandler();
                  }}
                >
                  Sell
                </Button>
              </Card.Footer>
            </Card>
          ))}
          {showModal && (
            <BuySellModal
              key={selectedItem.ticker}
              type={modalType}
              ticker={selectedItem.ticker}
              currentPrice={selectedItem.currentPrice}
              onClose={closeHandler}
              companyName={selectedItem.companyName}
              buyAlert={showBuyAlert}
              sellAlert={showSellAlert}
            ></BuySellModal>
          )}
        </Stack>
      </Box>
      {alertMessage && (
        <SuccessAlert message={alertMessage} clear={clearAlert}></SuccessAlert>
      )}
    </Fragment>
  );
};

export default Portfolio;
