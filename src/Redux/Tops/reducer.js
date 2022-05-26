import { GETTOPSDATA } from "./action";

const initState = {

    tops : []
}

export const TopReducer = (store =initState , {type , payload} ) => {

    switch(type){

        case GETTOPSDATA :
        return {...store , tops : [...payload]}

        default :
        return store
    }
}
