import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectLabels({SortApply}) {
  
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Price</InputLabel>
        <Select 
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label="Price"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem onClick={()=>SortApply("asc")} >Low to High</MenuItem>
          <MenuItem onClick={()=>SortApply("desc")} >High to Low</MenuItem>
          
        </Select>
      </FormControl>

     
    </div>
  );
}
