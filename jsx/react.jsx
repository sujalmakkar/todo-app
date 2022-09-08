const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;


const App = () => (
    <ReactRouterDOM.HashRouter>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/" exact  component={Page} />
      <Route path="/todos"  component={Todos} />
    </ReactRouterDOM.HashRouter>
  )

class Todo extends React.Component{
    constructor(props){
        super(props)
        this.doneState = this.doneState.bind(this)
        this.delete = this.delete.bind(this)
    }
    doneState(){
        var done = !this.props.done
        this.props.changestate({
            text:this.props.text,
            done:done
        })
    }
    delete(){
        this.props.delete({
            text:this.props.text
        })
    }
    render(){
        const done = this.props.done;
        return(
            <div className="todo">
                { done ?  <span className="doneIndicator doneIndicator-done" title="mark as not done" onClick={this.doneState}>&#10005;</span> : <span className="doneIndicator doneIndicator-not-done" title="mark as done" onClick={this.doneState}>&#10003;</span>}
                <span className={`todo-text ${done ? "todo-done":""}`}>{this.props.text}</span>
                <span className="deltodo" onClick={this.delete} title="delete">&#9760;</span>
            </div>
        )
    }
}

class LoggedUserDisplay extends React.Component{
    render(){
        return(
            <div className="username-display" >
                User Logged In : {readCookie('username')? readCookie('username'): 'null'}
            </div>
        )
    }
}

class TodosPage extends React.Component{
    render(){
        return(
            <div></div>
        )
    }
}
class TodoDisplay extends React.Component{
    constructor(props){
        super(props)
        this.doneState = this.doneState.bind(this)
        this.delete = this.delete.bind(this)
    }
    delete(e){
        this.props.delete({
            text:e.text
        })
    }
    doneState(e){
        this.props.changestate({
            text:e.text,
            done:e.done
        })
        console.log(e.done)
    }
    render(){
        var data = this.props.data
        return(
            <div className="todo-container">
                {data?this.props.data.map(todo=><Todo text={todo.text} done={todo.done} delete={this.delete} changestate={this.doneState}></Todo>):''}
            </div>
        )
    }
}

class TodoFooter extends React.Component{
    render(){
        return(
            <div>
                <LoginNavigation/>
                <LogoutNavigation/>
            </div>
        )
    }
}
class Todos extends React.Component{
    constructor(props){
        super(props)
        this.state = {todos:[]}
        if(!readCookie('username')){
            this.state = {todos:[]}
        }else{
            fetch('/getTodos',{
                method:'POST',
                headers: {'Content-Type':'application/json'},
            }).then(res=>res.json())
            .then(data=>{
                this.setState({todos:data})
            })
            .catch(err=>console.log(err))   
        }


        this.addTodo = this.addTodo.bind(this)
        this.updateState = this.updateState.bind(this)
        this.updateTodos = this.updateTodos.bind(this)
        this.delete = this.delete.bind(this)
    }
    updateState(done){
        var copy = this.state.todos;
        var index = copy.findIndex(a=>a.text==done.text);
        copy[index].done = done.done
        this.setState({todos:copy})
    }

    addTodo(newTodo){
        var all_todos = this.state.todos;
        var updated_todos = all_todos.push(newTodo)
        this.setState([updated_todos])
    }
    delete(data){
        var copy = this.state.todos;
        var index = copy.filter(a=>a.text!=data.text)
        this.setState({todos:index})
    }
    updateTodos(){
        var username = readCookie('username')
        var updatedTodos = this.state.todos
        var data = {
            username:username,
            todos:updatedTodos
        }
        console.log(data)
        fetch('/updateTodos',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
        }).then(res=>res.json())
        .then(data=>{
            alert(data.message)
        })
        .catch(err=>console.log(err))
    }
    render(){
        return(
            <div className="todos-page">
                <div className="heading">Todos</div>
                <TodoForm newTodo={this.addTodo}/>
                <button type="button" className="updateTodos" onClick={this.updateTodos}>Update Todos</button>
                <TodoDisplay data={this.state.todos} changestate={this.updateState} delete={this.delete}/>
                <div className="footer">
                <TodoFooter />
                <LoggedUserDisplay/>
                </div>
            </div>
        )
    }
}

