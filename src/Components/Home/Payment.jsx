

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';

export function Payment() {

    const navigate = useNavigate()

    const [ formData , setFormData] = React.useState({
        name : "",
        cardNo : "",
        expiry :"",
        cvv : ""
    })


    const HandleChange = (e) => {

        const {id,value} = e.target;
        setFormData({...formData , [id] : value})
    }

    const HandleSubmit = () => {

        console.log(formData.cardNo.length)

        if(formData.name !=="" && formData.cardNo.length == 16 && formData.expiry.length == 5 && formData.cvv.length == 3   ){
            navigate("/paymentsuccessful")
        }
        
        else{
            alert("write correct details !")
        }
    }

  return (
    <>
    <h1 id="mycart">Enter Your Card Details</h1>
    <div className="paymentBox">
    <Box
      sx={{
        alignItems: 'center',
        '& > :not(style)': { m: 1 },
      }}
    >
      <TextField onClick={HandleChange}
        id="name"
        label="Name"
      /> 

     <TextField onClick={HandleChange}
        id="cardNo"
        label="Card Number"
      /> 

      <TextField onClick={HandleChange}
        id="expiry"
        label="Expiry Date"
      /> 

      <TextField onClick={HandleChange}
        id="cvv"
        label="CVV"
      /> 
    
     {/* ---------------------- Button --------------------------------------- */}


    <Stack direction="row" spacing={2}>
      <Button onClick={HandleSubmit} id='paymentBtn' variant="contained">Place Your Order</Button>
    </Stack>
 
    </Box>
    </div>
    </>
  );
}
