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
import { Autocomplete, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import axios from "axios"
import {PaystackButton} from "react-paystack"
import "../../App.css"
import {toast} from "react-toastify"
import { MuiEvent } from '@mui/x-data-grid';
import { APIContext } from '../../Contexts';
import CustomLoadingButton from '../Utils/CustomLoadingButton';
import { positions } from '@mui/system';
import { json } from 'stream/consumers';
import {FaCalculator} from "react-icons/fa"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const SearchForBooking = () => {
  const isSmallDeviceScreen = useMediaQuery("(max-width:1023px)");
  const [bookingList, setbookingList] = React.useState<[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{

  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: isSmallDeviceScreen ? "column" : "row", width: "100%" }}>
      <Box sx={isSmallDeviceScreen ? { width: "100%", flex: 3, position: "relative" } : { width: "100%", flex: 3, flexDirection: "row" }}>
          <Box sx={{display:"flex", flexDirection: isSmallDeviceScreen ? "column":"row", width:isSmallDeviceScreen ? "95%":"70%"}}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={bookingList}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Finding booking by Guest" />}
            />
          </Box>
        </Box>
    </Box>
  );
}



interface Guest {
  booking_id: number;
  full_name: string;
  email: string;
  mobile: string;
  guest_has_paid: boolean;
  guest_id: number;
  is_booked_guest: boolean;
}

