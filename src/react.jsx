import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class Page extends React.Component{
    render(){
        return(
            // <Router>
            <New_User_Form/>
            // </Router>
        )
    }
}


class LoginForm extends React.Component{
    constructor(props){
        super(props)
        this.loginCheck = this.loginCheck.bind(this)
    }
    loginCheck(e){
        e.preventDefault();
        var loginform = document.forms.loginform;
        var submittedData = {
            "username" : loginform.user.value,
            "password" : loginform.password.value
        }
        fetch('/loginCredentials',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(submittedData)
        }).then(res=> res.json())
        .then(data=>{console.log(data)})
        .catch((err)=>{
            console.log(err)
        })
    }
    render(){
        return(
            <form onSubmit={this.loginCheck} name="loginform">
            <input type="text" name="user" placeholder="Username"></input>
            <input type="password" name="password" placeholder="password"></input>
            <button type="Submit">Login</button>
            </form>
        )
    }
}


class New_User_Form extends React.Component{
    constructor(props){
        super(props)
        this.createUser = this.createUser.bind(this);
    }
    createUser(e){
        e.preventDefault();
        var userform = document.forms.userform
        var submittedData = {
            "username" : userform.user.value,
            "password" : userform.password.value
        }
        fetch('/newuser',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(submittedData)
        }).then(res=> res.json())
        .then(data=>{console.log(data)})
        .catch((err)=>{
            console.log(err)
        })
    }
    render(){
        return(
            <form onSubmit={this.createUser} name="userform">
            <input type="text" name="user" placeholder="Username" required="true"></input>
            <input type="password" name="password" placeholder="password" required="true"></input>
            <button type="Submit">Create New Id</button>
            </form>
            )
    }
}



const root = ReactDOM.createRoot(document.getElementById("contents"));
root.render(<Page/>)