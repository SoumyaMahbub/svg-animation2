import fileNameReducer from "./fileName";
import svgStringReducer from "./svgString";
import svgJsonReducer from "./svgJson";
import selLayerReducer from "./selLayer";
import { combineReducers } from "redux";
import layerListReducer from "./layerList";

const rootReducers = combineReducers({
	fileName: fileNameReducer,
	svgJson: svgJsonReducer,
	layerList:layerListReducer,
	selLayer: selLayerReducer,
	svgString: svgStringReducer,
});

export default rootReducers;
