import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Portfolio from "./pages/portfolio";
import Watchlist from "./pages/watchlist";
import RootLayout from "./pages/RootLayout";
import DetailsPage from "./components/Details/Detailspage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        path: "",
        element: <Home></Home>,
        children: [
          { path: "search/:ticker", element: <DetailsPage></DetailsPage> },
        ],
      },
      { path: "portfolio", element: <Portfolio></Portfolio> },
      { path: "watchlist", element: <Watchlist></Watchlist> },
      { path: "search", element: <Navigate to="/"/> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
