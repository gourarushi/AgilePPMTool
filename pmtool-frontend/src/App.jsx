import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { logout } from "./actions/securityActions";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Layout/Header";
import Landing from "./components/Layout/Landing";
import AddProject from "./components/Project/AddProject";
import UpdateProject from "./components/Project/UpdateProject";
import ProjectBoard from "./components/ProjectBoard/ProjectBoard";
import AddProjectTask from "./components/ProjectBoard/ProjectTask/AddProjectTAsk";
import UpdateProjectTask from "./components/ProjectBoard/ProjectTask/UpdateProjectTask";
import Login from "./components/UserManagement/Login";
import Register from "./components/UserManagement/Register";
import SecureRoute from "./securityUtils/SecureRoute";
import setJwtToken from "./securityUtils/setJwtToken";
import store from "./store";

const jwtToken = localStorage.jwtToken;

// set it again because when we reload the page the token vanishes so have to always set it so we don't lose our state when we have valid user
if (jwtToken) {
  setJwtToken(jwtToken);
  const token = jwtToken.replace(/^Bearer\s+/i, "");
  const decoded_jwtToken = jwtDecode(token);
  // dispatch the user data to the Redux store / SecurityReducer
  store.dispatch({
    type: "SET_CURRENT_USER",
    payload: decoded_jwtToken,
  });

  const currentTime = Date.now() / 1000;
  if (decoded_jwtToken.exp < currentTime) {
    // send user to main page(handle logout)
    store.dispatch(logout());
    window.location.href = "/";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Header />
            <Routes>
              {
                // public routes like landing, register, login should be accessible to everyone, so we will not use PrivateRoute for them
              }
              <Route exact path="/" element={<Landing />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />

              {
                // Private routes like dashboard, addProject, updateProject, projectBoard, addProjectTask, updateProjectTask should be accessible only to authenticated users, so we will use PrivateRoute for them
              }
              <Route
                path="/dashboard"
                element={
                  <SecureRoute>
                    <Dashboard />
                  </SecureRoute>
                }
              />
              <Route
                path="/addProject"
                element={
                  <SecureRoute>
                    <AddProject />
                  </SecureRoute>
                }
              />
              <Route
                path="/updateProject/:id"
                element={
                  <SecureRoute>
                    <UpdateProject />
                  </SecureRoute>
                }
              />
              <Route
                path="/projectBoard/:id"
                element={
                  <SecureRoute>
                    <ProjectBoard />
                  </SecureRoute>
                }
              />
              <Route
                path="/addProjectTask/:id"
                element={
                  <SecureRoute>
                    <AddProjectTask />
                  </SecureRoute>
                }
              />
              <Route
                path="/updateProjectTask/:backlog_id/:id"
                element={
                  <SecureRoute>
                    <UpdateProjectTask />
                  </SecureRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
