import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import SummaryTab from "./Tabs/SumaryTab";
import NewsTab from "./Tabs/NewsTab";
import ChartsTab from "./Tabs/ChartsTab";
import InsightsTab from "./Tabs/InsightsTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DetailsTabs = (props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}
        >
          <Tab label="Summary" {...a11yProps(0)} sx={{ flexGrow: 1 , textTransform: 'none' }}/>
          <Tab label="Top News" {...a11yProps(1)} sx={{ flexGrow: 1, textTransform: 'none'  }} />
          <Tab label="Charts" {...a11yProps(2)} sx={{ flexGrow: 1 , textTransform: 'none' }} />
          <Tab label="Insights" {...a11yProps(3)} sx={{ flexGrow: 1, textTransform: 'none'  }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SummaryTab></SummaryTab>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NewsTab></NewsTab>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChartsTab></ChartsTab>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InsightsTab></InsightsTab>
      </TabPanel>
    </Box>
  );
};

export default DetailsTabs;
