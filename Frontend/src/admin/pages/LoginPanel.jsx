import React, { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "../context/AdminContext"

export default function LoginPanel() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm]                 = useState({ email: "", password: "" })
  const [error, setError]               = useState("")
  const [loading, setLoading]           = useState(false)

  const navigate = useNavigate()
  const { login } = useAdmin()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate("/admin")
    } else {
      setError(result.message || "Invalid credentials")
    }
  }

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: 52,
      borderRadius: "10px",
      color: "#fff",
      fontSize: 15,
      backgroundColor: "rgba(255,255,255,0.04)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset": { borderColor: "#f9004d" },
      "&.Mui-focused fieldset": { borderColor: "#f9004d", borderWidth: 2 },
    },
    "& .MuiInputBase-input": { color: "#fff", px: 2 },
    "& .MuiInputLabel-root": { display: "none" },
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >


      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, #f9004d55, transparent 70%)",
          filter: "blur(120px)",
          top: "-100px",
          left: "-100px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #c4102055, transparent 70%)",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
        }}
      />



      {/* Glass Card */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: 420,
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >


        {/* Title */}
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 1, fontWeight: "bold", color: "#fff" }}
        >
          Admin Login
        </Typography>
        <Typography
          align="center"
          sx={{ mb: 4, fontSize: 13, color: "rgba(255,255,255,0.35)" }}
        >
          Enter your credentials to continue
        </Typography>



        {/* Error */}
        {error && (
          <Box
            sx={{
              mb: 3,
              px: 2,
              py: 1.5,
              borderRadius: "10px",
              background: "rgba(249,0,77,0.1)",
              border: "1px solid rgba(249,0,77,0.3)",
            }}
          >
            <Typography sx={{ color: "#ff4d6d", textAlign: "center", fontSize: 13 }}>
              {error}
            </Typography>
          </Box>
        )}



        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Email Field */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
              inputProps={{ style: { color: "#fff" } }}
            />
          </Box>



          {/* Password Field */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
              inputProps={{ style: { color: "#fff" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#f9004d" } }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>



          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.6,
              fontWeight: "bold",
              fontSize: 15,
              borderRadius: "10px",
              background: "linear-gradient(90deg, #f9004d, #ff2e63)",
              boxShadow: "0 8px 25px rgba(249,0,77,0.4)",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #c41020, #f9004d)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(249,0,77,0.5)",
              },
              "&:disabled": {
                background: "rgba(249,0,77,0.3)",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </Box>
      </Paper>
    </Box>
  )
}