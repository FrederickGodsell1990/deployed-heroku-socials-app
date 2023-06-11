const initialState = {
    count : 0
};

export default (state = initialState, action) => {
    switch(action.type) {
        case "INCREMENT" :
            console.log("Increment heeeere")
            return Object.assign({}, state, {
                count : state.count +1
            });
        case "DECREMENT" :
            return Object.assign({}, state, {
                count : state.count -1
            });
        default:
            return state;
    }
}