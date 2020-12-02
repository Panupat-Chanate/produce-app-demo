import React, {Component} from 'react';
import CommentForm from './test/commentform';
import ShowComment from './test/showcomment';

export default class Apps extends Component {
    render() {
        return(
            <div>
                <CommentForm/>
                <ShowComment/>
            </div>
        )
    }
}