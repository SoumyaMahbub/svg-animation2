const layerListReducer = (state=[], action) => {
    switch(action.type) {
        case "CHANGELAYERLIST":
            state = action.payload;
            return state;

        case "REMOVELAYERLIST":
            state=[]
            return state;
        
        default:
            return state;
    }
}

export default layerListReducer;