import {Carousel} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { HomeProduct } from "./HomeProduct";
import { Footer } from "../Footer/Footer"

export const Home = () => {

    return(
        <div className="carousel">
            <Carousel variant="dark">

  <Carousel.Item className="Citem">
    <img
      className="d-block w-100"
      src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/5/3/a20271c6-249f-480b-bcc7-1b150516e54e1651599573998-Dressberry_Desk.jpg"
      alt="First slide"
    />
    <Carousel.Caption className="Ccaption">
     
    </Carousel.Caption>
  </Carousel.Item>


  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/4/9/d88bf465-8b71-489b-99f6-311c832b89ad1649528433105-Kurtas---Sets_Dk.jpg"
      alt="Second slide"
    />
    <Carousel.Caption>
     
    </Carousel.Caption>
  </Carousel.Item>
  
  
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/4/9/1d37c076-896a-4e47-a478-955bdb1dc5ea1649528950401-HLSS-P0-Desktop-Banner.gif"
      alt="Third slide"
    />
    <Carousel.Caption>
     
    </Carousel.Caption>
  </Carousel.Item>

  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/4/9/7ccd40bf-d173-4f8c-a0b0-21672ebd8a671649528732325-Sports---Casual-Shoes_Dk.jpg"
      alt="Fourth slide"
    />
    <Carousel.Caption>
     
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>

 <HomeProduct />

 <Footer />
 
        
    
        
        
        </div>
    )
}