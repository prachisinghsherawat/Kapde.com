import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Form,Button } from 'react-bootstrap';
import { useNavigate } from "react-router";

export const SignUp = () => {

  const navigate = useNavigate()

    const [formData,setformData] = useState({

      firstName:"",
      lastName:"",
      email:"",
      password:""
    })
  
    const Handlechange = (e)=>{
      const {id,value} = e.target;
      setformData({...formData,[id]:value})

    }

    const HandleSubmit = (e)=>{
      e.preventDefault()

      axios.post("https://kapde.herokuapp.com/register",formData).then((res)=>{
        //console.log(res)
            
        if(res.data !== "Please try another email"){
          navigate("/login")
        }
        else{
          alert("Please try an another email !")
        }
            
      })
            
    }


    return(

    <div className='authen'>
    <Form className='form2' onSubmit={HandleSubmit}>
    <h1 id='authHeading'>SIGNUP HERE</h1><br />

   <Form.Group className="mb-3" >

    <Form.Label>First Name</Form.Label>
    <Form.Control type="name" placeholder="Enter first name" id="firstName"  onChange={Handlechange}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

  <Form.Group className="mb-3" >
    <Form.Label>Last Name</Form.Label>
    <Form.Control type="name" placeholder="Enter last name" id="lastName" onChange={Handlechange} />
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

  <Form.Group className="mb-3" >
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" id="email"  onChange={Handlechange}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

  <Form.Group className="mb-3" >
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password"  id="password" onChange={Handlechange}/>
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group><br />
  <Button id='submitBtn' type="submit">
    Submit
  </Button>
</Form>


</div>
    )
}