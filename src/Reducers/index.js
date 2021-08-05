import fileNameReducer from "./fileName";
import svgStringReducer from "./svgString";
import svgJsonReducer from "./svgJson";
import selLayerReducer from "./selLayer";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
	fileName: fileNameReducer,
	svgString: svgStringReducer,
	svgJson: svgJsonReducer,
	selLayer: selLayerReducer,
});

export default rootReducers;
