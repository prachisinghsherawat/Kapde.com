import { GETJACKETSDATA } from "./action";

const initState = {

    jackets : []
}

export const JacketsReducer = (store =initState , {type , payload} ) => {

    switch(type){

        case GETJACKETSDATA :
        return {...store , jackets : [...payload]}

        default :
        return store
    }
}

