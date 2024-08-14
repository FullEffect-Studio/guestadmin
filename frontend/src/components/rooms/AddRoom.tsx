import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, ChangeEvent, FormEvent } from "react";
import CustomLoadingButton from "../Utils/CustomLoadingButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"

export const AddRoom = () => {
  const isSmallDevice = useMediaQuery("(max-width:1023px)");
  const initialState = {
    room_number: "",
    room_type: "",
    price_per_night: "",
    room_status: "",
    description:""
  }
  const [formData, setFormData] = useState(initialState)
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    setFormData({...formData, [name]: value})
  }

  const handleSelectChange = (event:SelectChangeEvent) =>{
    const {name, value} = event.target;
    setFormData({...formData, [name]:value})
  }

  const handleFormSubmit = async (event:FormEvent | any) => {
    event.preventDefault();
    try{
      setIsLoading(true)
      const {data} = await axios.post("https://guestmanagerapi.onrender.com/api/rooms/", formData, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      setIsLoading(false)
      setFormData(initialState)
      toast.success("Room Saved")
    }catch(error){
      setIsLoading(false)
      toast.error("Room already exists.")
    }

  }
  return (
    <form onSubmit={handleFormSubmit} style={{ height: "100%", overflow: "hidden" }}>
      <Typography
        component={"h1"}
        sx={{ fontSize: "2rem", textAlign: "center", marginBottom: ".5rem" }}
      >
        Add New Room
      </Typography>
      <Box
        sx={{
          width: "80%",
          margin:"auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
          backgroundColor: "white",
        }}
      >
        <TextField label="Room Number" name="room_number" value={formData.room_number} onChange={handleChange} />
        <FormControl>
          <InputLabel id="room-type-label">Room Type</InputLabel>
          <Select
            labelId="room-type-label"
            id="room-type-select"
            label="Room Type"
            value={formData.room_type}
            name="room_type"
            onChange={handleSelectChange}
            
          >
            <MenuItem value="Double-sized">Double-sized</MenuItem>
            <MenuItem value="Queen-sized">Queen-sized</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Price per night" name="price_per_night" value={formData.price_per_night} onChange={handleChange} />
        <FormControl>
          <InputLabel id="room-status-label">Room Status</InputLabel>
          <Select
            labelId="room-status-label"
            id="room-status-select"
            label="Room Status"
            value={formData.room_status}
            name="room_status"
            onChange={handleSelectChange}
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Maintenance">Under Maintenance</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-multiline-static"
          label="Descrption"
          multiline
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <CustomLoadingButton isLoading={isLoading} variant="contained" type="submit">
          Add Room
        </CustomLoadingButton>
      </Box>
    </form>
  );
};
