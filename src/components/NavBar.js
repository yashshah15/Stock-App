import { useLocation, NavLink} from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  
  const location = useLocation();
  const isActive = location.pathname.includes("search");
  console.log(isActive);
  //const flag = JSON.parse(localStorage.getItem("cache"));
  const ticker =() => JSON.parse(localStorage.getItem("cacheTicker"));
  const getFlag = () => JSON.parse(localStorage.getItem("cache"));

  return (
    <Navbar
      sticky="top"
      bg="primary"
      data-bs-theme="dark"
      className="custom-navbar"
    >
      <Navbar.Brand as={Link} className="navbar-brand" to="/">
        Stock Search
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="justify-content-end" style={{ width: "100%" }}>
          <NavLink
            as={Link}
            
            to={getFlag ? "/search/" + ticker() : "/search"}
            className="nav-link"
          >
            Search
          </NavLink>
          <NavLink as={Link} to="/watchlist" className="nav-link">
            Watchlist
          </NavLink>
          <NavLink as={Link} to="/portfolio" className="nav-link">
            Portfolio
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    // <Navbar
    //   bg="primary"
    //   data-bs-theme="dark"
    //   sticky="top"

    // >
    //   <Container className="custom-container">
    //     <Navbar.Brand href="#home" className="ml-auto">
    //       Stock Search
    //     </Navbar.Brand>
    //     <Nav className="mr-auto">
    //       <Nav.Link href="#home">Search</Nav.Link>
    //       <Nav.Link href="#features">Watchlist</Nav.Link>
    //       <Nav.Link href="#pricing">Portfolio</Nav.Link>
    //     </Nav>
    //   </Container>
    // </Navbar>
  );
};

export default NavBar;
