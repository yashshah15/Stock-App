import classes from "./searchbar.module.css";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import { useState, useEffect, useCallback, Fragment } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import ErrorAlert from "../alerts/ErrorAlert";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {
  const navigate = useNavigate()
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    const response = await fetch(
      "https://us-central1-stock-backend-fb68e.cloudfunctions.net/app/autocomplete-text?queryString=" + inputValue
    );
    const data = await response.json();
    // console.log(data);
    let filteredNames = data.result.map((item) => ({
      label: item.symbol + " | " + item.description,
      value: item.symbol,
    }));
    // console.log(filteredNames);
    if (filteredNames.length > 0) {
      setOptions(filteredNames);
    }
  }, [inputValue]);

  useEffect(() => {
    console.log(inputValue);
    if (inputValue.length === 0) {
      setOptions(value ? [value] : []);
      return undefined;
    } else {
      fetchRecommendations();
    }
  }, [fetchRecommendations, inputValue, value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.length === 0) {
      setError("The ticker field cannot be empty");
      return;
    }
    console.log(inputValue);
    props.onSubmitText(inputValue);
    // console.log(queryText);
  };

  const clearError = () => {
    setError(null)
  };

  const clearForm = () =>{
    setInputValue("")
    setValue("")
    navigate("/")
  }

  return (
    <form className={classes.formContent} onSubmit={handleSubmit}>
      <div className={classes["search-pill"]}>
        {/* <input
          type="text"
          className={classes["search-input"]}
          placeholder="Enter Stock Ticker Symbol"
        /> */}

        {/* <Autocomplete
          className={classes["search-input"]}
          freeSolo
          placeholder="Enter Stock Ticker Symbol"
          options={top100Films.map((option) => option.title)}
          renderInput={(params) => <TextField {...params}  />}
        /> */}
        <Autocomplete
          sx={{
            display: "flex",

            "& input": {
              border: "none",
              marginLeft: "0.25rem !important",
              backgroundColor: "transparent",
              outline: "none",
              fontSize: "14px",
              padding: "5px",
              marginRight: "5px",
              width: "240px",
            },
          }}
          autoComplete
          filterSelectedOptions
          value={value}
          filterOptions={(x) => x}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          id="custom-input-demo"
          options={options}
          noOptionsText="Enter valid stock ticker"
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            // console.log(newValue);
            setValue(newValue ? newValue.value : "");
            if(newValue){
              navigate("/search/" + newValue.value)
            }
          }}
          onInputChange={(event, newInputValue) => {
            console.log(newInputValue);
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <Fragment>
              <div ref={params.InputProps.ref}>
                <input
                  type="text"
                  placeholder="Enter Stock Ticker Symbol"
                  {...params.inputProps}
                />
              </div>
              <RiSearchLine
                className={classes["search-icon"]}
                onClick={handleSubmit}
              />
              <RiCloseLine className={classes["clear-icon"]} onClick={clearForm}/>
              
            </Fragment>
          )}

        />
        
      </div>
      {error && <ErrorAlert message={error} clearError={clearError}></ErrorAlert>}
    </form>
  );
};

export default SearchBar;
