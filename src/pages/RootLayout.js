import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
// import SearchBar from "../components/searchbar/searchbar";
// import classes from "./root.module.css"
const RootLayout = () => {
  
  return (
    <Fragment>
      <NavBar />
      
      {/* <SearchBar onSubmitText = {handleQuery}></SearchBar> */}
      <Outlet></Outlet>
    </Fragment>
  );
};

export default RootLayout;
