import { Button } from "@/components/ui/button";

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
import { getData, deleteData } from "../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";

export default function RecentApplications() {
  const [applications, setApplications] = useState<any[]>([]); // State to store applications data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null); // Store selected application for modal
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Ensure user is authenticated
  useEffect(() => {
    if (!auth.token) {
      navigate("/"); // Redirect to login if token is missing
    } else {
      getApplications();
    }
  }, [auth.token, location]);

  const getApplications = async () => {
    if (!auth.token) return;
    try {
      const response = await getData("/api/application", auth.token); // Update this endpoint to match your API
      console.log(response);
      setApplications(response || []);
    } catch (err: any) {
      console.log("Error fetching applications:", err);
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!auth.token) return;
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      await deleteData(`/api/application/${applicationId}`, auth.token);
      getApplications(); // Refresh the applications list
    } catch (err) {
      console.log("Error deleting application:", err);
    }
  };

  const handleViewMoreApplication = (application: any) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
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
          {/* Applications Table */}
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((application: any) => (
                  <TableRow key={application?._id}>
                    <TableCell>
                      <Button
                        className=" text-blue-600"
                        color="blue"
                        variant="link"
                        onClick={() =>
                          handleViewMoreApplication(application.retailer)
                        }
                      >
                        {application.retailer?.companyName}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        className=" text-blue-600"
                        color="blue"
                        variant="link"
                        onClick={() =>
                          handleViewMoreApplication(application.supplier)
                        }
                      >
                        {application.supplier?.companyName}
                      </Button>
                    </TableCell>
                    <TableCell>{application?.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDeleteApplication(application._id)
                          }
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
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Application Details</h3>
            <p>
              <strong>Company Name: </strong>
              {selectedApplication?.companyName}
            </p>
            {/* Conditional rendering: Show industry only for supplier */}
            {selectedApplication?.type === "supplier" && (
              <p>
                <strong>Industry: </strong>
                {selectedApplication?.industry}
              </p>
            )}
            <p>
              <strong>Email: </strong>
              {selectedApplication?.email}
            </p>
            <p>
              <strong>Phone: </strong>
              {selectedApplication?.phoneNumber}
            </p>
            <p>
              <strong>Name: </strong>
              {selectedApplication?.firstName +
                " " +
                selectedApplication?.lastName}
            </p>
            <img
              src={selectedApplication?.userImg}
              alt={selectedApplication?.firstName}
              className="w-16 h-16 mt-4 rounded-full object-cover "
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Icons (replace with your icon components)
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
