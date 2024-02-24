import React from "react";
import styles from "./style.module.css";
import { NavLink, Outlet } from "react-router-dom";
import homeLogo from "../../assets/logo/home.png";
import signInLogo from "../../assets/logo/signIn.png";
import myOrdersLogo from "../../assets/logo/myOrders.png";
import cart from "../../assets/logo/cart.png";
import { useAuthValue } from "../../context/globalContext";
import logOutLogo from "../../assets/logo/logOut.png";

const Navbar = () => {
  const { user, logOut } = useAuthValue();
  return (
    <>
      <div className={styles.wrapper}>
        <NavLink to="/">
          <h3>Busy Buy</h3>
        </NavLink>
        <li className={styles.container}>
          <NavLink to="/">
            <ul>
              <img src={homeLogo} alt="Home" />
              Home
            </ul>
          </NavLink>
          {user ? (
            <>
              <NavLink to="my-orders">
                <ul>
                  <img src={myOrdersLogo} alt="My Orders" />
                  My Orders
                </ul>
              </NavLink>
              <NavLink to="cart">
                <ul>
                  <img src={cart} alt="Cart" />
                  Cart
                </ul>
              </NavLink>
              <NavLink to="/">
                <ul onClick={logOut}>
                  <img src={logOutLogo} alt="LogOut" />
                  Log out
                </ul>
              </NavLink>
            </>
          ) : (
            <NavLink to="sign-in">
              <ul>
                <img src={signInLogo} alt="SignIn" />
                SignIn
              </ul>
            </NavLink>
          )}
        </li>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
