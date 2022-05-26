
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { DenimReducer } from "./Denims/reducer";
import { FrocksReducer } from "./Frocks/reducer";
import { JacketsReducer } from "./Jackets/reducer";
import { KurtiReducer } from "./Kurtis/reducer";
import { MiddisReducer } from "./Middis/reducer";
import { TopReducer } from "./Tops/reducer";


const rootReducer = combineReducers({

    tops : TopReducer ,
    kurtis : KurtiReducer,
    denims : DenimReducer,
    frocks : FrocksReducer ,
    jackets : JacketsReducer,
    middis : MiddisReducer
    
})

export const store = createStore(rootReducer,applyMiddleware(thunk))