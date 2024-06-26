import { Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useRef } from "react";
import classes from "./BuySellModal.module.css";

const BuySellModal = (props) => {
  const [show, setShow] = useState(true);
  const quantityRef = useRef();
  const handleClose = () => {
    setShow(false);
    props.onClose();
  };
  let money = JSON.parse(localStorage.getItem("wallet"));
  const [error, setError] = useState();
  const [isError, setIsError] = useState(false);
  const [total, setTotal] = useState(0);

  //   const handleShow = () => setShow(true);

  const changeNumHandler = () => {
    const quantity = quantityRef.current.value;
    if (props.type === "Buy") {
      setTotal(quantity * props.currentPrice);
      if (quantity * props.currentPrice > money) {
        setIsError(true);
        setError("Not Enough Money in wallet!");
      } else {
        setIsError(false);
        setError("");
      }
    }
    if (props.type === "Sell") {
      const portfolio = JSON.parse(localStorage.getItem("portfolioData"));
      const portfolioQuantity = portfolio.filter(
        (item) => item.ticker === props.ticker
      )[0].quantity;
      //  console.log(portfolioQuantity)
      setTotal(parseInt(quantityRef.current.value) * props.currentPrice);
      if (portfolioQuantity < parseInt(quantityRef.current.value)) {
        setIsError(true);
        setError("You cannot sell stocks you don't own!");
      } else {
        setIsError(false);
        setError("");
      }
    }
  };

  const buttonHandler = () => {
    if (props.type === "Buy") {
      const portfolioStocks =
        JSON.parse(localStorage.getItem("portfolioList")) || [];
      if (
        portfolioStocks.length === 0 ||
        !portfolioStocks.includes(props.ticker)
      ) {
        portfolioStocks.push(props.ticker);
        localStorage.setItem("portfolioList", JSON.stringify(portfolioStocks));
      }
      money = money - quantityRef.current.value * props.currentPrice;
      localStorage.setItem("wallet", JSON.stringify(money));
      console.log(money);

      const portFolioData =
        JSON.parse(localStorage.getItem("portfolioData")) || [];
      if (
        portFolioData.length === 0 ||
        !portFolioData.find((data) => data.ticker === props.ticker)
      ) {
        portFolioData.push({
          ticker: props.ticker,
          quantity: parseInt(quantityRef.current.value),
          avgCost: props.currentPrice,
          companyName: props.companyName,
        });
      } else {
        const currentStockData = portFolioData.find(
          (data) => data.ticker === props.ticker
        );
        console.log(currentStockData);
        currentStockData.avgCost =
          (currentStockData.quantity * currentStockData.avgCost +
            parseInt(quantityRef.current.value) * props.currentPrice) /
          (parseInt(quantityRef.current.value) + currentStockData.quantity);
        currentStockData.quantity =
          parseInt(quantityRef.current.value) +
          parseInt(currentStockData.quantity);

        const index = portFolioData.findIndex(
          (obj) => obj.ticker === props.ticker
        );
        portFolioData[index] = currentStockData;
      }
      localStorage.setItem("portfolioData", JSON.stringify(portFolioData));

      handleClose();
      props.buyAlert()
    } else if (props.type === "Sell") {
      let portfolioData =
        JSON.parse(localStorage.getItem("portfolioData")) || [];
      const currentStockData = portfolioData.find(
        (data) => data.ticker === props.ticker
      );

      money = money + parseInt(quantityRef.current.value) * props.currentPrice;
      localStorage.setItem("wallet", JSON.stringify(money));

      currentStockData.quantity -= parseInt(quantityRef.current.value);
      if (currentStockData.quantity === 0) {
        portfolioData = portfolioData.filter(
          (item) => item.ticker !== props.ticker
        );
        let portfolioStocks = JSON.parse(localStorage.getItem("portfolioList"))

        portfolioStocks = portfolioStocks.filter((item) => item !== props.ticker)
        localStorage.setItem("portfolioList", JSON.stringify(portfolioStocks));
        console.log(portfolioData);
      }
      else{
        const index = portfolioData.findIndex(
            (obj) => obj.ticker === props.ticker
          );
          portfolioData[index] = currentStockData;
      }
      localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
      handleClose();
      props.sellAlert()
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h4>{props.ticker}</h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="auto">Current Price:</Col>
          <Col md="auto">${props.currentPrice}</Col>
        </Row>
        <Row>
          <Col md="auto">Money In wallet:</Col>
          <Col md="auto">${money.toFixed(2)}</Col>
        </Row>
        <Row>
          <Col md="auto">Quantity:</Col>
          <Col md="auto">
            <input
              type="number"
              min={1}
              onChange={changeNumHandler}
              ref={quantityRef}
            />
          </Col>
        </Row>
        {isError && <p className={classes.errorMessage}>{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>Total: {total > 0? total.toFixed(2): 0}</span>
          <Button variant="success" onClick={buttonHandler} disabled={isError}>
            {props.type}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BuySellModal;
