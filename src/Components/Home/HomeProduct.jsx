import { Div, FlexDiv } from "./FlexBox"
import {useNavigate} from "react-router"

export const HomeProduct = () => {

    const navigate = useNavigate()

    return(
        <>
        <div >
            <FlexDiv className="FlexDiv">
                <Div> <button className="boxes" onClick={  ()=> navigate("/tops")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/8238147e-a86e-4fe4-a830-ab5c2c49beba1598892141840-W.jpg" alt="" /> </button></Div>
                <Div> <button className="boxes" onClick={  ()=> navigate("/kurtis")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/9/5a5a162e-c4ad-4497-b995-a3c077d25df71596975348916-Women-s-Ethnic-Wear_Vishudh.jpg" alt="" /> </button></Div>
                <Div> <button className="boxes" onClick={  ()=> navigate("/middis")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/retaillabs/2020/9/26/adc58a2c-fa18-4b94-b2d6-4c692a44123d1601115417606-unnamed--6-.jpg" alt="" /> </button></Div>
                <Div> <button className="boxes" onClick={  ()=> navigate("/denims")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/4abbda25-8d58-44f7-a986-c80fa31b08b31598892141513-Only.jpg" alt="" /> </button></Div>
                <Div> <button className="boxes" onClick={  ()=> navigate("/frocks")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/ee953e28-7ca8-4e08-a6a9-c51c98f823411598892141010-BIBA.jpg" alt="" /> </button></Div>
                <Div> <button className="boxes" onClick={  ()=> navigate("/jackets")}><img src="https://assets.myntassets.com/f_webp,w_122,c_limit,fl_progressive,dpr_2.0/assets/images/retaillabs/2021/11/12/2d4b2a2c-9332-4844-bb32-6ccf0e35fef21636697516790-Urbanic-1.jpg" alt="" /> </button></Div>   
            </FlexDiv>

            <div className="sales">
                <img src="https://lmsin.net/cdn-cgi/image/w=1232,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-10modblock-oneBythree-A-Women-05May2022.gif" alt="" height="100%" width="100%" />
            </div>

            <div className="threebox" >
                <div onClick={ () => navigate("/middis")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=500,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-15modularblock-oneBythree-A-Women-20April2022.jpg" alt="" height="100%" width="100%" />
                </div>
                <div onClick={ () => navigate("/tops")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=1232,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-modblock7-oneBythree-A-Women-08April2022.jpg" alt="" height="100%" width="100%"/>
                </div>
                <div onClick={ () => navigate("/denims")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=1232,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-modblock7-oneBythree-B-Women-08April2022.jpg" alt="" height="100%" width="100%"/>
                </div>
            </div>

            <div className="sales2">
                <img src="https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-women-9modblock-StripBanner2-D-05May2022.gif" alt="" height="100%" width="100%" />
            </div>


            <div className="threebox">
                <div onClick={ () => navigate("/kurtis")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=500,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-8modblock-oneBythree-B-Women-04March2022.jpg" alt="" height="100%" width="100%"/>
                </div>
                <div onClick={ () => navigate("/jackets")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=500,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-6modblk-oneBythree-A-Women-01April2022.jpg" alt="" height="100%" width="100%"/>
                </div>
                <div onClick={ () => navigate("/frocks")}>
                    <img src="https://lmsin.net/cdn-cgi/image/w=500,q=60,fit=cover/https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-13modblock-oneBythree-A-Women-04March2022.jpg" alt="" height="100%" width="100%"/>
                </div>
            </div>

            <div className="sales2">
                <img src="https://70415bb9924dca896de0-34a37044c62e41b40b39fcedad8af927.lmsin.net/LS-Fest/LS-new/desktop-dept-modularblock-oneBytwo1A-Women-29April2022.jpg" alt="" height="100%" width="100%" />
            </div>

        </div>

        </>
    ) 
}
