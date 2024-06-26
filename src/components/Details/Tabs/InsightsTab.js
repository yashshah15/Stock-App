import { useContext } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import classes from "./InsightsTab.module.css"
import RecommendationTrendsChart from "../Charts/RecommendationTrendsChart";
import EPSChart from "../Charts/EPSChart";
import StockData from "../../../store/stock-context";

const InsightsTab = () => {

  const stockCtx = useContext(StockData)
  const socialMediaSentiments = stockCtx.socialMedia
  const companyName = stockCtx.companyDetails.name

  return (
    <Container>
      <Row >
        <Col style={{display:"flex"}} className="justify-content-center">
          <Table bordered style={{ width: '50%' }}>
            <thead>
              <tr>
                <th className={classes.grayContent}>
                  {companyName}
                </th>
                <th className={classes.grayContent}>
                  Reddit
                </th>
                <th className={classes.grayContent}>
                  Twitter
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={classes.grayContent}>
                  Total Mentions
                </th>
                <td className={classes.dynamicContent}>{socialMediaSentiments.redit_mentions}</td>
                <td className={classes.dynamicContent}>{socialMediaSentiments.twitter_mentions}</td>
                
              </tr>
              <tr>
                <th className={classes.grayContent}>
                  Positive Mentions
                </th>
                <td className={classes.dynamicContent}>{socialMediaSentiments.reddit_p_mentions}</td>
                <td className={classes.dynamicContent}>{socialMediaSentiments.twitter_p_mentions}</td>
                
              </tr>
              <tr>
                <th className={classes.grayContent}>
                  Negative Mentions
                </th>
                <td className={classes.dynamicContent}>{socialMediaSentiments.reddit_n_mentions}</td>
                <td className={classes.dynamicContent}>{socialMediaSentiments.twitter_n_mentions}</td>
                
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col> <RecommendationTrendsChart></RecommendationTrendsChart> </Col>
        <Col> <EPSChart></EPSChart> </Col>
      </Row>
    </Container>
  );
};

export default InsightsTab;
