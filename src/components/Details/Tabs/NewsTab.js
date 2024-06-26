import { useContext, useState } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import classes from "./NewsTab.module.css";
import StockData from "../../../store/stock-context";
import Modal from "react-bootstrap/Modal";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";

const NewsTab = () => {
  const handleClose = () => {
    setSelectedItem(null);
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleNewsItemClick = (item) => {
    const date = new Date(item.datetime * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    item.date = date.toLocaleDateString("en-US", options);
    setSelectedItem(item);
    console.log(item);
  };

  const stockCtx = useContext(StockData);
  const newsData = stockCtx.newsData;
  const chunks = [];
  for (let i = 0; i < newsData.length; i += 2) {
    chunks.push(newsData.slice(i, i + 2));
  }

  return (
    <Container>
      {chunks.map((chunk, index) => (
        <Row className={classes.newsRow} key={index}>
          {chunk.map((item, itemIndex) => (
            <Col key={itemIndex}>
              <Card onClick={() => handleNewsItemClick(item)}>
                <Card.Body className={classes.cardBody}>
                  <Row>
                    <Col xs={3}>
                      <Card.Img
                        src={item.image}
                        className={classes.newsImage}
                      />
                    </Col>
                    <Col
                      xs={9}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div className={classes.textContainer}>
                        <Card.Text className={classes.leftJustify}>
                          {item.headline}
                        </Card.Text>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ))}

      {selectedItem && (
        <Modal show={selectedItem !== null} onHide={handleClose}>
          <Modal.Header closeButton>
            <div className="modal-header-content">
              <h4 className="modal-title">{selectedItem.source}</h4>
              <p className={classes.modalSubtitle}>{selectedItem.date}</p>
            </div>
          </Modal.Header>
          <Modal.Body>
            <h6>{selectedItem.headline}</h6>
            <p style={{ fontSize: "0.9rem" }}>{selectedItem.summary}</p>
            <p style={{ fontSize: "0.9rem" }}>
              For more details click <a href={selectedItem.url}>here: </a>
            </p>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "flex-start" }}>
            <p>Share:</p>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${selectedItem.url}`}
              rel="noreferrer"
              target="_blank"
            >
              <AiFillFacebook className={classes.facebookIcon}></AiFillFacebook>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${selectedItem.headline}%10${selectedItem.url}`}
              rel="noreferrer"
              target="_blank"
            >
              <AiOutlineTwitter
                className={classes.twitterIcon}
              ></AiOutlineTwitter>
            </a>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default NewsTab;
