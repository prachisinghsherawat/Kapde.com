import axios from "axios";

export const GETTOPSDATA = "GETTOPSDATA";

export const TopData = (payload) => ({

    type : GETTOPSDATA,
    payload : payload
})

export const getTopsData = () => (dispatch) => {

    axios.get("https://kapde.herokuapp.com/tops").then((res) => {
        dispatch(TopData(res.data))
    })
}