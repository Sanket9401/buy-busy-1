import styles from "./style.module.css";
import Loader from "../../components/Loader";
import { useProductValue } from "../../context/globalContext";
import { useState } from "react";
import add from "../../assets/images/increment.png";
import remove from "../../assets/images/decrement.png";
import { increment } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cartProducts,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    totalPrice,
    yourOrders,
  } = useProductValue();
  console.log("first render");

  if (cartProducts.length === 0) {
    return <h1>Cart Is Empty</h1>;
  }

  const isLoading = false;
  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.productsWrapper}>
            <div className={styles.filterContainer}>
              <aside>
                <span>Total Price: {totalPrice.toFixed()}/-</span>
                <button onClick={() => yourOrders(cartProducts)}>
                  <Link to="/my-orders">Purchase</Link>
                </button>
              </aside>
            </div>
            <div className={styles.products}>
              {cartProducts.map((product) => (
                <div className={styles.product} key={product.id}>
                  <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className={styles.productTitle}>
                    <p>{product.title}</p>
                  </div>
                  <div className={styles.productPrice}>
                    <p>₹{product.price}</p>
                  </div>
                  <span>
                    <img
                      src={add}
                      alt="Increment"
                      onClick={() => {
                        incrementQuantity(product.id);
                      }}
                    />
                    Qty. {product.qty}
                    <img
                      src={remove}
                      alt="Decrement"
                      onClick={() => {
                        decrementQuantity(product.id);
                      }}
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(product.id);
                    }}
                  >
                    Remove From Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
