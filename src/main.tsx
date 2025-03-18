import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./redux/store";
import Product from "./pages/Product/Product";

import Order from "./pages/orders/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/products",
    element: <Product />,
  },

  { path: "/orders", element: <Order /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
