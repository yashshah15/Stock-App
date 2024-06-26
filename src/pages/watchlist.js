import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { Fragment, useEffect, useState, useCallback } from "react";
import classes from "./watchlist.module.css";
import { Card, Row, Col, Container } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
  const navgate = useNavigate();
  const [isEmpty, setIsEmpty] = useState(false);
  const [watchListData, setWatchListData] = useState([]);
  

  const fetchData = useCallback(async (ticker) => {
    const response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-latest-price?&symbol=" + ticker
    );
    let data = await response.json();
    const resp = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-description?symbol=" + ticker
    );
    let d = await resp.json();

    data.companyName = d.name;
    data.ticker = d.ticker;
    data.id = d.ticker;
    console.log(data);
    setWatchListData((prevState) => [...prevState, data]);
  }, []);

  useEffect(() => {
    console.log("In USe Effect");
    localStorage.setItem("cache", JSON.stringify(true))
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (watchlist.length > 0) {
      setIsEmpty(false);

      for (let i of watchlist) {
        fetchData(i);
      }
    } else {
      setIsEmpty(true);
    }
  }, [fetchData]);

  const removeFromWatchList = (ticker) => {
    console.log(watchListData);
    let watchlist = JSON.parse(localStorage.getItem("watchlist") || []);
    watchlist = watchlist.filter((item) => item !== ticker);
    // console.log(watchlist)
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    const oldWatchList = watchListData;
    const newWatchList = oldWatchList.filter((item) => item.ticker !== ticker);
    setWatchListData(newWatchList);
    if (watchlist.length === 0) {
      setIsEmpty(true);
    }
  };

  return (
    <Fragment>
      <h1 className={classes.pageTitle}>My Watchlist</h1>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stack sx={{ width: "80%" }} spacing={2}>
          {isEmpty && (
            <Alert
              severity="warning"
              style={{ justifyContent: "center", alignSelf: "center" }}
            >
              Currently you do not have any stock in your watchlist
            </Alert>
          )}
          {!isEmpty &&
            watchListData.map((item) => (
              <Card key={item.id}>
                <Card.Body>
                  <div style={{ display: "flex", justifyContent: "right" }}>
                    <FaTimes onClick={() => removeFromWatchList(item.ticker)} />
                  </div>
                  <Container onClick={() => {
                    localStorage.setItem("cache", JSON.stringify(false))
                    navgate("/search/" + item.ticker)}}>
                    <Row>
                      <Col>
                        <h5>{item.ticker}</h5>
                      </Col>
                      <Col>
                        {item.d >= 0 && (
                          <h5 className={classes.stockPriceUp}>{item.c.toFixed(2)}</h5>
                        )}
                        {item.d < 0 && (
                          <h5 className={classes.stockPriceDown}>{item.c.toFixed(2)}</h5>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>{item.companyName}</p>
                      </Col>
                      <Col>
                        {item.d > 0 && (
                          <p className={classes.stockPriceUp}>
                            <BiSolidUpArrow style={{marginTop:"0.3rem"}}></BiSolidUpArrow>
                            {item.d.toFixed(2)} ({item.dp.toFixed(2)}%)
                          </p>
                        )}
                        {item.d < 0 && (
                          <p className={classes.stockPriceDown}>
                            <BiSolidDownArrow style={{marginTop:"0.3rem"}}></BiSolidDownArrow>
                            {item.d.toFixed(2)} ({item.dp.toFixed(2)}%)
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            ))}
        </Stack>
      </Box>
    </Fragment>
  );
};

export default Watchlist;
