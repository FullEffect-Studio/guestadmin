import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import FaceIcon from "@mui/icons-material/Face";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomLoadingButton from "../Utils/CustomLoadingButton";

const Login = () => {
  const isSmallDevice = useMediaQuery("(max-width:1000px)");
  const [pwdVisible, setPwdVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [pwd, setPwd] = useState<string>("")
  const [loginData, setLoginData] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false) 
  const [isError, setIsError] = useState<boolean>(false) 
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const handleSubmit = async (event:any) => {
    event.preventDefault(); 
    try{
      setIsLoading(true)
      const {data} = await axios.post("https://guestmanagerapi.onrender.com/user/signin/", {email:email, password:pwd});
      setLoginData(data)
      localStorage.setItem("access_token", data.tokens.access_token)
      localStorage.setItem("username", data.username)
      localStorage.setItem("logged_in_user_id", data.user_id)
      setIsLoading(false)
      navigate("/cms")
      toast.success("Login successfull", {position:"top-right"})
    }catch(error: any){
      setLoginData(false)
      setIsError(true)
      setError(error["message"])
      toast.error("Wrong email or password")
      console.log("loginerror =", error["message"], typeof error)
      setIsLoading(false)
    }
  }
  return (
    <Box
      sx={{
        minWidth: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: "white",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box sx={{ width: isSmallDevice ? "" : "50%", }}>
        <img src="/images/loginSide.webp" className=" hidden lg:block" />
      </Box>
      <Box
        sx={{
          width: isSmallDevice ? "100%" : "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ height: "80%", width: "80%", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center" }}>
          <Typography
            component={"h1"}
            sx={{ fontSize: "25px", fontWeight: "800" }}
          >
            {"Welcome to GuestAdmin"}
          </Typography>
          <form onSubmit={handleSubmit} style={{width:"90%", height:"90%", display:"flex", flexDirection:"column", gap:"1.5rem"}}>
            <Typography sx={{ fontSize: "23px" }}>{"Sign In"}</Typography>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <FaceIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField label="Password" type={!pwdVisible ?"password":"text"} 
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={()=>setPwdVisible(!pwdVisible)}>
                          {!pwdVisible ?<VisibilityOffIcon />: <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}

            />
            <Typography className=" text-right text-blue-600 hover:text-blue-700 cursor-pointer" component={"a"}>{"Forgot Password"}</Typography>
            {email === "" && pwd === "" ?<CustomLoadingButton isLoading={isLoading} color="primary" variant="contained" sx={{padding:"5px 0 5px 0"}}>Login</CustomLoadingButton >:<CustomLoadingButton isLoading={isLoading} sx={{padding:"5px 0 5px 0"}} type="submit" variant="contained">Login</CustomLoadingButton>}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
