import React, { useState } from "react";
import { login, demoUser } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const isDisabled = () => {
    if (email === '' || password === ''){
      return true
    }else return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  const handleClick = async (e) => {
		e.preventDefault();
		dispatch(demoUser());
		closeModal();
	}

  return (
    <div className="login-form-wrapper">
      <div className="login-form-nav">
        <div className="login-form-signup-title">
          <OpenModalButton
            buttonText={"Sign Up"}
            modalComponent={<SignupFormModal />}
          />
          </div>
          <div className="login-form-login-title">
            <h2>Log In</h2>
          </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error.split(' : ')[1]}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="button-interface">
        <a className="demo-user" onClick={handleClick}>Demo User</a>
        <button className={isDisabled() ? 'disabledsubmit' : 'submit'} type="submit" disabled={isDisabled()}>Log In</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
