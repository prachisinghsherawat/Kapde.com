import axios from "axios";

export const GETMIDDISDATA = "GETMIDDISDATA";

export const MiddisData = (payload) => ({

    type : GETMIDDISDATA,
    payload : payload
})

export const getMiddisData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/middi?page=${page}`).then((res) => {
        dispatch(MiddisData(res.data))
    })
}
