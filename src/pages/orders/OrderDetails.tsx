import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/ToastContainer";

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => void;
  onDelete: (orderId: string) => void;
}

// Define order status options based on your API
const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const { addToast } = useToast();

  if (!order) return null;

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDelete = () => {
    onDelete(order._id);
    onClose();
  };

  const handleStatusChange = () => {
    if (selectedStatus !== order.status) {
      try {
        onStatusChange(order._id, selectedStatus);
      } catch (error: any) {
        addToast(error.message || "Failed to update order status", "error");
      }
      onClose();
    } else {
      addToast("Please select a different status", "warning");
    }
  };

  // Format date to a more readable form
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get customer name from the order
  const getCustomerName = () => {
    if (order.userId) {
      return `${order.userId.firstName || ""} ${
        order.userId.lastName || ""
      }`.trim();
    }
    return "Unknown";
  };

  // Get customer email
  const getCustomerEmail = () => {
    if (order.userId && order.userId.email) {
      return order.userId.email;
    }
    return "N/A";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
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
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">
              Order #{order._id.slice(-6).toUpperCase()}
            </h2>
            <div className="flex flex-wrap justify-between items-start mt-2">
              <div>
                <p className="text-gray-600">
                  Placed on {formatDate(order.time)}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
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
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <div className="border p-3 rounded">
                <p>
                  <span className="font-medium">Name:</span> {getCustomerName()}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {getCustomerEmail()}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod === "online"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  {order.isPaid ? "Paid" : "Pending"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
              <div className="border p-3 rounded">
                {order.deliveryAddress ? (
                  <>
                    <p>{order.deliveryAddress.addressLine}</p>
                    <p>
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}{" "}
                      {order.deliveryAddress.pinCode}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">
                    No delivery address provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {item.productId && item.productId.imageUrls && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={item.productId.imageUrls[0]}
                                alt={item.productId.name}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.productId
                                ? item.productId.name
                                : "Unknown Product"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Payment Information</h3>
              <div className="border p-3 rounded">
                <p>
                  <span className="font-medium">Billing Amount:</span> ₹
                  {order.paymentInfo?.billingAmount.toFixed(2)}
                </p>
                {order.paymentInfo?.totalSaved > 0 && (
                  <p>
                    <span className="font-medium">Total Saved:</span> ₹
                    {order.paymentInfo.totalSaved.toFixed(2)}
                  </p>
                )}
                {order.razorpayPaymentId && (
                  <p>
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {order.razorpayPaymentId}
                  </p>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-lg font-medium mb-2">Update Order Status</h3>
              <div className="border p-3 rounded space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleStatusChange}
                  disabled={selectedStatus === order.status}
                  className="w-full"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-between border-t pt-4">
            <Button onClick={confirmDelete} variant="destructive">
              Delete Order
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>

          {/* Delete confirmation modal */}
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="mb-6">
                  Are you sure you want to delete Order #
                  {order._id.slice(-6).toUpperCase()}? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={cancelDelete} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
