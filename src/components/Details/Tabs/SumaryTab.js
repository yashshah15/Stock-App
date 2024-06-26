import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import classes from "./SummaryTab.module.css";
import { Link } from "react-router-dom";
import StockChart from "../Charts/hourlychart";
import StockData from "../../../store/stock-context";

const SummaryTab = () => {
  const stockCtx = useContext(StockData);
  const companyData = stockCtx.companyDetails;
  const priceData = stockCtx.stockPrices;
  const peers = stockCtx.companyPeers;
  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className={classes.colContainer} md="auto">
              <p className={classes.paragraphContainer}>
                <span className={classes.staticContent}> High Price:</span>
                <span className={classes.dynamicContent}>{priceData.h}</span>
              </p>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticContent}>Low Price:</span>
                <span className={classes.dynamicContent}>{priceData.l}</span>
              </p>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticContent}>Open Price:</span>
                <span className={classes.dynamicContent}>{priceData.o}</span>
              </p>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticContent}>Prev Close:</span>
                <span className={classes.dynamicContent}>{priceData.pc}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col
              style={{
                justifyContent: "center",
                display: "flex",
                marginTop: "1.5rem",
              }}
            >
              <p>
                <u>About the Company</u>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticAbout}> IPO start date:</span>
                <span className={classes.dynamicAbout}>{companyData.ipo}</span>
              </p>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticAbout}> Industry:</span>
                <span className={classes.dynamicAbout}>
                  {companyData.finnhubIndustry}
                </span>
              </p>
              <p className={classes.paragraphContainer}>
                <span className={classes.staticAbout}> WebPage:</span>
                <a
                  href={`${companyData.weburl}`}
                  rel="noreferrer"
                  target="_blank"
                  className={classes.dynamicAbout}
                >
                  {companyData.weburl}
                </a>
              </p>
              <p className={classes.staticAbout}>
                <span className={classes.staticAbout}> Company Peers:</span>
              </p>
              <p>
                {peers.map((peer) => (
                  <Link
                    className={classes.dynamicAbout}
                    style={{ fontWeight: "700" }}
                    to={`/search/${peer}`}
                  >
                    {peer},
                  </Link>
                ))}
              </p>
            </Col>
          </Row>
        </Col>
        <Col>
          <StockChart />
        </Col>
      </Row>
    </Container>
  );
};

export default SummaryTab;
