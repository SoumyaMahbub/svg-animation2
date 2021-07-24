import fileNameReducer from "./fileName";
import svgStringReducer from "./svgString";
import svgJsonReducer from "./svgJson";
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
    fileName: fileNameReducer,
    svgString: svgStringReducer,
    svgJson: svgJsonReducer,
})

export default rootReducers;