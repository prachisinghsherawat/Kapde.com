import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export function FilterPage({settingColor, selectBrand , selectSize}){

  return (

    <>

    {/*  ----------------------------------- FILTERS BY COL0RS ------------------------------------------- */}

    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">COLORS</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel onClick={()=>settingColor("black")} value="black" control={<Radio />} label="Black" />
        <FormControlLabel onClick={()=>settingColor("pink")} value="pink" control={<Radio />} label="Pink" />
        <FormControlLabel onClick={()=>settingColor("blue")} value="blue" control={<Radio />} label="Blue" />
        <FormControlLabel onClick={()=>settingColor("skyblue")} value="skyblue" control={<Radio />} label="Sky Blue" />
        <FormControlLabel onClick={()=>settingColor("green")} value="green" control={<Radio />} label="Green" />
        <FormControlLabel onClick={()=>settingColor("white")} value="white" control={<Radio />} label="White" />
        <FormControlLabel onClick={()=>settingColor("yellow")} value="yellow" control={<Radio />} label="Yellow" />
        <FormControlLabel onClick={()=>settingColor("brown")} value="brown" control={<Radio />} label="Brown" />
      </RadioGroup>
    </FormControl><br /><br /><br />


     {/*  ---------------------------- FILTERS BY BRANDS --------------------------------------------- */}

     <FormControl>
     <FormLabel id="demo-radio-buttons-group-label">BRANDS</FormLabel>
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel onClick={()=>selectBrand("ajio")} value="ajio" control={<Radio />} label="Ajio" />
       <FormControlLabel onClick={()=>selectBrand("levis")} value="levis" control={<Radio />} label="Levis" />
       <FormControlLabel onClick={()=>selectBrand("gucci")} value="gucci" control={<Radio />} label="Gucci" />
       <FormControlLabel onClick={()=>selectBrand("shein")} value="shein" control={<Radio />} label="Shein" />
      
     </RadioGroup>
   </FormControl><br /><br /><br />

    
    {/* ---------------------------------- FILTERS BY SIZE ------------------------------------------- */}

    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">SIZES</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel onClick={()=>selectSize("small")} value="small" control={<Radio />} label="Small" />
        <FormControlLabel onClick={()=>selectSize("large")} value="large" control={<Radio />} label="Large" />
        <FormControlLabel onClick={()=>selectSize("extralarge")} value="extralarge" control={<Radio />} label="Extra Large" />
       
      </RadioGroup>
    </FormControl>

   </>
  );
}
