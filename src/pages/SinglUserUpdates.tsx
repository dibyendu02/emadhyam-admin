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
import {
  Link,
  Navigate,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getData, deleteData } from "../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import { format } from "date-fns";
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";

interface Update {
  _id: string;
  userId: string;
  createdAt: string;
  title: string;
  description: string;
  updateImg: { secure_url: string };
}

interface User {
  isAdmin: boolean;
  token: string;
}

interface RootState {
  auth: { user: User | null; token: string };
}

export default function SingleUserUpdates() {
  const [userUpdates, setUserUpdates] = useState<Update[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the 'id' parameter from the URL

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  const getUserUpdates = async () => {
    try {
      const response = await getData(`/api/update/${id}`, auth.token); // Use the 'id' parameter in the API request
      setUserUpdates(response);

      const names: { [key: string]: string } = {};
      for (let update of response) {
        if (update.userId) {
          const name = await getUserName(update.userId, auth.token);
          names[update.userId] = name;
        }
      }
      setUserNames(names);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserName = async (id: string, token: string) => {
    try {
      const response = await getData(`/api/user/find/${id}`, token);
      return response.name; // Assuming the response contains a 'name' field
    } catch (err) {
      console.log(err);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    try {
      await deleteData(`/api/update/${storyId}`, auth.token);
      getUserUpdates(); // Refresh the stories list
    } catch (err) {
      console.log("Error deleting story:", err);
    }
  };

  useEffect(() => {
    getUserUpdates();
  }, [location, id]); // Include 'id' in dependency array to refetch updates when 'id' changes

  const filteredUpdates = userUpdates.filter((update) => {
    const updateDate = new Date(update?.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && updateDate < start) return false;
    if (end && updateDate > end) return false;
    return true;
  });

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
                  User Dialy Updates
                </CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredUpdates?.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border shadow-sm rounded-lg p-4">
            <div className="flex gap-4 mb-4">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
              <Button onClick={getUserUpdates}>Filter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUpdates.map((update) => (
                  <TableRow key={update?._id}>
                    <TableCell>
                      {format(new Date(update?.createdAt), "PPpp")}
                    </TableCell>
                    <TableCell>{userNames[update.userId]}</TableCell>
                    <TableCell>{update?.title}</TableCell>
                    <TableCell>{update?.description}</TableCell>
                    <TableCell
                      onClick={() => {
                        setModalImage(update?.updateImg.secure_url);
                        setShowModal(true);
                      }}
                    >
                      <img
                        src={update?.updateImg.secure_url}
                        alt={update?.title}
                        style={{ width: "150px", height: "100px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(update._id)}
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
      {showModal && (
        <div className="absolute z-10 flex flex-col gap-5 justify-center items-center w-full h-full">
          <div className="w-1/2 h-2/3 flex flex-col items-center justify-center rounded-lg bg-white shadow-xl">
            <div className="w-full px-5 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <IoMdClose size={30} />
              </button>
            </div>

            <img src={modalImage} alt="food" className="w-1/2 h-[80%]" />
          </div>
        </div>
      )}
    </div>
  );
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
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

// function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
