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
import { getData, putData, deleteData } from "../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import { Input } from "@/components/ui/input";

export default function User() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [goal, setGoal] = useState("");
  const [zone, setZone] = useState(""); // State for selected zone
  const [filterGoal, setFilterGoal] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // if (!user) {
  //   return <Navigate to="/" />;
  // }

  console.log(user);

  const getUsers = async () => {
    try {
      const response = await getData("/api/user", auth.token);
      const filteredUsers = response?.filter(
        (user: any) => user.isAdmin === false
      );
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, [location]);

  const handleEditModalOpen = (user: any) => {
    setCurrentUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setGoal(user.goal);
    setZone(user.zone); // Set zone from user data
    setIsModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;

    const updatedUser = {
      name,
      email,
      phoneNumber,
      goal,
      zone,
    };

    try {
      await putData(
        `/api/user/${currentUserId}`,
        updatedUser,
        auth.token,
        null
      );
      getUsers(); // Refresh the user list
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.log("Error updating user:", err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteData(`/api/user/${userId}`, auth.token);
      getUsers(); // Refresh the user list
    } catch (err) {
      console.log("Error deleting user:", err);
    }
  };

  const handleGoalFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGoal = e.target.value;
    setFilterGoal(selectedGoal);

    if (selectedGoal === "") {
      setFilteredUsers(users); // Reset to all videos
    } else {
      const filtered = users.filter((user: any) => user.goal === selectedGoal);
      setFilteredUsers(filtered);
    }
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
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="border shadow-sm rounded-lg">
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700">
                Filter by Goal:
              </label>
              <select
                value={filterGoal}
                onChange={handleGoalFilterChange}
                className="mt-2 p-2 border rounded"
              >
                <option value="">All</option>
                <option value="Diabetes">Diabetes</option>
                <option value="IBS Colitis & Crohn's">
                  IBS Colitis & Crohn's
                </option>
                <option value="Mental Depression">Mental Depression</option>
              </select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Zone</TableHead> {/* Added Zone column header */}
                  <TableHead>Daily Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user: any) => (
                  <TableRow key={user?._id}>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{user?.phoneNumber}</TableCell>
                    <TableCell>{user?.goal}</TableCell>
                    <TableCell>{user?.zone}</TableCell> {/* Display zone */}
                    <TableCell>
                      <Button
                        color="blue"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigate(`/userUpdates/${user._id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="blue"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditModalOpen(user)}
                        >
                          Edit
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a goal</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="IBS Colitis & Crohn's">
                    IBS Colitis & Crohn's
                  </option>
                  <option value="Mental Depression">Mental Depression</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Zone
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a zone</option>
                  <option value="Blue">Blue</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Red">Red</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-4">
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
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
