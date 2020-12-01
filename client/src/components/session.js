// import React,{Component} from 'react';
// import axios from 'axios';
// import { browserHistory } from 'react-router';

// export default class Session extends Component{
//   getSession=() => {
//     axios.get('/checkSession', {withCredentials: true})
//     .then(response => {
//       console.log(response.data)
//       if (response.data) {
//       } else {
//         browserHistory.push("/");
//       }
//     }).catch(error => {
//       console.log(error);
//     });
//   }
//   componentDidMount() {
//     this.getSession();
//   }
//   render(){
//     return(
//     null
//     )
//   }
// }