const SearchForClient: React.FC = () => {
  const isSmallDeviceScreen = useMediaQuery("(max-width:1023px)");
  const [prefetchedClientList, setPrefetchedClientList] = React.useState<Guest[]>([]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [selectedValue, setSelectedValue] = React.useState<Guest | null>(null);
  const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false); 
  };

  React.useEffect(() => {
    const findingGuest = async () => {
      if (!inputValue) {
        setPrefetchedClientList([]);
        return;
      }

      try {
        setIsLoadingData(true);
        const { data } = await axios.get("https://guestmanagerapi.onrender.com/api/reports/bookings/no-filter/", { params: { query: inputValue }, headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`} });
        console.log("client list =", data);

        const bookingList: Guest[] = data.map((booking_item: any) => ({
          booking_id: booking_item.id,
          guest_id: booking_item.guest_id,
          full_name: booking_item.guest_name,
          email: booking_item.guest_email,
          mobile: booking_item.guest_mobile,
          guest_has_paid: booking_item.guest_has_paid,
          is_booked_guest: booking_item.is_booked_guest
        }));

        setPrefetchedClientList(bookingList);
        console.log("get list=", bookingList)
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    findingGuest();

  }, [inputValue]);

  const handleChange = (_: React.SyntheticEvent, newValue: Guest | null) => {
    setSelectedValue(newValue);
    if (newValue) {
      console.log('Selected Value:', newValue);
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        booking_id: newValue.booking_id,
        booked_guess_email: newValue.email,
        booked_guest_mobile: newValue.mobile,
        booked_guest_name: newValue.full_name,
        guest_id: newValue.guest_id
      }));
      localStorage.setItem("guest_id", JSON.stringify(newValue.guest_id))
      localStorage.setItem("booking_id", JSON.stringify(newValue.booking_id))

      console.log("payment details id =", paymentDetails.guest_id)
    }
    if(newValue?.guest_has_paid === true){
      toast.warn("Selected User has already made payment!")
      setSelectedValue(null)
    }
  };

  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("Error getting the context.");
  }

  const { paymentDetails, setPaymentDetails } = context;

  return (
    <Box sx={{ display: "flex", flexDirection: isSmallDeviceScreen ? "column" : "row", width: "100%" }}>
      <Box sx={isSmallDeviceScreen ? { width: "100%", flex: 3, position: "relative" } : { width: "100%", flex: 3, flexDirection: "row" }}>
        <Box sx={{ display: "flex", flexDirection: isSmallDeviceScreen ? "column" : "row", width: isSmallDeviceScreen ? "95%" : "70%" }}>
          <Autocomplete
            loading={isLoadingData}
            value={selectedValue}
            onChange={handleChange}
            getOptionDisabled={(option) => option.guest_has_paid === true || !option.is_booked_guest}
            inputValue={inputValue}
            autoHighlight
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            id="combo-box-demo"
            noOptionsText="No options found"
            options={prefetchedClientList}
            getOptionLabel={(option) => option.full_name}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Find Guest" 
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingData ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            />}
          />
        </Box>
      </Box>
    </Box>
  );
};


const PaymentSummary: React.FC = () => {
  const [saving, setSaving] = React.useState<boolean>(false)
  const [amountPayed, setAmountPayed] = React.useState<any>(null)

  const handleSavePayment = async (e: React.FormEvent) => {
    console.log("Clicked")
    e.preventDefault()
    try{
      setSaving(true)
      const {data} = await axios.post("https://guestmanagerapi.onrender.com/api/payment/create/", {payment_reference: paymentDetails.reference, amount: localStorage.getItem("total_amount_api"),initial_payment: paymentDetails.initialiPayment,account_by: localStorage.getItem("logged_in_user_id"), payment_method: paymentDetails.paymentMethod, payment_verified: paymentDetails.paymentIsVerified, payment_status: localStorage.getItem("payment_status_cash"), booking: paymentDetails.booking_id}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      const guest_id = localStorage.getItem("guest_id")
      const updateGuestInfo = async () => {
        try{
          const resp = localStorage.getItem("payment_status_cash")=== "Fully-Paid"? await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${guest_id}/`, {has_fully_paid: true}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}): await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${guest_id}/`, {has_fully_paid: false}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
          console.log("updated guest =", resp.data)
        }catch(error){
          console.error("updating guest error at add payment=", error)
        }
      }

      paymentDetails.guest_id === undefined ? alert("user info update error") : updateGuestInfo()
      setSaving(false)
      toast.success("Payment successfully completed")

    }catch(error){
      setSaving(false)
      toast.error("An error occured during payment")
    }
  }

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("Error occured")
  }

  const {paymentDetails} = context
  console.log("payment details =", paymentDetails)
  return (
            <form onSubmit={handleSavePayment} className=' flex flex-col gap-6'>
              <TextField 
                label="Guest" 
                InputLabelProps={{shrink:true}} 
                value={paymentDetails.booked_guest_name}
                disabled
              />
              <TextField 
                label="Total Amount" 
                InputLabelProps={{shrink:true}} 
                // type='number' 
                value={localStorage.getItem("total_amount_api")}
                disabled
              />
              <TextField 
                label="Initial Payment" 
                InputLabelProps={{shrink:true}} 
                // type='number' 
                value={paymentDetails.initialiPayment}
                disabled
              />
              <TextField 
                label="Payment Method" 
                InputLabelProps={{shrink:true}} 
                value={paymentDetails.paymentMethod}
                disabled
              />
              <TextField 
                label="Payment Verified" 
                InputLabelProps={{shrink:true}} 
                value={false}
                disabled
              />
              {paymentDetails.paymentMethod=== "virtual" &&<TextField 
                label="Payment Reference" 
                InputLabelProps={{shrink:true}} 
                value={paymentDetails.reference}
                type='text'
                disabled
              />}
              {paymentDetails.paymentMethod === "virtual" ?<TextField 
                label="Payment Status" 
                InputLabelProps={{shrink:true}}
                value={paymentDetails.paymentStatus} 
                disabled
              /> : <FormControl fullWidth>
              <InputLabel id="payment-method-label">Payment Status</InputLabel>
              <Select
                labelId="payment-status-label"
                id="payment-status-select"
                label="Select Guest's Payment Status"
                fullWidth
                onChange={(e: SelectChangeEvent)=>{localStorage.setItem("payment_status_cash", `${e.target.value}`)}}
                >
                  <MenuItem value="Fully-Paid">Fully Paid</MenuItem>
                  <MenuItem value="Part-Payment">Partly Paid</MenuItem>
              </Select>  
  
            </FormControl>}

              <CustomLoadingButton variant='contained' isLoading = {saving} onClick={handleSavePayment}>Save Payment Data</CustomLoadingButton>
            </form>
  )
}


const PayForRoom: React.FC = () => {
  const [amount, setAmount] = React.useState<number>(0);
  const [buttonTrackerOn, setButtonTrackerOn] = React.useState<boolean>(false)
  const [ref,setRef] = React.useState<string>("")
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState<boolean>(false)
  const [amountToPay, setAmountToPay] = React.useState<any>(null)

    const handleFetchingBookedUserDetails = async () => {
      try{
        setPaymentDetails({...paymentDetails, globalLoading: true})
        const {data} = await axios.get(`https://guestmanagerapi.onrender.com/api/bookings/search/${localStorage.getItem("booking_id")}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        setPaymentDetails({...paymentDetails, globalLoading: false})
        setAmountToPay(data.total_amount)
        localStorage.setItem("total_amount_api", `${data.total_amount}`)
        console.log("useE amount data=", data)
      }catch(error){
        setPaymentDetails({...paymentDetails, globalLoading: false})
      }
    }

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("An error occured")
  }
  const {paymentDetails, setPaymentDetails} = context

  const publicKey = "pk_test_bc69024ce8a32194fdecc6a939d0333c821043a1";
  const email = paymentDetails.booked_guess_email || "example@me.com"
  const name = paymentDetails.booked_guest_name || "Change Me"
  const phone = paymentDetails.booked_guest_mobile || "0241234567"


  const onClose = () => {
    alert("We appreciate that gesture, take your payment wai!!!!");
  };

  const componentProps = {
    email,
    amount: amount * 100,  // Convert to kobo for Paystack
    metadata: {
      custom_fields: [
        {
          display_name: 'Name',
          variable_name: 'name',
          value: name,
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: phone,
        },
      ],
    },
    publicKey,
    text: 'Pay Now',
    currency: 'GHS',
    channels: ['card', 'bank', 'ussd', 'mobile_money'],
    onSuccess: (response: any) => {
      setIsPaymentSuccess(true)
      toast.error(`Payment of ${amount} with ref ${response.reference}`)
      console.log("paystack =",response)
      setButtonTrackerOn(true)
      setPaymentDetails({...paymentDetails,amountPayed:amount, reference:response.reference, paymentIsVerified: true, paymentStatus:"Completed", paymentButtonStatus: true, paymentAmount:amount, guess_has_paid: true})
      console.log("paymentdetails =", paymentDetails)
    }, 

    onClose: onClose as unknown as () => void, 
  };

  React.useEffect(()=>{
    
  }, [])
  return (
    <Box>
      <FormControl style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <TextField label="Email" InputLabelProps={{shrink:true}} value={email} disabled />
        <TextField label="Name" InputLabelProps={{shrink:true}} value={name} disabled />
        <TextField 
          label="Amount To Pay" 
          disabled
          InputLabelProps={{shrink:true}} 
          type='number' 
          value={amountToPay} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPaymentDetails({...paymentDetails, amountPayed:parseFloat(e.target.value)})}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {paymentDetails.globalLoading ?
                <IconButton>
                  <CircularProgress size={20} />
                </IconButton>: <IconButton>
                    <FaCalculator size={25} onClick={handleFetchingBookedUserDetails}/>
                  </IconButton>}
              </InputAdornment>
            ),
          }}
        />
        <TextField onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPaymentDetails({...paymentDetails, initialiPayment: parseFloat(e.target.value)})} label='Initial Payment' type='number' />
        {paymentDetails.paymentMethod === "Cash" ?<TextField label="Payment Method" InputLabelProps={{shrink:true}} value={"Cash"} disabled />: <TextField label="Payment Method" InputLabelProps={{shrink:true}} value={"Virtual"} disabled />}
        <TextField label="Mobile" InputLabelProps={{shrink:true}} value={phone} disabled />
        {paymentDetails.paymentMethod !== "Cash" &&  !isPaymentSuccess &&<PaystackButton className='paystack-button' {...componentProps} />}
      </FormControl>
    </Box>
  );
}


