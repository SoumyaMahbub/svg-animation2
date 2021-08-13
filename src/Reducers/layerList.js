const layerListReducer = (state=[], action) => {
    switch(action.type) {
        case "PUSHLAYERLIST":
            state.push(action.payload);
            return state;

        case "REMOVELAYERLIST":
            state=[]
            return state;
        
        default:
            return state;
    }
}

export default layerListReducer;