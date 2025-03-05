import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getData, deleteData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import UploadSubscriberVideoModal from "@/components/UploadSubscriberVideoModal";

export default function SubscriberVideos() {
  const [subscriberVideos, setSubscriberVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  const getSubscriberVideo = async () => {
    try {
      const response = await getData("/api/subscriberVideo", auth.token);
      setSubscriberVideos(response);
      setFilteredVideos(response); // Initialize filteredVideos with all content videos
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSubscriberVideo();
  }, [location]);

  const handleDelete = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await deleteData(`/api/subscriberVideo/${videoId}`, auth.token);
      getSubscriberVideo(); // Refresh content video list
    } catch (err) {
      console.log("Error deleting video:", err);
    }
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);

    if (selectedCategory === "") {
      setFilteredVideos(subscriberVideos); // Reset to all videos
    } else {
      const filtered = subscriberVideos.filter(
        (video: any) => video.category === selectedCategory
      );
      setFilteredVideos(filtered);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <SideNavbar />
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
                  Content Videos
                </CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredVideos?.length}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button className="w-60" onClick={toggleModal}>
              Upload New Content Video
            </Button>
          </div>
          <UploadSubscriberVideoModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            onVideoUploaded={getSubscriberVideo}
          />
          <div className="border shadow-sm rounded-lg">
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700">
                Filter by Category:
              </label>
              <select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                className="mt-2 p-2 border rounded"
              >
                <option value="">All Categories</option>
                <option value="meditation">Meditation</option>
                <option value="education">Education</option>
                <option value="consultancy">Consultancy</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "150px" }}>ID</TableHead>
                  <TableHead style={{ width: "150px" }}>Title</TableHead>
                  <TableHead style={{ width: "300px" }}>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos?.map((content: any) => (
                  <TableRow key={content?._id}>
                    <TableCell>{content?._id}</TableCell>
                    <TableCell>{content?.title}</TableCell>
                    <TableCell>{content?.description}</TableCell>
                    <TableCell>{content?.category}</TableCell>
                    <TableCell>
                      {content?.videoMedia?.resource_type === "video" ? (
                        <video
                          src={content?.videoMedia.secure_url}
                          style={{ width: "150px", height: "100px" }}
                          controls
                        />
                      ) : (
                        <img
                          src={content?.videoMedia.secure_url}
                          alt={content?.title}
                          style={{ width: "150px", height: "100px" }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(content._id)}
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
