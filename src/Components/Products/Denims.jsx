import axios from "axios";
import { useEffect , useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getDenimData } from "../../Redux/Denims/action";
import { FilterPage } from "../Home/FilterPage";
import SelectLabels from "../Home/SelectTag";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from "react-router"; 
import PaginationControlled from "../Pagination/Pagination";


export const Denims = () => {

    const [color,setColor] = useState("");
    const [brand,setBrand] = useState("");
    const [size,setSize]   = useState("");
    const [sort,setSort]   = useState("");
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    var DenimsData = useSelector((store)=> store.denims.denims)

    useEffect(()=>{getData()},[page]);
    
    const handleChange = (event, value) => {
        setPage(value);
    };

    const getData = () => {
        dispatch(getDenimData(page))
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

        DenimsData = DenimsData.filter((el)=>{

            if(color == ""){
                return DenimsData
            }
            else if(el.colour == color){
                return el.colour == color
            }
        
        }).filter((el)=>{

            if(brand == ""){
                return DenimsData
            }
            else if(el.brand == brand){
                return el.brand == brand
            }

        }).filter((el)=>{

            if(size == ""){
                return DenimsData
            }
            else if(el.size == size){
                return el.size == size
            }

        }).sort((a,b) => {

            if(sort == ""){
                return DenimsData
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
            <h1>DENIMS</h1>
            <SelectLabels SortApply={SortApply} />
            
        </div>
        <div className="mainDiv">
        <div className="leftDiv">
            <FilterPage  settingColor={settingColor} selectBrand={selectBrand} selectSize={selectSize} />
        </div>
        <div className="rightDiv">
            
            {DenimsData.map((el)=>(

                <div onClick={()=>  navigate(`/denimsdetails/${el._id}`)} key={el._id} >

                    <img src={el.imgUrl}/>
                    <p>{"Rs. "+el.price}</p>
                </div>
            ))}

        </div>
        </div>

         {/* --------------------------------------- Pagination -----------------------------------------> */}

        <div id="paginationDiv">
            <PaginationControlled handleChange={handleChange} page={page}/>
        </div>

        </>
    )
    
}