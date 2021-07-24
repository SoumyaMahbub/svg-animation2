const fileNameReducer = (state = "", action) => {
    switch (action.type) {
        case 'CHANGEFILENAME':
            state = action.payload
            return state;
        default:
            return state;
    }
}

export default fileNameReducer;