class TodoForm extends React.Component{
    constructor(props){
        super(props)
        this.todoPost = this.todopost.bind(this)
    }
    todopost(e){
        e.preventDefault();
        var todoForm = document.forms.todoForm
        this.props.newTodo({
            text:todoForm.todo.value,
            done:false
        })
    }
    render(){
        return(
            <div className="todo-form">
                <form name="todoForm" onSubmit={this.todoPost}>
                    <input type="text" name="todo" required></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

class Welcome extends React.Component{
    render(){
        return(
            <div>
                <h1>WELCOME TO THE APP, GET STARTED</h1>
            </div>)
    }
}
  
class Page extends React.Component{
    render(){
        return(
            <div>
            <Welcome/>
            <RegisterNavigation/>
            <LoginNavigation/>
            <LoggedUserDisplay/>
            <TodosPage/>
            </div>
        )
    }
}

class Input_username extends React.Component{
    render(){
        return(
            <input type="text" name="username" placeholder="Enter Your Username" required></input>
            )
    }
}


class Input_password extends React.Component{
    render(){
        return(
            <input type="text" name="password" placeholder="Enter Your Password" autoComplete="false" required></input>
            )
    }
}

class LoginNavigation extends React.Component{
    render(){
        return(
            <div className="navigation-button">
                <a href="/#/login">Login</a>
            </div>
        )
    }
}

class RegisterNavigation extends React.Component{
    render(){
        return(
            <div className="navigation-button">
                <a href="#/register">Register</a>
            </div>
        )
    }
}

class LogoutNavigation extends React.Component{
    constructor(props){
        super(props)
        this.logOut = this.logOut.bind(this)
    }
    logOut(e){
        e.preventDefault();
        var logout = fetch('/logout',{
            method:'POST',
            headers:{'Content-Type':'application/json'}
        }).then(res=>res.json()).then(body=>{
            body.status == 200? window.location.href = '/#/login' : location.reload()
        }).catch(err=>console.log(err))

    }
    render(){
        return(
            <div className="navigation-button">
                <a href="#" onClick={this.logOut}>Logout</a>
            </div>
        )
    }
}


class RegisterPage extends React.Component{
    constructor(props){
        super(props)
        this.RegisterUser = this.registerUser.bind(this)
    }
    registerUser(e){
        e.preventDefault();
        var registerForm = document.forms.registerForm;
        const credentials = {
            username:registerForm.username.value,
            password:registerForm.password.value
        }
        var response = '';
        fetch('/newUser',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify(credentials)
        })
        .then(value=>value.json())
        .then(text=>{
            response = text.message;
        }).then(()=>{
            alert(response)
            location.reload();
        })
        .catch(err=>console.log(err))
    }
    render(){
        return(
            <div className = "intropage">
            <form onSubmit={this.RegisterUser} name="registerForm">
                <Input_username/>
                <Input_password/>
                <button type="submit">Register</button>
            </form>
            <LoginNavigation/>
            <LogoutNavigation/>
            <LoggedUserDisplay/>
            <TodosPage/>

            </div>
            )
    }
}


class LoginPage extends React.Component{
    constructor(props){
        super(props)
        this.LoginUser = this.loginUser.bind(this)
    }
    loginUser(e){
        e.preventDefault();
        var loginForm = document.forms.loginForm;
        const credentials = {
            username:loginForm.username.value,
            password:loginForm.password.value
        }
        var response = '';
        const authres = fetch('/authenticate',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify(credentials)
        })
        .then(value=>value.json())
        .then(text=>{
            response = text.message;
            if(text.status === '200'){
                console.log('valid')
                window.location.href = "/#/todos";
            }else{
                alert(response)
            }
        })
        .catch(err=>console.log(err))

    }
    render(){
        return(
            <div className = "intropage">
            <form onSubmit={this.loginUser} name="loginForm" className="form2">
                <Input_username/>
                <Input_password/>
                <button type="submit">Login</button>
            </form>
            <RegisterNavigation/>
            <LogoutNavigation/>
            <LoggedUserDisplay/>
            <TodosPage/>
            </div>      
        )
    }
}


function readCookie(cname) {
    var name = cname + "=";
    var decoded_cookie = document.cookie;
    var carr = decoded_cookie.split(';');
    for(var i=0; i<carr.length;i++){
    var c = carr[i];
    while(c.charAt(0)==' '){
        c=c.substring(1);
    }
    if(c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
     }
     return "";
}

const root = ReactDOM.createRoot(document.getElementById("contents"));
root.render(<App/>)