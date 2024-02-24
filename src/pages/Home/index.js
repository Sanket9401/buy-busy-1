import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useAuthValue, useProductValue } from "../../context/globalContext";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export const Home = () => {
  const { user } = useAuthValue();
  const {
    addToCart,
    products,
    isLoading,
    filterMensProducts,
    filterWomensProducts,
    filterJeweleryProducts,
    filterElectronicsProducts,
    filterBySearch,
  } = useProductValue();

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Search By Name"
              onChange={(e) => filterBySearch(e.target.value)}
            />
          </div>
          <div className={styles.productsWrapper}>
            <div className={styles.filterContainer}>
              <aside>
                <p>Category</p>
                <div className={styles.categories}>
                  <div>
                    <input
                      type="checkbox"
                      id="mensClothing"
                      name="mensClothing"
                      onChange={(e) => filterMensProducts(e.target.checked)}
                    />
                    <label htmlFor="mensClothing">Men's Clothing</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="womensClothing"
                      name="womensClothing"
                      onChange={(e) => filterWomensProducts(e.target.checked)}
                    />
                    <label htmlFor="womensClothing">Women's Clothing</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="jewelery"
                      name="jewelery"
                      onChange={(e) => filterJeweleryProducts(e.target.checked)}
                    />
                    <label htmlFor="jewelery">Jewelery</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="electronics"
                      name="electronics"
                      onChange={(e) =>
                        filterElectronicsProducts(e.target.checked)
                      }
                    />
                    <label htmlFor="electronics">Electronics</label>
                  </div>
                </div>
              </aside>
            </div>
            <div className={styles.products}>
              {products.map((product) => (
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
                  <button onClick={() => addToCart(product)}>
                    <Link to={user ? "/" : "sign-in"}>Add To Cart</Link>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
