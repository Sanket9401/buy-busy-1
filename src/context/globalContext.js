import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../firebase";
import {
  setDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const authContext = createContext();
const productContext = createContext();

export function useAuthValue() {
  const value = useContext(authContext);
  return value;
}

export function useProductValue() {
  const value = useContext(productContext);
  return value;
}

export default function GlobalContext({ children }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      const response = await fetch("https://fakestoreapi.com/products/");
      const data = await response.json();
      console.log(data);
      setProducts(data);
      setAllProducts(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(
        collection(db, `usersCarts/${user.uid}/myCart`),
        (snapShot) => {
          const cartProducts = snapShot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data());
            return { ...doc.data() };
          });
          // console.log(cartProducts, "from real time");
          setCartProducts(cartProducts);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(
        collection(db, `userOrders/${user.uid}/myOrders`),
        (snapShot) => {
          const orders = snapShot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data());
            return { ...doc.data() };
          });
          console.log(orders, "from real time orders");
          setOrders(orders);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    const total = cartProducts.reduce(
      (prev, product) => prev + product.price * product.qty,
      0
    );
    setTotalPrice(total);
  }, [cartProducts]);

  const memoizedProductsData = useMemo(() => allProducts, [allProducts]);

  // const memoizedTotalPrice = useMemo(() => {
  //   const total = cartProducts.reduce(
  //     (prev, product) => product.price + prev,
  //     totalPrice
  //   );
  //   console.log(total);
  // }, [cartProducts]);

  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        toast.success("Logged Out!!!");
        setUser(null);
      })
      .catch((error) => {
        console.log("An error happened.");
      });
  };

  const addToCart = async (product) => {
    if (user) {
      toast.success("Added to cart !!!", {
        autoClose: 300,
      });
      const index = cartProducts.findIndex((item) => item.id === product.id);
      console.log(product.id, "I am");
      if (index === -1) {
        await setDoc(
          doc(
            collection(
              doc(collection(db, `usersCarts`), `${user.uid}`),
              "myCart"
            ),
            product.id.toString()
          ),
          {
            ...product,
            qty: 1,
          }
        );
        // setCartProducts([...cartProducts, { ...product, qty: 1 }]);
      } else {
        const temp = cartProducts[index];
        temp.qty++;
        console.log(temp, "temp");
        await setDoc(
          doc(
            collection(
              doc(collection(db, `usersCarts`), `${user.uid}`),
              "myCart"
            ),
            product.id.toString()
          ),
          temp
        );
        // cartProducts[index].qty++;
        // setCartProducts(cartProducts);
      }
    }
    // console.log(cartProducts);
  };

  const removeFromCart = async (productId) => {
    const index = cartProducts.findIndex((item) => item.id === productId);
    // cartProducts.splice(index, 1);
    // setCartProducts([...cartProducts]);
    await deleteDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user.uid}`), "myCart"),
        productId.toString()
      )
    );
    // console.log("product removed, cartProducts :", cartProducts);
  };

  const incrementQuantity = async (productId) => {
    const index = cartProducts.findIndex((item) => item.id === productId);
    const temp = cartProducts[index];
    temp.qty++;
    console.log(temp, "temp");
    await setDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user.uid}`), "myCart"),
        productId.toString()
      ),
      temp
    );
    // cartProducts[index].qty++;
    // setCartProducts([...cartProducts]);
  };

  const decrementQuantity = async (productId) => {
    const index = cartProducts.findIndex((item) => item.id === productId);
    const temp = cartProducts[index];
    if (temp.qty === 1) {
      removeFromCart(productId);
      return;
    }
    temp.qty--;
    // console.log(temp, "temp");
    await setDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user.uid}`), "myCart"),
        productId.toString()
      ),
      temp
    );
    // cartProducts[index].qty--;
    // setCartProducts([...cartProducts]);
  };

  const filterMensProducts = (isSelected) => {
    console.log(isSelected);
    if (isSelected) {
      const filteredData = allProducts.filter(
        (product) => product.category === "men's clothing"
      );
      {
        products.length === allProducts.length
          ? setProducts([...filteredData])
          : setProducts([...products, ...filteredData]);
      }
    } else {
      const filteredData = products.filter(
        (product) => product.category !== "men's clothing"
      );

      filteredData.length === 0
        ? setProducts(allProducts)
        : setProducts(filteredData);
    }
  };
  const filterWomensProducts = (isSelected) => {
    console.log(isSelected);
    if (isSelected) {
      const filteredData = allProducts.filter(
        (product) => product.category === "women's clothing"
      );
      {
        products.length === allProducts.length
          ? setProducts([...filteredData])
          : setProducts([...products, ...filteredData]);
      }
    } else {
      const filteredData = products.filter(
        (product) => product.category !== "women's clothing"
      );

      filteredData.length === 0
        ? setProducts(allProducts)
        : setProducts(filteredData);
    }
  };
  const filterJeweleryProducts = (isSelected) => {
    console.log(isSelected);
    if (isSelected) {
      const filteredData = allProducts.filter(
        (product) => product.category === "jewelery"
      );
      {
        products.length === allProducts.length
          ? setProducts([...filteredData])
          : setProducts([...products, ...filteredData]);
      }
    } else {
      const filteredData = products.filter(
        (product) => product.category !== "jewelery"
      );

      filteredData.length === 0
        ? setProducts(allProducts)
        : setProducts(filteredData);
    }
  };
  const filterElectronicsProducts = (isSelected) => {
    console.log(isSelected);
    if (isSelected) {
      const filteredData = allProducts.filter(
        (product) => product.category === "electronics"
      );

      products.length === allProducts.length
        ? setProducts([...filteredData])
        : setProducts([...products, ...filteredData]);
    } else {
      const filteredData = products.filter(
        (product) => product.category !== "electronics"
      );

      filteredData.length === 0
        ? setProducts(allProducts)
        : setProducts(filteredData);
    }
  };

  const filterBySearch = (text) => {
    if (text) {
      const filteredData = allProducts.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(filteredData);
    } else {
      setProducts(allProducts);
    }
  };

  const yourOrders = async (products) => {
    toast.success("Purchased!!!");
    setDoc(
      doc(
        collection(doc(collection(db, `userOrders`), `${user.uid}`), "myOrders")
      ),
      {
        ...products,
        date: `${new Date().getFullYear()} - ${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, 0)} - ${new Date().getDate().toString().padStart(2, 0)}`,
      }
    );

    // updateDoc(doc(db, "usersCarts", `${user.uid}`, "myCart"), [])
    //   .then((res) => console.log(cartProducts, "after purchased"))
    //   .catch((err) => console.log(err));

    for (let i = 0; i < cartProducts.length; i++) {
      await deleteDoc(
        doc(db, `usersCarts/${user.uid}/myCart/${cartProducts[i].id}`)
      );
    }

    // await cartProducts.forEach(async (product) => {
    //   console.log("productid", product.id);
    //   await deleteDoc(
    //     doc(
    //       collection(
    //         doc(collection(db, `usersCarts`), `${user.uid}`),
    //         "myCart"
    //       ),
    //       product.id
    //     )
    //   );
    // });
    // setOrders([...orders, { ...products, date: new Date() }]);
    // setCartProducts([]);
  };

  // console.log(orders, "orders from useState");

  return (
    <authContext.Provider value={{ user, setUser, logOut }}>
      <productContext.Provider
        value={{
          products,
          isLoading,
          addToCart,
          cartProducts,
          removeFromCart,
          incrementQuantity,
          decrementQuantity,
          filterMensProducts,
          filterWomensProducts,
          filterJeweleryProducts,
          filterElectronicsProducts,
          filterBySearch,
          totalPrice,
          yourOrders,
          orders,
        }}
      >
        {children}
      </productContext.Provider>
    </authContext.Provider>
  );
}
