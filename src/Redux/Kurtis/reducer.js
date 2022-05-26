
import { GETKURTISDATA } from "./action";

const initState = {

    kurtis : []
}

export const KurtiReducer = ( store =initState,{type ,payload}) => {

    switch(type){

        case GETKURTISDATA :
        return { ...store , kurtis : [...payload] }

        default :
        return store
    }
}
