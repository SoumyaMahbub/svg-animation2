const svgStringReducer = (state="", action) => {
    switch(action.type) {
        case "CHANGESVGSTRING":
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default svgStringReducer;