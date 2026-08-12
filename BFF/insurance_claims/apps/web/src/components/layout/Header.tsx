// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
// } from "@mui/material";

// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../features/auth/authSlice";

// const drawerWidth = 240;

// export default function Header() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: `calc(100% - ${drawerWidth}px)`,
//         ml: `${drawerWidth}px`,
//       }}
//     >
//       <Toolbar>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           Insurance Claims Management
//         </Typography>

//         <Button color="inherit" onClick={handleLogout}>
//           Logout
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// }


import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "text.primary",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{variant:"h6",
          fontWeight:600
          }}
        >
          Insurance Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
            }}
          >
            S
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}