
import { GETDENIMSDATA } from "./action";

const initState = {

    denims : []
}

export const DenimReducer = (store = initState , {type , payload} ) => {

    switch(type){

        case GETDENIMSDATA:
        return {...store , denims : [...payload]}

        default :
        return store
    }
}

