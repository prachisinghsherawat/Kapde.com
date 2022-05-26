import axios from "axios";


export const GETDENIMSDATA = "GETDENIMSDATA";

export const DenimData = (payload) => ({

    type : GETDENIMSDATA,
    payload : payload
})

export const getDenimData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/denims?page=${page}`).then((res)=>{
        dispatch(DenimData(res.data))
    })
}

