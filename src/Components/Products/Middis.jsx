import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getMiddisData } from "../../Redux/Middis/action";
import { FilterPage } from "../Home/FilterPage";
import SelectLabels from "../Home/SelectTag";
import { useNavigate } from "react-router";


export const Middis = () => {

    const [color,setColor] = useState("");
    const [brand,setBrand] = useState("");
    const [size,setSize]   = useState("");
    const [sort,setSort]   = useState("");

    const navigate = useNavigate()

    const dispatch = useDispatch();
    useEffect(()=>{getData()},[]);
    
    var MiddisData = useSelector((store)=> store.middis.middis)

    const getData = () => {
        
        dispatch(getMiddisData())
    }


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

     MiddisData = MiddisData.filter((el)=>{

        if(color == ""){
            return MiddisData
        }
        else if(el.colour == color){
            return el.colour == color
        }
    
    }).filter((el)=>{

        if(brand == ""){
            return MiddisData
        }
        else if(el.brand == brand){
            return el.brand == brand
        }

    }).filter((el)=>{

        if(size == ""){
            return MiddisData
        }
        else if(el.size == size){
            return el.size == size
        }

    }).sort((a,b) => {

        if(sort == ""){
            return MiddisData
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
        <h1>MIDDIS</h1>
        <SelectLabels SortApply={SortApply}/>
        </div>
        <div className="mainDiv">
        <div className="leftDiv">
        <FilterPage settingColor={settingColor} selectBrand={selectBrand} selectSize={selectSize} />
        </div>
        <div className="rightDiv">
            
            {MiddisData.map((el)=>(
                <div onClick={()=>  navigate(`/middisdetails/${el.id}`)} key={el.id}>
                    <img src={el.imgUrl}/>
                    <p>{"Rs. "+el.price}</p>
                </div>
            ))}
        </div>
        </div>
        </>
    )
    
}