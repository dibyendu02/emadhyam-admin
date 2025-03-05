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
import { useEffect, useState } from "react";
import { getData, deleteData, putData } from "../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";

export default function User() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("accepted"); // Default active tab to "accepted"
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!auth.token) {
      navigate("/"); // Redirect to login if token is missing
    } else {
      getUsers();
    }
  }, [auth.token, location]);

  useEffect(() => {
    filterUsersByStatus(); // Filter users whenever the tab changes or users are updated
  }, [users, activeTab]);

  // Fetch users from the API
  const getUsers = async () => {
    if (!auth.token) return;
    try {
      const response = await getData("/api/retailer", auth.token);
      setUsers(response?.retailers || []);
    } catch (err: any) {
      console.log("Error fetching users:", err);
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    }
  };

  // Filter users based on application status
  const filterUsersByStatus = () => {
    const filtered = users.filter(
      (user) => user.applicationStatus === activeTab
    );
    setFilteredUsers(filtered);
  };

  // Update user application status
  const updateUserStatus = async (userId: string, status: string) => {
    if (!auth.token) return;

    try {
      await putData(
        `/api/retailer/${userId}`,
        { applicationStatus: status },
        auth.token,
        null
      );
      getUsers(); // Refresh the user list after updating the status
    } catch (err) {
      console.log("Error updating user status:", err);
    }
  };

  // Handle delete user
  const handleDelete = async (userId: string) => {
    if (!auth.token) return;
    if (!window.confirm("Are you sure you want to delete this retailer?"))
      return;

    try {
      await deleteData(`/api/retailer/${userId}`, auth.token);
      getUsers(); // Refresh the user list
    } catch (err) {
      console.log("Error deleting retailer:", err);
    }
  };

  // Handle view more information in the modal
  const handleViewMore = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
                  Retailers
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
                  {users?.length}
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
                  <TableHead>Tax ID</TableHead>
                  <TableHead>Company Document</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user: any) => (
                  <TableRow key={user?._id}>
                    <TableCell>{user?.companyName}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{`${user?.firstName} ${user?.lastName}`}</TableCell>
                    <TableCell>{user?.taxId}</TableCell>
                    <TableCell>
                      <a
                        href={user?.businessFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Document
                      </a>
                    </TableCell>
                    {/* <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user?.applicationStatus === "accepted"
                            ? "bg-green-200 text-green-800"
                            : user?.applicationStatus === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {user?.applicationStatus}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user?.applicationStatus === "pending" && (
                          <>
                            <Button
                              color="green"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateUserStatus(user._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              color="red"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateUserStatus(user._id, "rejected")
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
                          onClick={() => handleViewMore(user)}
                        >
                          View More
                        </Button>
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user._id)}
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
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Retailer Details</h3>
            <img
              src={selectedUser?.userImg}
              alt=""
              className="w-20 h-20 rounded-full object-cover"
            />
            <p>
              <strong>Company Name: </strong>
              {selectedUser?.companyName}
            </p>
            <p>
              <strong>Email: </strong>
              {selectedUser?.email}
            </p>
            <p>
              <strong>Full Name: </strong>
              {`${selectedUser?.firstName} ${selectedUser?.lastName}`}
            </p>
            <p>
              <strong>Phone Number: </strong>
              {selectedUser?.phoneNumber}
            </p>
            <p>
              <strong>Tax ID: </strong>
              {selectedUser?.taxId}
            </p>
            <p>
              <strong>Years in Business: </strong>
              {selectedUser?.yearsBusiness}
            </p>
            <p>
              <strong>Business Document: </strong>
              <a
                href={selectedUser?.businessFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
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
