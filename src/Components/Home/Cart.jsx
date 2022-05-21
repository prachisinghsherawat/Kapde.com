import { useState } from "react"
import { useNavigate } from "react-router";


export const Cart = ()=>{
              
    const [count,setCount] = useState(1)
    const [carttotal,setCarttotal] = useState(0);
    const [flag,setFlag] = useState(false);
    const navigate = useNavigate()

    let cartData = JSON.parse(localStorage.getItem("cartData"))

    

    return(

        <>
        <h1 id="mycart">MY CART</h1>
        <div >
         {cartData.map((el,index)=>(

            <div key={index} className="flexdiv">
              <div className="imgdiv"> <img  src={el.imgUrl} alt="" />
              </div>

                {/* <div className="counter">
                    <button>+</button>
                      <p>{count}</p>
                       <button>-</button>
                </div> */}
                
                      <div className="Details">
                    <p>Price: {el.price}</p>
                    <p>Size: {el.size}</p>
                    <p>Brand: {el.brand}</p>
                    <p>Colour: {el.colour}</p>
                    <p>Total:{count*el.price}</p>
                    <button onClick={()=>{
                      
                      cartData.splice(index,1);
                      localStorage.setItem("cartData",JSON.stringify(cartData))
                      setFlag(!flag)
                          
                    }}>Remove</button>
                       </div>
            </div>
            
         ))}
        </div>

        <button onClick={()=> navigate("/payment")} id="payBtn">Proceed to Pay</button>
        </>
    )
}