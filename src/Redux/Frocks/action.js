import axios from "axios";

export const GETFROCKSDATA = "GETFROCKSDATA";

export const FrocksData = (payload) => ({

    type : GETFROCKSDATA,
    payload : payload
})

export const getFrocksData = () => (dispatch) => {

    axios.get("https://kapde-backend-api.herokuapp.com/frock").then((res) => {
        dispatch(FrocksData(res.data))
    })
}