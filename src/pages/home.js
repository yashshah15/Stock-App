import { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classes from "./home.module.css";
import SearchBar from "../components/searchbar/searchbar";
import ErrorAlert from "../components/alerts/ErrorAlert";
// import DetailsPage from "../components/Details/Detailspage";

const Home = () => {
  useEffect(() => {
    localStorage.setItem("cache", JSON.stringify(false));
  });
  const [error, setError] = useState();

  const navigate = useNavigate();
  const handleQuery = async (stockTicker) => {
    console.log(stockTicker);
    localStorage.setItem("cache", JSON.stringify(false));
    const response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/get-company-description?symbol=" + stockTicker
    );
    const companyDetails = await response.json();
    if (JSON.stringify(companyDetails) === "{}") {
      setError("Enter Valid Stock Ticker Symbol");

      return;
    }
    navigate("search/" + stockTicker);
  };

  const wallet = JSON.parse(localStorage.getItem("wallet")) || 0;
  if (wallet === 0) {
    localStorage.setItem("wallet", JSON.stringify(25000));
  }

  const clearError = () => setError(null);

  return (
    <Fragment>
      <h4 className={classes.appName}>STOCK SEARCH</h4>
      <SearchBar onSubmitText={handleQuery} />
      {/* <DetailsPage></DetailsPage> */}
      {error && (
        <ErrorAlert message={error} clearError={clearError}></ErrorAlert>
      )}
      <Outlet></Outlet>
    </Fragment>
  );
};

export default Home;
