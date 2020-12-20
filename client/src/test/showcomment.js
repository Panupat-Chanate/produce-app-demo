import React, {Component} from 'react';
import {connect} from 'react-redux'
import Comment from './comment'
import ComponentEdit from './componentEdit'

class ShowComment extends Component {
    render(){
        return(
            <div>
                <h1>Show AllComment</h1>
                {/* {this.props.comments.map((comment) => <Comment key={comment.id} comment={comment} />)} */}
                {this.props.comments.map((comment) => (
                    <tr key={comment.id}>
                        <h2>{comment.name}</h2>
                    </tr>
                ))}
                {console.log(this.props.comments)}
            </div>
        )
    }
}
const mapStateToPropps = (state) => {
    return {
        comments: state
    }
}
export default connect(mapStateToPropps)(ShowComment);

// import React, {Component} from 'react';
// import {connect} from 'react-redux'
// import Comment from './comment'
// import ComponentEdit from './componentEdit'

// class ShowComment extends Component {
//     render(){
//         return(
//             <div>
//                 <h1>Show AllComment</h1>
//                 {this.props.comments.map((comment) => (
//                     <div key={comment.id}>
//                         {comment.editing?
//                             <ComponentEdit key={comment.id} comment={comment} /> :
//                             <Comment key={comment.id} comment={comment} />
//                         }
//                     </div>
//                 ))}
//             </div>
//         )
//     }
// }
// const mapStateToPropps = (state) => {
//     return {
//         comments: state
//     }
// }
// export default connect(mapStateToPropps)(ShowComment);