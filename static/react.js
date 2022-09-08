const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;

const App = () => React.createElement(
    ReactRouterDOM.HashRouter,
    null,
    React.createElement(Route, { path: "/login", component: LoginPage }),
    React.createElement(Route, { path: "/register", component: RegisterPage }),
    React.createElement(Route, { path: "/", exact: true, component: Page }),
    React.createElement(Route, { path: "/todos", component: Todos })
);

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.doneState = this.doneState.bind(this);
        this.delete = this.delete.bind(this);
    }
    doneState() {
        var done = !this.props.done;
        this.props.changestate({
            text: this.props.text,
            done: done
        });
    }
    delete() {
        this.props.delete({
            text: this.props.text
        });
    }
    render() {
        const done = this.props.done;
        return React.createElement(
            "div",
            { className: "todo" },
            done ? React.createElement(
                "span",
                { className: "doneIndicator doneIndicator-done", title: "mark as not done", onClick: this.doneState },
                "\u2715"
            ) : React.createElement(
                "span",
                { className: "doneIndicator doneIndicator-not-done", title: "mark as done", onClick: this.doneState },
                "\u2713"
            ),
            React.createElement(
                "span",
                { className: `todo-text ${done ? "todo-done" : ""}` },
                this.props.text
            ),
            React.createElement(
                "span",
                { className: "deltodo", onClick: this.delete, title: "delete" },
                "\u2620"
            )
        );
    }
}

class LoggedUserDisplay extends React.Component {
    render() {
        return React.createElement(
            "div",
            { className: "username-display" },
            "User Logged In : ",
            readCookie('username') ? readCookie('username') : 'null'
        );
    }
}

class TodosPage extends React.Component {
    render() {
        return React.createElement("div", null);
    }
}
class TodoDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.doneState = this.doneState.bind(this);
        this.delete = this.delete.bind(this);
    }
    delete(e) {
        this.props.delete({
            text: e.text
        });
    }
    doneState(e) {
        this.props.changestate({
            text: e.text,
            done: e.done
        });
        console.log(e.done);
    }
    render() {
        var data = this.props.data;
        return React.createElement(
            "div",
            { className: "todo-container" },
            data ? this.props.data.map(todo => React.createElement(Todo, { text: todo.text, done: todo.done, "delete": this.delete, changestate: this.doneState })) : ''
        );
    }
}

class TodoFooter extends React.Component {
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(LoginNavigation, null),
            React.createElement(LogoutNavigation, null)
        );
    }
}
class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.state = { todos: [] };
        if (!readCookie('username')) {
            this.state = { todos: [] };
        } else {
            fetch('/getTodos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json()).then(data => {
                this.setState({ todos: data });
            }).catch(err => console.log(err));
        }

        this.addTodo = this.addTodo.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateTodos = this.updateTodos.bind(this);
        this.delete = this.delete.bind(this);
    }
    updateState(done) {
        var copy = this.state.todos;
        var index = copy.findIndex(a => a.text == done.text);
        copy[index].done = done.done;
        this.setState({ todos: copy });
    }

    addTodo(newTodo) {
        var all_todos = this.state.todos;
        var updated_todos = all_todos.push(newTodo);
        this.setState([updated_todos]);
    }
    delete(data) {
        var copy = this.state.todos;
        var index = copy.filter(a => a.text != data.text);
        this.setState({ todos: index });
    }
    updateTodos() {
        var username = readCookie('username');
        var updatedTodos = this.state.todos;
        var data = {
            username: username,
            todos: updatedTodos
        };
        console.log(data);
        fetch('/updateTodos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            alert(data.message);
        }).catch(err => console.log(err));
    }
    render() {
        return React.createElement(
            "div",
            { className: "todos-page" },
            React.createElement(
                "div",
                { className: "heading" },
                "Todos"
            ),
            React.createElement(TodoForm, { newTodo: this.addTodo }),
            React.createElement(
                "button",
                { type: "button", className: "updateTodos", onClick: this.updateTodos },
                "Update Todos"
            ),
            React.createElement(TodoDisplay, { data: this.state.todos, changestate: this.updateState, "delete": this.delete }),
            React.createElement(
                "div",
                { className: "footer" },
                React.createElement(TodoFooter, null),
                React.createElement(LoggedUserDisplay, null)
            )
        );
    }
}

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.todoPost = this.todopost.bind(this);
    }
    todopost(e) {
        e.preventDefault();
        var todoForm = document.forms.todoForm;
        this.props.newTodo({
            text: todoForm.todo.value,
            done: false
        });
    }
    render() {
        return React.createElement(
            "div",
            { className: "todo-form" },
            React.createElement(
                "form",
                { name: "todoForm", onSubmit: this.todoPost },
                React.createElement("input", { type: "text", name: "todo", required: true }),
                React.createElement(
                    "button",
                    { type: "submit" },
                    "Submit"
                )
            )
        );
    }
}

