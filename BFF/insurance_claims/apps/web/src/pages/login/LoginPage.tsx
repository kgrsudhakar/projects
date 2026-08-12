import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "../../features/auth/loginSchema";
import { loginApi } from "../../api/auth.api";
import { loginSuccess } from "../../features/auth/authSlice";

import type { LoginRequest } from "../../types/auth";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await loginApi(data);

      dispatch(
        loginSuccess({
          token: response.data.accessToken,
          user: response.data.user,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: 420,
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          Insurance Claims Management
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              type="password"
              label="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginPage;