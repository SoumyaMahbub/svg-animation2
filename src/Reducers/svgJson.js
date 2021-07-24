const svgJsonReducer = (state={}, action) => {
    switch(action.type) {
        case "CHANGESVGJSON":
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default svgJsonReducer;