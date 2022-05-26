import axios from "axios";

export const GETKURTISDATA = "GETKURTISDATA";

export const kurtiData = (payload) => ({

    type : GETKURTISDATA,
    payload : payload
})

export const getKurtiData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/kurti?page=${page}`).then((res)=>{
        dispatch(kurtiData(res.data))
    })
}