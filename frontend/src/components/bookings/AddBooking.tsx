import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { IconPlus } from '@tabler/icons-react';
import { Autocomplete, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from  "dayjs"
import CustomLoadingButton from '../Utils/CustomLoadingButton';
import { useNavigate } from 'react-router-dom';
import { APIContext } from '../../Contexts';

export default function AddBooking() {

  // State Management 
  const [activeStep, setActiveStep] = React.useState(0);
  const [] = React.useState<string>()

  // Transition
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // Step components definition
  

  interface GuestDataTypes{
    first_name: string;
    last_name: string;
    gender: string;
    mobile: string;
    email: string;
    town_from: string;
  }
  
  type Guest = {
    id: number;
    full_name: string;
    is_booked: boolean;
  };
  
  const SearchForClient: React.FC = () => {
    const isSmallDeviceScreen = useMediaQuery("(max-width:1023px)");
    const [prefetchedClientList, setPrefetchedClientList] = React.useState<Guest[]>([]);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [selectedValue, setSelectedValue] = React.useState<Guest | null>(null);
    const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
  
    React.useEffect(() => {
      const findingGuest = async () => {
        try {
          setIsLoadingData(true);
          const { data } = await axios.get("https://guestmanagerapi.onrender.com/api/guests/", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            params: {
              query: inputValue
            }
          });
          const guestList = data.map((guest:any) => ({
            id: guest.id,
            full_name: `${guest.first_name} ${guest.last_name}`,
            is_booked: guest.is_booked
          }));
          console.log("guest list:", guestList); // Check the structure
          setPrefetchedClientList(guestList);
          setIsLoadingData(false);
        } catch (error) {
          setIsLoadingData(false);
          console.error("Error occurred:", error);
        }
      };
  
      if (inputValue) {
        findingGuest();
      } else {
        setPrefetchedClientList([]);
      }
    }, [inputValue]);
  
    const handleChange = (_: React.SyntheticEvent, newValue: Guest | null) => {
      console.log("Selected guest:", newValue); // Debugging
      localStorage.setItem("selected_guest_id", `${newValue?.id}`)
      setSelectedValue(newValue);
    };
  
    React.useEffect(() => {
      console.log("Selected value:", selectedValue); // Debugging
    }, [selectedValue]);
  
    return (
      <Box sx={{ display: "flex", flexDirection: isSmallDeviceScreen ? "column" : "row", width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <Autocomplete
            loading={isLoadingData}
            value={selectedValue}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            options={prefetchedClientList}
            getOptionDisabled={(option)=> option.is_booked === true}
            getOptionLabel={(option) => option.full_name}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Find Guest"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingData ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
      </Box>
    );
  };
  interface Room {
    id: string;
    room_number: string;
    price_per_night: string | number;
    room_status: string;
  }
  
  const SearchRoom: React.FC = () => {
    const isSmallDeviceScreen = useMediaQuery("(max-width:1023px)");
    const [inputRoomValue, setInputRoomValue] = React.useState<string>("");
    const [selectedRoomValue, setSelectedRoomValue] = React.useState<Room | null>(null);
    const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
    const [roomData, setRoomData] = React.useState<Room[]>([]);
    const context = React.useContext(APIContext)
    if(!context){
      throw new Error("")
    }
    const { setPaymentDetails, paymentDetails } = context


    React.useEffect(() => {
      const findingRoom = async () => {
        try {
          setIsLoadingData(true);
          const { data } = await axios.get("https://guestmanagerapi.onrender.com/api/rooms/", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            params: {
              query: inputRoomValue
            }
          });
          const roomList = data.map((room:any) => ({
            id: room.id,
            room_number: `Room Number ${room.room_number}`,
            price_per_night: room.price_per_night,
            room_status: room.room_status
          }));
          console.log("room list:", roomList); // Check the structure
          setRoomData(roomList);
          setIsLoadingData(false);
        } catch (error) {
          setIsLoadingData(false);
          console.error("Error occurred:", error);
        }
      };
  
      if (inputRoomValue) {
        findingRoom();
      } else {
        setRoomData([]);
      }
    }, [inputRoomValue]);
  
    const handleChange = (_: React.SyntheticEvent, newValue: Room | null) => {
      console.log("Selected guest:", newValue); // Debugging
      localStorage.setItem("selected_room_id", `${newValue?.id}`);
      localStorage.setItem("selected_room_price", `${newValue?.price_per_night}`);
      setSelectedRoomValue(newValue);
    };
  
    React.useEffect(() => {
      console.log("Selected value:", selectedRoomValue); // Debugging
    }, [selectedRoomValue]);
  
  
    React.useEffect(() => {
      const fetchRoomData = async () => {
        if (!inputRoomValue) return;
  
        try {
          setIsLoadingData(true);
          const { data } = await axios.get("https://guestmanagerapi.onrender.com/api/rooms/", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            params: {
              query: inputRoomValue
            }
          });
          const roomList: Room[] = data.map((room: any) => ({
            id: room.id,
            room_number: `Room Number ${room.room_number}`,
            price_per_night: room.price_per_night,
            room_status: room.room_status
          }));
          setRoomData(roomList);
          setIsLoadingData(false);
        } catch (error) {
          console.error('Error fetching room data:', error);
          setIsLoadingData(false);
        }
      };
  
      fetchRoomData();
    }, [inputRoomValue]);
  
    return (
      <Box sx={{ display: "flex", flexDirection: isSmallDeviceScreen ? "column" : "row", width: "100%" }}>
        <Box sx={isSmallDeviceScreen ? { width: "100%", flex: 3, position: "relative" } : { width: "100%", flex: 3, flexDirection: "row" }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Autocomplete
              loading={isLoadingData}
              value={selectedRoomValue}
              noOptionsText="Type 'Room Number'"
              onChange={handleChange}
              inputValue={inputRoomValue}
              onInputChange={(_, newInputValue) => setInputRoomValue(newInputValue)}
              disablePortal
              id="combo-box-demo"
              options={roomData}
              getOptionDisabled={(option) => option.room_status === "Occupied"}
              getOptionLabel={(option) => option.room_number}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Find Room"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingData ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
          {/* Adjust IconPlus based on your actual icon component and import */}
          {/* <IconPlus onClick={handleClickOpen} color='green' className='font-extrabold cursor-pointer' style={{ flex: 0.5 }} /> */}
        </Box>
      </Box>
    );
  };
  
  const BookRoom = () => {
    const initialState = {
    guest: 0,
    room: 0,
    checkin: new Date(),
    checkout: new Date(),
    amount: 0,
    bookingStatus: "",
    description: ""
    }
    const [amountToPay, setAmountToPay] = React.useState<number>()
    const [formData, setFormData] = React.useState(initialState)
    const [bookingPeriod, setBookingPeriod] =React.useState<any>()

    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof typeof initialState) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value
      }));
    };
    // Function to calculate amount to pay
    
    const calculateAmountToPay = () => {
      const checkinDate = new Date(formData.checkin);
      const checkoutDate = new Date(formData.checkout);

      const differenceInMilliseconds = checkoutDate.getTime() - checkinDate.getTime();
      const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 3600 * 24));
      const roomPrice = formData.amount;

      const amount = differenceInDays * roomPrice;
      console.log("period in days=",differenceInDays)
      console.log("room price=",roomPrice)

      setAmountToPay(amount);
      localStorage.setItem('amount_payable', `${amount}`)
  };

  React.useEffect(() => {
    const storedRoomPrice = localStorage.getItem("selected_room_price");
    if (storedRoomPrice) {
      const roomPrice = parseFloat(storedRoomPrice);
      setFormData(prevFormData => ({
          ...prevFormData,
          amount: roomPrice
      }));

      console.log("the room price", formData.amount)
  }

  }, []);

  React.useEffect(() => {
    calculateAmountToPay();
}, [formData.checkin, formData.checkout]);

