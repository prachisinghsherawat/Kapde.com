import axios from "axios";
import { useEffect , useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getJacketsData } from "../../Redux/Jackets/action";
import { FilterPage } from "../Home/FilterPage";
import SelectLabels from "../Home/SelectTag";
import { useNavigate } from "react-router";
import PaginationControlled from "../Pagination/Pagination";

export const Jackets = () => {

    const [color,setColor] = useState("");
    const [brand,setBrand] = useState("");
    const [size,setSize]   = useState("");
    const [sort,setSort]   = useState("");
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{getData()},[page]);

    var JacketsData = useSelector((store)=> store.jackets.jackets)

    const getData = () => {
        dispatch(getJacketsData(page))
    }

    const handleChange = (event, value) => {
        setPage(value);
    };
    

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

    JacketsData = JacketsData.filter((el)=>{

        if(color == ""){
            return JacketsData
        }
        else if(el.colour == color){
            return el.colour == color
        }
    
    }).filter((el)=>{

        if(brand == ""){
            return JacketsData
        }
        else if(el.brand == brand){
            return el.brand == brand
        }

    }).filter((el)=>{

        if(size == ""){
            return JacketsData
        }
        else if(el.size == size){
            return el.size == size
        }

    }).sort((a,b) => {

        if(sort == ""){
            return JacketsData
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
        <h1>JACKETS</h1>
            <SelectLabels SortApply={SortApply}/>
        </div>
        <div className="mainDiv">
        <div className="leftDiv">
        <FilterPage settingColor={settingColor} selectBrand={selectBrand} selectSize={selectSize} />
        </div>
        <div className="rightDiv">
            
            {JacketsData.map((el)=>(
                <div onClick={()=>  navigate(`/jacketsdetails/${el._id}`)} key={el._id}>
                    <img src={el.imgUrl}/>
                    <p>{"Rs. "+el.price}</p>
                </div>
            ))}

            


            

            {/* --------------------------------------- Pagination -----------------------------------------> */}

            <div className="paginationDiv">
                <PaginationControlled handleChange={handleChange} page={page}/>
            </div>

        </div>
        </div>
        </>
    )
    
}