import axios from "axios";

export const GETFROCKSDATA = "GETFROCKSDATA";

export const FrocksData = (payload) => ({

    type : GETFROCKSDATA,
    payload : payload
})

export const getFrocksData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/frock?page=${page}`).then((res) => {
        dispatch(FrocksData(res.data))
    })
}