class Welcome extends React.Component {
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                null,
                "WELCOME TO THE APP, GET STARTED"
            )
        );
    }
}

class Page extends React.Component {
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(Welcome, null),
            React.createElement(RegisterNavigation, null),
            React.createElement(LoginNavigation, null),
            React.createElement(LoggedUserDisplay, null),
            React.createElement(TodosPage, null)
        );
    }
}

class Input_username extends React.Component {
    render() {
        return React.createElement("input", { type: "text", name: "username", placeholder: "Enter Your Username", required: true });
    }
}

class Input_password extends React.Component {
    render() {
        return React.createElement("input", { type: "text", name: "password", placeholder: "Enter Your Password", autoComplete: "false", required: true });
    }
}

class LoginNavigation extends React.Component {
    render() {
        return React.createElement(
            "div",
            { className: "navigation-button" },
            React.createElement(
                "a",
                { href: "/#/login" },
                "Login"
            )
        );
    }
}

class RegisterNavigation extends React.Component {
    render() {
        return React.createElement(
            "div",
            { className: "navigation-button" },
            React.createElement(
                "a",
                { href: "#/register" },
                "Register"
            )
        );
    }
}

class LogoutNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }
    logOut(e) {
        e.preventDefault();
        var logout = fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(body => {
            body.status == 200 ? window.location.href = '/#/login' : location.reload();
        }).catch(err => console.log(err));
    }
    render() {
        return React.createElement(
            "div",
            { className: "navigation-button" },
            React.createElement(
                "a",
                { href: "#", onClick: this.logOut },
                "Logout"
            )
        );
    }
}

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.RegisterUser = this.registerUser.bind(this);
    }
    registerUser(e) {
        e.preventDefault();
        var registerForm = document.forms.registerForm;
        const credentials = {
            username: registerForm.username.value,
            password: registerForm.password.value
        };
        var response = '';
        fetch('/newUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(value => value.json()).then(text => {
            response = text.message;
        }).then(() => {
            alert(response);
            location.reload();
        }).catch(err => console.log(err));
    }
    render() {
        return React.createElement(
            "div",
            { className: "intropage" },
            React.createElement(
                "form",
                { onSubmit: this.RegisterUser, name: "registerForm" },
                React.createElement(Input_username, null),
                React.createElement(Input_password, null),
                React.createElement(
                    "button",
                    { type: "submit" },
                    "Register"
                )
            ),
            React.createElement(LoginNavigation, null),
            React.createElement(LogoutNavigation, null),
            React.createElement(LoggedUserDisplay, null),
            React.createElement(TodosPage, null)
        );
    }
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.LoginUser = this.loginUser.bind(this);
    }
    loginUser(e) {
        e.preventDefault();
        var loginForm = document.forms.loginForm;
        const credentials = {
            username: loginForm.username.value,
            password: loginForm.password.value
        };
        var response = '';
        const authres = fetch('/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(value => value.json()).then(text => {
            response = text.message;
            if (text.status === '200') {
                console.log('valid');
                window.location.href = "/#/todos";
            } else {
                alert(response);
            }
        }).catch(err => console.log(err));
    }
    render() {
        return React.createElement(
            "div",
            { className: "intropage" },
            React.createElement(
                "form",
                { onSubmit: this.loginUser, name: "loginForm", className: "form2" },
                React.createElement(Input_username, null),
                React.createElement(Input_password, null),
                React.createElement(
                    "button",
                    { type: "submit" },
                    "Login"
                )
            ),
            React.createElement(RegisterNavigation, null),
            React.createElement(LogoutNavigation, null),
            React.createElement(LoggedUserDisplay, null),
            React.createElement(TodosPage, null)
        );
    }
}

function readCookie(cname) {
    var name = cname + "=";
    var decoded_cookie = document.cookie;
    var carr = decoded_cookie.split(';');
    for (var i = 0; i < carr.length; i++) {
        var c = carr[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const root = ReactDOM.createRoot(document.getElementById("contents"));
root.render(React.createElement(App, null));