import axios from "axios";

export const GETMIDDISDATA = "GETMIDDISDATA";

export const MiddisData = (payload) => ({

    type : GETMIDDISDATA,
    payload : payload
})

export const getMiddisData = () => (dispatch) => {

    axios.get("https://kapde-backend-api.herokuapp.com/middi").then((res) => {
        dispatch(MiddisData(res.data))
    })
}