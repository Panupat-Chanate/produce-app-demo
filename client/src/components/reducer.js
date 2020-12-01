const Reducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD_COMMENT':
            return state.concat([action.value]);
        default:
            return state;
    }
}
export default Reducer;