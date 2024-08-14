import React, { useState } from 'react'

const APIContext = React.createContext<APIContextTypes | undefined>(undefined)

interface PaymentDetails{
  reference?: string;
  paymentMethod?: string;
  paymentIsVerified?: boolean;
  amountPayed?: number;
  paymentStatus?: string;
  booking_id?: number;
  booked_guess_email?: string;
  booked_guest_mobile?: string;
  booked_guest_name?: string;
  paymentButtonStatus?: boolean;
  paymentAmount?: number;
  guess_has_paid?: boolean;
  guest_id?: number;
  booked_guest_id?: number;
  amountPayedByCash?: number;
  roomIDOnBooking?: string;
  roomStatusUpdateOnBooking?: string;

  full_name?: string;
  globalLoading ?: boolean;
  globalOpen? : boolean;

  openDownLoadInvoiceModal?: boolean;
  initialiPayment ?: number;
  finalPayment ?: number;
}

interface APIContextTypes {
  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>> 
}



const MyContexts = ({children}:{children:React.ReactNode}) => {

  const [paymentDetails, setPaymentDetails] = React.useState <PaymentDetails >({
    reference: "",
    openDownLoadInvoiceModal: false,
    amountPayed:0,
    globalLoading: false,
    full_name: "",
    initialiPayment: 0,
  })

  const [paymentMethod, setPaymentMethod] = React.useState<string>("")
  return (
    <APIContext.Provider value={{paymentDetails, setPaymentDetails}}>
      {children}
    </APIContext.Provider>
  )
}

export {MyContexts, APIContext}