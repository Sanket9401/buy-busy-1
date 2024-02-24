import { useProductValue } from "../../context/globalContext";
import styles from "./style.module.css";

export default function MyOrders() {
  const { orders } = useProductValue();

  if (orders.length === 0) {
    return <h1>You don't have any orders yet</h1>;
  }

  return (
    <div className={styles.wrapper}>
      <h1>Your Orders</h1>
      {orders.map((order, index) => (
        <div className={styles.orderDetails} key={index}>
          <h2>Ordered On :- {order.date}</h2>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(order).map((item, index) => (
                <tr key={index}>
                  {item.title && (
                    <>
                      <td>{item.title}</td>
                      <td>₹ {item.price}</td>
                      <td>{item.qty} </td>
                      <td>₹ {(item.price * item.qty).toFixed(2)}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  Total Price :- &nbsp;₹ &nbsp;
                  {Object.values(order)
                    .reduce(
                      (total, item) =>
                        item.title ? item.price * item.qty + total : total,
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
