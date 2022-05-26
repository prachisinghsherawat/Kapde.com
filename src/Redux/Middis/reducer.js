import { GETMIDDISDATA } from "./action";

const initState = {

    middis : []
}

export const MiddisReducer = (store =initState , {type , payload} ) => {

    switch(type){

        case GETMIDDISDATA :
        return {...store , middis : [...payload]}

        default :
        return store
    }
}
