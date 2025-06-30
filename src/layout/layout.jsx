import {
  Box,
  CssBaseline,
} from '@mui/material';

import Sidebar from './siderbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ user, children }) => {
  console.log("children", children)

  return (
    <Box sx={{ display: 'flex', width: "100%", height: "100%" }} >
      <CssBaseline />
      <Sidebar />
      <div style={{ width: "calc(100vw - 250px)", position: "relative", height: "100%" }} >
        <Outlet />
      </div>
    </Box>
  );
};

export default AdminLayout;