import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useMediaQuery } from '@mui/material'
import React, { ChangeEvent, FormEvent } from 'react'
import CustomLoadingButton from '../Utils/CustomLoadingButton'
import axios from 'axios'
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom'

const AddGuest = () => {
    const intitalState = {
        first_name: "",
        last_name: "",
        gender: "",
        mobile: "",
        emergency_name:"",
        emergency_tel:"",
        added_by: localStorage.getItem("logged_in_user_id"),
    }
    const isSmallDevice = useMediaQuery("(max-width:1023px)")
    const [formData, setFormData] = React.useState(intitalState)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const handleFormDataChange = (event:ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target;
        setFormData({...formData, [name]: value})
    }
    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try{
            setIsLoading(true)
            const {data} = await axios.post("https://guestmanagerapi.onrender.com/api/guests/", formData, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
            console.log("Saved =", data)
            setIsLoading(false)
            toast.success("Guest Saved!!")
            setFormData(intitalState)
        }catch(error){
            setIsLoading(false)
            toast.error("Error saving data")
        }
    }

    const navigate = useNavigate()
  return (
    <Box sx={{width: isSmallDevice ? "100%" : "60%", height:"90%", margin:"3rem auto",backgroundColor:"white"}}>
        <h2 className='text-2xl font-extrabold text-center'>Add New Guest</h2>
        <form onSubmit={handleFormSubmit} className='ml-3 pb-6 mt-4 w-[90%] h-full flex flex-col gap-7'>
            <TextField label="First Name" name='first_name' value={formData.first_name} onChange={handleFormDataChange} />
            <TextField label = "Last Name" name='last_name' value={formData.last_name} onChange={handleFormDataChange} />
            <FormControl>
          <InputLabel id="gender-type-label">Gender Type</InputLabel>
          <Select
            labelId="gender-type-label"
            id="gender-type-select"
            label="Gender Type"
            name="room_type"
            value={formData.gender}
            onChange={(event: SelectChangeEvent)=>setFormData({...formData, gender: event.target.value})}    
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
            <TextField label="Mobile Number" name='mobile' value={formData.mobile} onChange={handleFormDataChange} />
            <Divider />
              <h2 className='font-bold'>Emergency Contact</h2>
              <TextField name='emergency_name' label="Name" value={formData.emergency_name} onChange={handleFormDataChange} />
              <TextField name='emergency_tel' type='tel' label="Mobile" value={formData.emergency_tel} onChange={handleFormDataChange} />
            <CustomLoadingButton type='submit' isLoading={isLoading} variant='contained' className=' w-full' >Add Guest</CustomLoadingButton>
            <Button  variant='contained' className=' w-full' onClick={()=> navigate("/cms/guests")} >View All Guests</Button>
        </form>
    </Box>
  )
}

export default AddGuest