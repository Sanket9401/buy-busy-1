import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import GlobalContext from "./context/globalContext";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import MyOrders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "my-orders",
          element: (
            <ProtectedRoutes>
              <MyOrders />
            </ProtectedRoutes>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          ),
        },
        { path: "sign-in", element: <SignIn /> },
        { path: "sign-up", element: <SignUp /> },
      ],
    },
  ]);
  return (
    <GlobalContext>
      <ToastContainer className="toast-container" />
      <RouterProvider router={router} />
    </GlobalContext>
  );
}

export default App;
