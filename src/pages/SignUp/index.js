import React, { useState } from "react";
import styles from "./style.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthValue } from "../../context/globalContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./spinner";
import { toast } from "react-toastify";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { setUser } = useAuthValue();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setIsSigningUp(true);
    await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("let's GO!!");
        toast.success("Successfully Signed Up!!!");
        setUser(user);
        setIsSigningUp(false);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsSigningUp(false);
        toast.error("Something went wrong!!!");
        console.log(error, "error");
      });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <input type="text" name="name" placeholder="Enter Name" />
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        onChange={handleChange}
      />
      {isSigningUp ? <Spinner /> : <button type="submit">Sign Up</button>}
    </form>
  );
};
