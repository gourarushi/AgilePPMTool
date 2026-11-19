import axios from "axios";
import { jwtDecode } from "jwt-decode";
import setJwtToken from "../securityUtils/setJwtToken";

export const registerUser = (newUser, navigate) => async (dispatch) => {
  try {
    await axios.post("/api/users/register", newUser);
    navigate("/login");
    dispatch({
      type: "GET_ERRORS",
      payload: {},
    });
  } catch (err) {
    dispatch({
      type: "GET_ERRORS",
      payload: err.response
        ? err.response.data
        : { message: err.message || "Unable to register user." },
    });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    // post request to the backend API to authenticate the user
    const res = await axios.post("/api/users/login", userData);
    // get a JWT token from res.data
    const { token } = res.data;
    // store the token in localStorage
    localStorage.setItem("jwtToken", token);
    // set our token in header for future requests
    setJwtToken(token);
    // decode the token to get user data
    const decoded = jwtDecode(token.replace(/^Bearer\s+/i, ""));

    // dispatch the user data to the Redux store / SecurityReducer
    dispatch({
      type: "SET_CURRENT_USER",
      payload: decoded,
    });
  } catch (err) {
    dispatch({
      type: "GET_ERRORS",
      payload: err.response
        ? err.response.data
        : { message: err.message || "Unable to login user." },
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  // deletes header
  setJwtToken(false);
  dispatch({
    type: "SET_CURRENT_USER",
    payload: {},
  });
};
