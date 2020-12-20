import React, {Component} from 'react';
const commentReducer = (state = [], action) => {
    //เขียนรูปแบบ Action
    switch(action.type) {
        case 'LEVEL':
            return state.concat([action.data]);
        case 'DELETE_COMMENT':
            return state.filter((comment)=>comment.id !== action.id);
        case 'EDIT_COMMENT':
            return state.filter((comment)=>comment.id === action.id ? {...comment, editing:!comment.editing}:comment);
        default:
            return state;
    }
}
export default commentReducer;