const selLayerReducer = (state = {layer: {}, idx: []}, action) => {
	switch (action.type) {
		case "CHANGESELLAYER":
			state = action.payload;
			return state;
		case "REMOVESELLAYER":
			state = {layer: {}, idx: []};
			return state;
		default:
			return state;
	}
};

export default selLayerReducer;
