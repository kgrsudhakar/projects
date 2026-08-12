// import { Box, Toolbar } from "@mui/material";
// import { Outlet } from "react-router-dom";
// import Header from "../components/layout/Header";
// import Sidebar from "../components/layout/Sidebar";

// export default function DashboardLayout() {
//   return (
//     <Box sx={{ display: "flex" }}>
//       <Header />
//       <Sidebar />

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: "100%",
//         }}
//       >
//         {/* Push content below the AppBar */}
//         <Toolbar />

//         <Outlet />
//       </Box>
//     </Box>
//   );
// }


import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}