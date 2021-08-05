const selLayerReducer = (state = {}, action) => {
	switch (action.type) {
		case "CHANGESELLAYER":
			state = action.payload;
			return state;
		case "REMOVESELLAYER":
			state = {};
			return state;
		default:
			return state;
	}
};

export default selLayerReducer;
