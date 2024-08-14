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
import { useNavigate } from 'react-router-dom';

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

interface Payment {
    payment_id: number;
    payment_method: string;
    amountToPay: number;
    initiallyPaidAmount: number;
    balanceToPay: number;
    paying_guest_name: string;
    paying_guest_id : number;
    guest_has_fully_paid: boolean
}

const SearchForClient: React.FC = () => {
  const isSmallDeviceScreen = useMediaQuery("(max-width:1023px)");
  const [prefetchedClientList, setPrefetchedClientList] = React.useState<Payment[]>([]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [selectedValue, setSelectedValue] = React.useState<Payment | null>(null);
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
        const { data } = await axios.get(`https://guestmanagerapi.onrender.com/api/payment/search/${inputValue}/`, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`} });
        console.log("client list =", data);

        const balancePaymentList: Payment[] = data.map((payment_item: any) => ({
          payment_id: payment_item.id,
          paying_guest_name: payment_item.guess_name,
          payment_method: payment_item.payment_method,
          amountToPay: payment_item.booking_amount,
          initiallyPaidAmount: payment_item._intial_payment,
          balanceToPay: payment_item.payment_balance,
          paying_guest_id: payment_item.paying_guest_id,
          guest_has_fully_paid: payment_item.guest_has_fully_paid
        }));

        setPrefetchedClientList(balancePaymentList);
        console.log("get list=", balancePaymentList)
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    findingGuest();

  }, [inputValue]);

  const handleChange = (_: React.SyntheticEvent, newValue: Payment | null) => {
    setSelectedValue(newValue);
    if (newValue) {
      console.log('Selected Value:', newValue);
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        payment_id: newValue.payment_id,
          paying_guest_name: newValue.paying_guest_name,
          payment_method: newValue.payment_method,
          amountToPay: newValue.amountToPay,
          initiallyPaidAmount: newValue.initiallyPaidAmount,
          balanceToPay: newValue.balanceToPay,
          paying_guest_id: newValue.paying_guest_id,
          guest_has_fully_paid: newValue.guest_has_fully_paid
      }));
      localStorage.setItem("payment_id", `${newValue.payment_id}`)
      localStorage.setItem("paying_guest_name", `${newValue.paying_guest_name}`)
      localStorage.setItem("balance_to_pay", `${newValue.balanceToPay}`)
      localStorage.setItem("amount_to_pay", `${newValue.amountToPay}`)
      localStorage.setItem("initially_paid_amount", `${newValue.initiallyPaidAmount}`)
      localStorage.setItem("paying_guest_id", `${newValue.paying_guest_id}`)

      console.log("payment details id =", paymentDetails.guest_id)
      toast.success(`${newValue.paying_guest_name} owes GH₵${newValue.balanceToPay}`)
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
        <Box sx={{}}>
          <Autocomplete
            fullWidth
            loading={isLoadingData}
            value={selectedValue}
            onChange={handleChange}
            getOptionDisabled={(option) => option.guest_has_fully_paid}
            inputValue={inputValue}
            autoHighlight
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            id="combo-box-demo"
            noOptionsText="No options found"
            options={prefetchedClientList}
            getOptionLabel={(option) => option.paying_guest_name}
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
      const {data} = await axios.post("https://guestmanagerapi.onrender.com/api/payment/create/", {payment_reference: paymentDetails.reference, amount: localStorage.getItem("total_amount_api"),initial_payment: paymentDetails.initialiPayment,account_by: localStorage.getItem("logged_in_user_id"), payment_method: paymentDetails.paymentMethod, payment_verified: paymentDetails.paymentIsVerified, payment_status: paymentDetails.paymentStatus, booking: paymentDetails.booking_id}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
      const guest_id = localStorage.getItem("guest_id")
      const updateGuestInfo = async () => {
        const {data} = await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${guest_id}/`, {has_paid: true}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        console.log("updated guest =", data)
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
                label="Final Payment" 
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
                >
                  <MenuItem value="Completed">Fully Paid</MenuItem>
                  <MenuItem value="Pending">Partly Paid</MenuItem>
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

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()

  const handleBalancePayment = async () => {
    const guest_id = localStorage.getItem("paying_guest_id")
    try{
        setIsLoading(true)
        const response = await axios.patch(`https://guestmanagerapi.onrender.com/api/payment/${localStorage.getItem("payment_id")}/`, {final_payment: localStorage.getItem("balance_to_pay"), payment_status: "Fully-Paid", payment_method: "Cash"}, {headers:{"Authorization": `Bearer ${localStorage.getItem("access_token")}`}})
        console.log("Balance payment response =", response.data)
        const updateGuestResponse = localStorage.getItem("payment_status_cash")=== "Fully-Paid"? await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${guest_id}/`, {has_fully_paid: true}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}}): await axios.patch(`https://guestmanagerapi.onrender.com/api/guests/${guest_id}/`, {has_fully_paid: false}, {headers:{"Authorization":`Bearer ${localStorage.getItem("access_token")}`}})
        localStorage.removeItem("payment_id")
        localStorage.removeItem("paying_guest_name")
        localStorage.removeItem("balance_to_pay")
        localStorage.removeItem("amount_to_pay")
        localStorage.removeItem("initially_paid_amount")
        localStorage.removeItem("paying_guest_id")
        setIsLoading(false)
        toast.success("Payment completed", {position:"bottom-center"})
        navigate("/cms/payments")
    }catch(error){
        setIsLoading(false)
        console.error("Balance payment error at:", error)
        toast.error("Balance Payment Failed")
    }
  }
  return (
    <Box>
      <FormControl style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <TextField label="Payment ID" InputLabelProps={{shrink:true}} value={localStorage.getItem("payment_id")} disabled />
        <TextField label="Name" InputLabelProps={{shrink:true}} value={localStorage.getItem("paying_guest_name")} disabled />
        <TextField label="Payment Method" InputLabelProps={{shrink:true}} value={paymentDetails.paymentMethod} disabled />
        <TextField 
          label="Total Booking Amount" 
          disabled
          InputLabelProps={{shrink:true}} 
          type='number' 
          value={localStorage.getItem("amount_to_pay")} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <p>GH₵</p>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField 
          label="Initially Paid Amount" 
          disabled
          InputLabelProps={{shrink:true}} 
          type='number' 
          value={localStorage.getItem("initially_paid_amount")} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <p>GH₵</p>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField 
          label="Balance Due Payment" 
          disabled
          InputLabelProps={{shrink:true}} 
          type='number' 
          value={localStorage.getItem("balance_to_pay")} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <p>GH₵</p>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField 
          label="Final Payment" 
          disabled
          InputLabelProps={{shrink:true}} 
          type='number' 
          value={localStorage.getItem("balance_to_pay")} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <p>GH₵</p>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl fullWidth>
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
  
            </FormControl>
        {paymentDetails.paymentMethod !== "Cash" &&  !isPaymentSuccess ?<PaystackButton className='paystack-button' {...componentProps} />: <CustomLoadingButton isLoading={isLoading} variant='contained' type='submit' onClick={handleBalancePayment}>Make Final Payment</CustomLoadingButton>}
        <Button variant='contained' onClick={()=>navigate("/cms/payments")}>View All Payments</Button>
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
//   {
//     // label: 'Payment Summary',
//     // component: <PaymentSummary />
//   },
];






export default function BalancePayment() {
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
        <h1 className=' font-bold text-2xl pt-7 mb-3 text-center'>Balance Payment</h1>
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
                <div style={{display:"flex" ,flexDirection: index === steps.length - 1 ? "column-reverse" : "column"}}>
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
                    variant='contained'
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
