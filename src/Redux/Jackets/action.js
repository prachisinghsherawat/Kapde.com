import axios from "axios";

export const GETJACKETSDATA = "GETJACKETSDATA";

export const JacketsData = (payload) => ({

    type : GETJACKETSDATA,
    payload : payload
})

export const getJacketsData = (page) => (dispatch) => {

    axios.get(`https://kapde.herokuapp.com/jackets?page=${page}`).then((res) => {
        dispatch(JacketsData(res.data))
    })
}

