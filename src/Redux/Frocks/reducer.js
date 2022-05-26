import { GETFROCKSDATA } from "./action";

const initState = {

    frocks : []
}

export const FrocksReducer = (store =initState , {type , payload} ) => {

    switch(type){

        case GETFROCKSDATA :
        return {...store , frocks : [...payload]}

        default :
        return store
    }
}

