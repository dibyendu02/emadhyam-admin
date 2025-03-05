import { Button } from "@/components/ui/button";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { BASE_URL, getData } from "../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import axios from "axios";

export default function Order() {
  const [orderData, setOrderData] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const user: any = useSelector((state: RootState) => state.auth.user);
  const auth = useSelector((state: RootState) => state.auth);
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  const getOrderData = async () => {
    try {
      const response = await getData("/api/order", auth.token);
      setOrderData(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async () => {
    try {
      const response = await getData("/api/supplement", auth.token);
      setProducts(response);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id: any) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const response = await axios.delete(`${BASE_URL}/api/order/${id}`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      console.log("product deleted successfully");

      // Update your state or re-fetch data if necessary
      getOrderData();
      getProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrderStatus = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/order/${selectedOrder._id}`,
        { status: newStatus },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      console.log("Order updated successfully");

      // Update state or re-fetch data if necessary
      getOrderData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrderData();
    getProducts();
  }, [location]);

  const getProductImage = (productId: any) => {
    const product: any = products.find(
      (product: any) => product._id === productId
    );
    console.log(product);
    console.log(product?.productImg);
    return product?.productImg?.secure_url;
  };

  const getProductName = (productId: any) => {
    const product: any = products.find(
      (product: any) => product._id === productId
    );
    console.log(product);
    console.log(product?.name);
    return product?.name;
  };

  console.log(products);
  console.log(orderData);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" to="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1"></div>
          <Button
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Data
                </CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderData?.length}</div>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  +12 since last month
                </p> */}
              </CardContent>
            </Card>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Products Name</TableHead>

                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData?.map((order: any) => (
                  <TableRow key={order?._id}>
                    <TableCell>{order?._id}</TableCell>
                    <TableCell>
                      {order?.products.map((product: any) => (
                        <h1>{getProductName(product.productId)}</h1>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order?.products.map((product: any) => (
                        <img
                          key={product.productId}
                          src={getProductImage(product.productId)}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                    </TableCell>
                    <TableCell>{order?.amount}</TableCell>
                    <TableCell>{order?.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            deleteProduct(order?._id);
                          }}
                          color="red"
                          size="sm"
                          variant="outline"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Order Status</h2>
            <label className="block mb-2">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={updateOrderStatus}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

// function SearchIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="11" cy="11" r="8" />
//       <path d="m21 21-4.3-4.3" />
//     </svg>
//   );
// }