const handleStatusChange = (event: SelectChangeEvent<string>) => {
  const { value } = event.target;
  setFormData(prevFormData => ({
      ...prevFormData,
      bookingStatus: value
  }));
};

const [isDataLoading, setIsDataLoading] = React.useState<boolean>(false)

const [formDataSaved, setFormDataSaved] = React.useState<boolean>(false)

const context = React.useContext(APIContext)
if(!context){
  throw new Error("An error occured!")
}

const {paymentDetails} = context

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      setIsDataLoading(true)
      const {data} = await axios.post("https://guestmanagerapi.onrender.com/api/bookings/main/", {guest: localStorage.getItem("selected_guest_id"), room:localStorage.getItem("selected_room_id"), total_amount:localStorage.getItem("amount_payable"), booked_by: localStorage.getItem("logged_in_user_id"),booking_status: formData.bookingStatus, date_checked_in: formData.checkin, date_checked_out:formData.checkout}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      setIsDataLoading(false)
      toast.success("Booking saved!", {position:"bottom-center"})
      setFormDataSaved(true)
      try{
        await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${localStorage.getItem("selected_guest_id")}/`, {is_booked: true}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}});
        await axios.patch(`https://guestmanagerapi.onrender.com/api/rooms/edit/${localStorage.getItem("selected_room_id")}/`, {room_status: "Occupied"}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`},})
      }catch(error){
        console.log("tryyyy err =", error)
        console.log("selected room id=",localStorage.getItem("selected_room_id"))
      }
    }catch(error){
      setIsDataLoading(false)
      toast.error("Error saving!", {position:"bottom-center"})
    }
  }

  
    return (
      <Box sx={{}}>
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <TextField label="Guest" value={localStorage.getItem("selected_guest")} sx={{display:"none"}} disabled />
                <TextField label="Room" value={localStorage.getItem("selected_room_id")} sx={{display:"none"}} disabled />
                <TextField type='date' value={formData.checkin} onChange={(e) => handleDateChange(e, 'checkin')} InputLabelProps={{shrink:true}} label="Check In Date" />
                <TextField type='date' value={formData.checkout} onChange={(e) => handleDateChange(e, 'checkout')} InputLabelProps={{shrink:true}} label="Check Out Date" />
                <TextField label="Amount to pay" type='number' InputLabelProps={{shrink:true}} value={amountToPay} disabled  />
                <FormControl>
                  <InputLabel id="booking-status-label">Booking Status</InputLabel>
                  <Select
                    labelId="booking-status-label"
                    id="booking-status-select"
                    value={formData.bookingStatus}
                    onChange={handleStatusChange}
                    label="Booking Status"
                  >
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Checked Out">Checked Out</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  id="outlined-multiline-static"
                  label="Descrption"
                  multiline
                  rows={4}
                  defaultValue="No description"
                  onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>localStorage.setItem("description", e.target.value)}
                />
                <CustomLoadingButton isLoading={isDataLoading} type='submit' variant='contained'>Save Booking</CustomLoadingButton>            
          </form>
      </Box>
    )
  }

  // Steps setup
  
  const steps = [
    {
      label: 'Add A Guest',
      component: <SearchForClient />
    },
    {
      label: 'Find a room',
      component: <SearchRoom />,
    },
    {
      label: 'Book the room',
      component: <BookRoom />
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep:any) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleReset = () => {
    setActiveStep(0);
  };

  const navigate = useNavigate()
  const isSmallScreen = useMediaQuery("(max-width: 1023px)")
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", overflowY:"scroll",backgroundColor: "white", marginTop:"1rem" }}>
      <h1 className=' font-bold text-2xl pt-7 mb-3 text-center'>Add New Booking</h1>
      <Box sx={{width:isSmallScreen ? "94%": "50%", margin:"auto", height:"100vh"}}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null}
              >
                {step.label}
              </StepLabel>
              <StepContent sx={{width:isSmallScreen?"100%":"100%"}}>
                {step.component}
                <Box sx={{ mb: 2, width:"100%" }}>
                  <Box sx={{display: 'flex', flexDirection:"column"}}>
                    <Button
                      variant="contained"
                      onClick={()=> index===steps.length - 1 ? navigate("/cms/bookings") : setActiveStep((prevActiveStep) => prevActiveStep + 1)}
                      sx={{ mt: 1, mr: 1, width:"100%" }}
                    >
                      {index === steps.length - 1 ? 'View All Bookings' : 'Continue'}
                    </Button>
                    <Button
                      variant='contained'
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1, width:"100%" }}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}
