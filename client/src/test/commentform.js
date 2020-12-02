import React , {Component} from 'react';
import {connect} from 'react-redux'

class CommentForm extends Component {
    handlesubmit=(e)=>{
        e.preventDefault();
        const name = this.getName.value
        const message = this.getMessage.value
        const data = {
            id: new Date(),
            name,
            message
        }
        this.props.dispatch({
            type:'ADD_COMMENT',
            data
        })
    }
    render () {
        return (
            <div>
                <h1>Add Comment</h1>
                <form onSubmit={this.handlesubmit}>
                    <input type='text' ref={(input)=>this.getName = input}></input><p></p>
                    <textarea rows="5" cos="28"  ref={(input)=>this.getMessage = input}></textarea><p></p>
                    <button>Comment</button>
                </form>
            </div>
        )
    }
}
export default connect()(CommentForm);