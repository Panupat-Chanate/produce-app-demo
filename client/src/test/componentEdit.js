import React , {Component} from 'react';
import {connect} from 'react-redux'

class CommentEdit extends Component {
    handlesubmit=(e)=>{
        e.preventDefault();
        const newname = this.getName.value
        const newmessage = this.getMessage.value
        const data = {
            id: new Date(),
            newname,
            newmessage
            // editing: false
        }
    }
    render () {
        return (
            <div>
                <form onSubmit={this.handlesubmit}>
                    <input type='text' ref={(input)=>this.getName = input}></input><p></p>
                    <textarea rows="5" cos="28"  ref={(input)=>this.getMessage = input}></textarea><p></p>
                    <button>Update</button>
                </form>
            </div>
        )
    }
}
export default connect()(CommentEdit);