import React, {Component} from 'react';
const commentReducer = (state = [], action) => {
    //เขียนรูปแบบ Action
    switch(action.type) {
        case 'ADD_COMMENT':
            return state.concat([action.data]);
        default:
            return state;
    }
}
export default commentReducer;