const SelectPaymentMethod:React.FC = ()=>{
  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("An ugly error occured!")
  }

  const {setPaymentDetails, paymentDetails} = context;

  React.useEffect(()=>{
    console.log("selected payment method=", paymentDetails.paymentMethod)
  })
  return (<div style={{}}>
          <FormControl fullWidth>
            <InputLabel id="payment-method-label">Choose a payment method</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method-select"
              label="Select a Payment Method"
              fullWidth
              onChange={(event:SelectChangeEvent) => setPaymentDetails({...paymentDetails,paymentMethod:event.target.value})}
              >
                <MenuItem value="Virtual">Virtual Payment</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
            </Select>  

          </FormControl>
  </div>)
}

const steps = [
  {
    label: 'Search for Guest',
    component: <SearchForClient />
  },
  {
    label: "Select Payment Method",
    component:  <SelectPaymentMethod />
  },
  {
    label: 'Pay for the room',
    component: <PayForRoom />
  },
  {
    label: 'Payment Summary',
    component: <PaymentSummary />
  },
];






export default function AddPayment() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isSmallScreen = useMediaQuery("(max-width:1023px)")

  return (
    <Box sx={{ width: "100%", marginTop: '1rem', minHeight: "100vh", backgroundColor: "white" }}>
      <Box sx={{width: !isSmallScreen ? "60%":"90%", margin: 'auto'}}>
        <h1 className=' font-bold text-2xl pt-7 mb-3 text-center'>Add New Payment</h1>
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
            <StepContent>
              {step.component}
              <Box sx={{ mb: 2 }}>
                <div style={{display:"flex" ,flexDirection: isSmallScreen ? "column" : "row"}}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}

      </Box>
    </Box>
  );
}
