import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
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

import { storage } from "../../configuration";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BASE_URL, getData } from "../global/server";
import { Input } from "@/components/ui/input";

export default function DietPdf() {
  const [contentPdfs, setContentPdfs] = useState([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = (url: string) => {
    window.open(url, "_blank");
  };

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  const getPdfs = async () => {
    try {
      const response = await getData("/api/dietPdf", auth.token);
      console.log(response);
      setContentPdfs(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const storageRef = ref(storage, `pdfs/${pdfFile?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pdfFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newPdf = {
          title: title,
          description: description,
          url: downloadURL,
        };

        try {
          await fetch(`${BASE_URL}/api/dietPdf`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(newPdf),
          });
          getPdfs(); // Refresh the list of PDFs
          setIsModalOpen(false); // Close the modal
        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      // const desertRef = ref(storage, `pdfs/${fileName}`);
      // await deleteObject(desertRef);
      await fetch(`${BASE_URL}/api/dietPdf/${id}`, {
        method: "DELETE",
        headers: {
          token: `Bearer ${auth.token}`,
        },
      });
      getPdfs(); // Refresh the list of PDFs
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPdfs();
  }, [location]);

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
                <CardTitle className="text-sm font-medium">Diet PDFs</CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentPdfs?.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4 justify-end">
            <Button onClick={() => setIsModalOpen(true)}>Upload PDF</Button>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentPdfs?.map((content: any) => (
                  <TableRow key={content?._id}>
                    <TableCell className="w-[15%]">{content?._id}</TableCell>
                    <TableCell className="w-[30%]">{content?.title}</TableCell>
                    <TableCell className="w-[30%]">
                      {content?.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          size="sm"
                          variant="outline"
                          onClick={() => redirect(content?.url)}
                        >
                          View
                        </Button>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Upload PDF</h2>
            <Input
              className="mb-4"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              className="mb-4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e: any) => setPdfFile(e.target.files[0])}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handlePdfUpload}>Upload</Button>
            </div>
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
