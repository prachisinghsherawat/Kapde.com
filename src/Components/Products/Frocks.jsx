import axios from "axios";
import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux"
import { getFrocksData } from "../../Redux/Frocks/action";
import { FilterPage } from "../Home/FilterPage";
import SelectLabels from "../Home/SelectTag";
import { useNavigate } from "react-router";


export const Frocks = () => {

    const dispatch = useDispatch();
    useEffect(()=>{getData()},[]);
    
    var FrocksData = useSelector((store)=> store.frocks.frocks)

    const getData = () => {
        
        dispatch(getFrocksData())
    }

    const [color,setColor] = useState("");
    const [brand,setBrand] = useState("");
    const [size,setSize]   = useState("");
    const [sort,setSort]   = useState("");

    const navigate = useNavigate()

    // Filter page data

    const settingColor = (value)=>{
        setColor(value)
    }
    const selectBrand = (value)=>{
        setBrand(value)
    }
    const selectSize = (value)=>{
        setSize(value)
    }

    //SELECT TAG DATA

    const SortApply = (value)=>{
        setSort(value)
    }

    // FILTERS ---------------------------->  COLOR , BRAND , SIZE

        FrocksData = FrocksData.filter((el)=>{

            if(color == ""){
                return FrocksData
            }
            else if(el.colour == color){
                return el.colour == color
            }
        
        }).filter((el)=>{

            if(brand == ""){
                return FrocksData
            }
            else if(el.brand == brand){
                return el.brand == brand
            }

        }).filter((el)=>{

            if(size == ""){
                return FrocksData
            }
            else if(el.size == size){
                return el.size == size
            }

        }).sort((a,b) => {

            if(sort == ""){
                return FrocksData
            }
            else if(sort == "asc"){
                return a.price - b.price
            }
            else if(sort == "desc"){
                return b.price - a.price
            }
        })

    return(
        <>
        
        <div className="selectTag">
        <h1>FROCKS</h1>
            <SelectLabels SortApply={SortApply}/>
        </div>
        <div className="mainDiv">
        <div className="leftDiv">
        <FilterPage settingColor={settingColor} selectBrand={selectBrand} selectSize={selectSize} />
        </div>
        <div className="rightDiv">
            
            {FrocksData.map((el)=>(
                <div onClick={()=>  navigate(`/frocksdetails/${el.id}`)} key={el.id}>
                    <img src={el.imgUrl}/>
                    <p>{"Rs. "+el.price}</p>
                </div>
            ))}
        </div>
        </div>
        </>
    )
    
}