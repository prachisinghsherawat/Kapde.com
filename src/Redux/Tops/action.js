import axios from "axios";

export const GETTOPSDATA = "GETTOPSDATA";

export const TopData = (payload) => ({

    type : GETTOPSDATA,
    payload : payload
})

export const getTopsData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/tops?page=${page}`).then((res) => {
        dispatch(TopData(res.data))
    })
}
