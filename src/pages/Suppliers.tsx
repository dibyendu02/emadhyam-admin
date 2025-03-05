import { useEffect, useState } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getData, deleteData, putData } from "../global/server"; // Import updateData
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("accepted"); // State for active tab
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!auth.token) {
      navigate("/"); // Redirect to login if token is missing
    } else {
      getSuppliers();
    }
  }, [auth.token, location]);

  useEffect(() => {
    filterSuppliersByStatus(); // Filter suppliers based on active tab
  }, [suppliers, activeTab]);

  const getSuppliers = async () => {
    if (!auth.token) return;
    try {
      const response = await getData("/api/supplier", auth.token);
      console.log(response?.suppliers);
      const sortedSuppliers = response?.suppliers?.sort((a: any, b: any) => {
        // Custom sorting logic to show accepted, pending, then rejected
        const statusOrder = ["accepted", "pending", "rejected"];
        return (
          statusOrder.indexOf(a.applicationStatus) -
          statusOrder.indexOf(b.applicationStatus)
        );
      });
      setSuppliers(sortedSuppliers || []);
    } catch (err: any) {
      console.log("Error fetching suppliers:", err);
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    }
  };

  const handleDelete = async (supplierId: string) => {
    if (!auth.token) return;
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;

    try {
      await deleteData(`/api/supplier/${supplierId}`, auth.token);
      getSuppliers(); // Refresh the supplier list
    } catch (err) {
      console.log("Error deleting supplier:", err);
    }
  };

  const handleViewMore = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const updateSupplierStatus = async (supplierId: string, status: string) => {
    if (!auth.token) return;

    try {
      await putData(
        `/api/supplier/${supplierId}`,
        { applicationStatus: status },
        auth.token,
        null
      );
      getSuppliers(); // Refresh the supplier list
    } catch (err) {
      console.log("Error updating supplier status:", err);
    }
  };

  // Filter suppliers based on status
  const filterSuppliersByStatus = () => {
    const filtered = suppliers.filter(
      (supplier) => supplier.applicationStatus === activeTab
    );
    setFilteredSuppliers(filtered);
  };

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
              localStorage.removeItem("userId");
              localStorage.removeItem("authToken");
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="bg-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium text-white">
                  Suppliers
                </CardTitle>
                <Link
                  className="text-sm font-medium underline text-white"
                  to="#"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {suppliers?.length}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Tab Buttons */}
          <div className="flex mb-6 space-x-4 overflow-x-auto">
            {["accepted", "pending", "rejected"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded whitespace-nowrap ${
                  activeTab === status
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setActiveTab(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Industry</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers?.map((supplier: any) => (
                  <TableRow key={supplier?._id}>
                    <TableCell>{supplier?.companyName}</TableCell>
                    <TableCell>{supplier?.email}</TableCell>
                    <TableCell>{`${supplier?.firstName} ${supplier?.lastName}`}</TableCell>
                    <TableCell>{supplier?.phoneNumber}</TableCell>
                    <TableCell>{supplier?.website}</TableCell>
                    <TableCell>{supplier?.industry}</TableCell>
                    {/* <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          supplier?.applicationStatus === "accepted"
                            ? "bg-green-200 text-green-800"
                            : supplier?.applicationStatus === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {supplier?.applicationStatus}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {supplier?.applicationStatus === "pending" && (
                          <>
                            <Button
                              color="green"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateSupplierStatus(supplier._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              color="red"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateSupplierStatus(supplier._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          color="blue"
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewMore(supplier)}
                        >
                          View More
                        </Button>
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(supplier._id)}
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

      {/* Modal for Viewing More Info */}
      {isModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Supplier Details</h3>
            <img
              src={selectedSupplier?.userImg}
              alt="Supplier"
              className="w-20 h-20 rounded-full object-cover"
            />
            <p>
              <strong>Company Name: </strong>
              {selectedSupplier?.companyName}
            </p>
            <p>
              <strong>Email: </strong>
              {selectedSupplier?.email}
            </p>
            <p>
              <strong>Full Name: </strong>
              {`${selectedSupplier?.firstName} ${selectedSupplier?.lastName}`}
            </p>
            <p>
              <strong>Phone Number: </strong>
              {selectedSupplier?.phoneNumber}
            </p>
            <p>
              <strong>Website: </strong>
              {selectedSupplier?.website}
            </p>
            <p>
              <strong>Industry: </strong>
              {selectedSupplier?.industry}
            </p>
            <p>
              <strong>Banner Images: </strong>
              <div className="flex flex-wrap gap-2">
                {selectedSupplier?.bannerImg?.map(
                  (img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Banner ${index + 1}`}
                      className="w-24 h-16 rounded-lg"
                    />
                  )
                )}
              </div>
            </p>
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
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.29 7 12 12.67 20.71 7" />
      <path d="M12 22.76V12.67" />
      <path d="m7.5 4.21 9 5.19" />
      <path d="M7.5 4.21v10.6L3 16" />
      <path d="M21 16l-4.5-1.18V9.4" />
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
