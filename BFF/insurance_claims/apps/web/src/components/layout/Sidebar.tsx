// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
// } from "@mui/material";

// import { Link, useLocation } from "react-router-dom";

// import { menuItems } from "./MenuItems";

// const drawerWidth = 240;

// export default function Sidebar() {
//   const location = useLocation();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//         },
//       }}
//     >
//       <Toolbar />

//       <List>
//         {menuItems.map((item) => (
//           <ListItemButton
//             key={item.title}
//             component={Link}
//             to={item.path}
//             selected={location.pathname === item.path}
//           >
//             <ListItemIcon>
//               <item.icon />
//             </ListItemIcon>

//             <ListItemText primary={item.title} />
//           </ListItemButton>
//         ))}
//       </List>
//     </Drawer>
//   );
// }


import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PolicyIcon from "@mui/icons-material/Description";
import ClaimIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { NavLink } from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Policies",
    path: "/policies",
    icon: <PolicyIcon />,
  },
  {
    label: "Claims",
    path: "/claims",
    icon: <ClaimIcon />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <PeopleIcon />,
  },
  {
    label: "Adjusters",
    path: "/adjusters",
    icon: <ManageAccountsIcon />,
  },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        display: {
          xs: "none",
          md: "block",
        },

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        },
      }}
    >
      <Toolbar>
        <Typography
          sx={{variant:"h6",
          fontWeight:700,
          
            color: "primary.main",
          }}
        >
          Insurance
        </Typography>
      </Toolbar>

      <Box sx={{ px: 1.5 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,

                "&.active": {
                  bgcolor: "primary.main",
                  color: "white",

                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}