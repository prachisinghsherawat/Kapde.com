import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Form,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export const Login = () => {

    const [formData , setFormData] =  useState({

        email:"",
        password:""
    })

   const navigate = useNavigate();

    const HandleChange = (e) => {
        const {id , value} = e.target;
        setFormData({...formData ,[id] : value});
    }

    const HandleSubmit = (e) =>{
        e.preventDefault();

        axios.post("https://kapde.herokuapp.com/login" ,formData).then((res) => {
            console.log(res)

            if(res.data !== "please try another email or password"){
                navigate("/")
            }
            else{
                alert("please try correct email or password")
            }
        })
    }

    return(

      <div className='authen' >

        <Form className='form' onSubmit={HandleSubmit}>

            <h1 id='authHeading'>LOGIN HERE</h1><br />

          <Form.Group className="mb-3" >
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" id="email" placeholder="Enter email" onChange={HandleChange} />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" id="password" >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id="password" placeholder="Password" onChange={HandleChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group><br />

          <Button id='submitBtn' type="submit"> Submit </Button>
           <br /> <br /> <br /> <br /><br /><br /><br /><br />

        </Form>
        
      </div>
    )
}

