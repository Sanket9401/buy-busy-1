import React, { useState } from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthValue } from "../../context/globalContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLogging, setIsLogging] = useState(false);
  const { setUser } = useAuthValue();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    await signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((user) => {
        console.log("success", user);
        toast.success("Successfully Signed In!!!");
        setUser(user.user);
        setIsLogging(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error("Invalid Credentials!!!");
        setIsLogging(false);
        console.log("error while signin", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1>Sign In</h1>
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
      {isLogging ? <Spinner /> : <button type="submit">Sign In</button>}
      <p>
        <Link to="/sign-up">Or Sign Up instead</Link>
      </p>
    </form>
  );
};
