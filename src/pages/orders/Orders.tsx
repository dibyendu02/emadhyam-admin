import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getData, deleteData, putData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import OrderDetails from "./OrderDetails";
import ToastContainer, { useToast } from "@/components/toast/ToastContainer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Order() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getData("/api/order", auth.token);
      // Sort orders in reverse order (newest first)
      const sortedOrders = (response || []).sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);

      // Show error toast for fetch failures
      let errorMessage = "Failed to load orders";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteData(`/api/order/${orderId}`, auth.token);
      // Refresh the orders list
      fetchOrders();

      // Show success toast
      addToast("Order was successfully deleted!", "success");
    } catch (err: any) {
      console.error("Error deleting order:", err);

      // Extract error message from the API response
      let errorMessage = "Failed to delete order";

      if (err.response?.data?.message) {
        // If API returns a specific message
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        // Specific handling for 400 Bad Request - likely can't delete non-pending orders
        errorMessage = "Only pending orders can be deleted";
      } else if (err.message) {
        // General error message
        errorMessage = err.message;
      }

      // Show error toast with the extracted message
      addToast(errorMessage, "error", 5000);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await putData(`/api/order/${orderId}`, { status: newStatus }, auth.token);

      // Update local state to reflect the change immediately
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );

      setOrders(updatedOrders);
      applyFilters(updatedOrders, selectedStatuses, paymentFilter);

      // Show success toast
      addToast("Order status was successfully updated!", "success");
    } catch (err: any) {
      console.error("Error updating order status:", err);

      // Extract error message from the API response
      let errorMessage = "Failed to update order status";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Show error toast
      addToast(errorMessage, "error");
    }
  };

  // Handle status filter changes
  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];

      applyFilters(orders, newStatuses, paymentFilter);
      return newStatuses;
    });
  };

  // Handle payment filter changes
  const handlePaymentFilterChange = (value: string) => {
    setPaymentFilter(value);
    applyFilters(orders, selectedStatuses, value);
  };

  // Apply all filters to the orders
  const applyFilters = (
    allOrders: any[],
    statuses: string[],
    paymentStatus: string
  ) => {
    let result = [...allOrders];

    // Apply status filters if any are selected
    if (statuses.length > 0) {
      result = result.filter((order) => statuses.includes(order.status));
    }

    // Apply payment filter
    if (paymentStatus !== "all") {
      if (paymentStatus === "paid") {
        result = result.filter(
          (order) => (order.paymentMethod === "online" && order.isPaid) || false
        );
      } else if (paymentStatus === "unpaid") {
        result = result.filter(
          (order) =>
            (order.paymentMethod === "online" && !order.isPaid) ||
            order.paymentMethod === "cod"
        );
      }
    }

    setFilteredOrders(result);
  };

  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [auth.token]);

  // Format date to a more readable form
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total order value from payment info
  const getOrderTotal = (order: any) => {
    return order.paymentInfo?.billingAmount || 0;
  };

  // Get customer name from the order
  const getCustomerName = (order: any) => {
    if (order.userId) {
      return `${order.userId.firstName || ""} ${
        order.userId.lastName || ""
      }`.trim();
    }
    return "Unknown";
  };

  // Skeleton loader component for table rows
  const TableSkeleton = () => {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  // Empty state component
  const EmptyState = () => {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-80 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No orders available
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedStatuses.length > 0 || paymentFilter !== "all"
                ? "Try changing your filters to see more results"
                : "Orders will appear here once customers place them"}
            </p>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  // Get all unique order statuses from orders
  const orderStatuses = [...new Set(orders.map((order) => order.status))];

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" to="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1"></div>
          <Button
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("authToken");
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout
          </Button>
        </header>

        {/* Toast container for notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Dashboard Card */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders?.filter((order) => order.status === "pending")
                    .length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders?.filter((order) => order.status === "delivered")
                    .length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Status Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Filter by Status</h3>
                <div className="flex flex-wrap gap-3">
                  {orderStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Filter */}
              <div className="w-full md:w-64">
                <h3 className="text-sm font-medium mb-2">Payment Status</h3>
                <Select
                  value={paymentFilter}
                  onValueChange={handlePaymentFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid Only</SelectItem>
                    <SelectItem value="unpaid">Unpaid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeleton />
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>{formatDate(order.time)}</TableCell>
                      <TableCell>{getCustomerName(order)}</TableCell>
                      <TableCell>
                        {order.paymentMethod === "online" ? (
                          <span className="text-green-600 font-medium">
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">
                            COD
                          </span>
                        )}
                      </TableCell>
                      <TableCell>₹{getOrderTotal(order).toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMore(order)}
                          >
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyState />
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteOrder}
        />
      )}
    </div>
  );
}
