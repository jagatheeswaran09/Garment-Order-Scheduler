import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, } from 'react-router-dom';
import CustomRoutes from "./router/routes";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <CustomRoutes />
      </Router>
    </LocalizationProvider>
  );
}

export default App;
