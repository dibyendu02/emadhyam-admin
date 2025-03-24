import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getData, postData, putData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import ToastContainer, { useToast } from "@/components/toast/ToastContainer";

// Banner types
type BannerType = "main" | "offer";

interface Banner {
  _id: string;
  type: BannerType;
  description: string;
  imageUrl: string;
}

// Component for a single banner form
const BannerForm = ({
  type,
  title,
  initialData,
  onSave,
  isUploading,
  addToast,
}: {
  type: BannerType;
  title: string;
  initialData: Banner | null;
  onSave: (formData: FormData) => void;
  isUploading: boolean;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || "");
      setPreviewUrl(initialData.imageUrl || "");
    }
  }, [initialData]);

  const validateFileSize = (file: File): boolean => {
    // 10MB in bytes (10 * 1024 * 1024)
    const MAX_FILE_SIZE = 10485760;

    if (file.size > MAX_FILE_SIZE) {
      addToast("File size too large. Maximum size is 10MB", "error");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size
      if (!validateFileSize(selectedFile)) {
        // Reset the input
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!description) {
      addToast("Please enter a description", "error");
      return;
    }

    if (!initialData && !file) {
      addToast("Please select an image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    if (file) formData.append("file", file);

    onSave(formData);
  };

  // Format bytes to a readable string (e.g., "5 MB", "900 KB")
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {previewUrl && (
            <div className="border rounded overflow-hidden h-64 bg-gray-100 mb-4">
              <img
                src={previewUrl}
                alt={title}
                className="object-contain w-full h-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Maximum file size: 10MB. Recommended formats: JPG, PNG
              </p>
              {file && (
                <p className="text-xs text-green-600 mt-1">
                  Selected file: {file.name} ({formatBytes(file.size)})
                </p>
              )}
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading
                ? "Saving..."
                : initialData
                ? "Update Banner"
                : "Create Banner"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Record<BannerType, Banner | null>>({
    main: null,
    offer: null,
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<BannerType, boolean>>({
    main: false,
    offer: false,
  });

  const { toasts, addToast, removeToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    } else {
      fetchBanners();
    }
  }, [auth.token, navigate]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await getData("/api/banner", auth.token);
      const bannersByType: Record<BannerType, Banner | null> = {
        main: null,
        offer: null,
      };

      if (Array.isArray(response)) {
        response.forEach((banner: Banner) => {
          if (banner.type === "main" || banner.type === "offer") {
            bannersByType[banner.type] = banner;
          }
        });
      }

      setBanners(bannersByType);
    } catch (err: any) {
      addToast("Failed to load banners", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (type: BannerType, formData: FormData) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      if (banners[type]) {
        await putData(
          `/api/banner/${banners[type]?._id}`,
          formData,
          auth.token,
          "media"
        );
      } else {
        await postData("/api/banner", formData, auth.token, "media");
      }

      addToast(
        `Banner ${banners[type] ? "updated" : "created"} successfully`,
        "success"
      );
      fetchBanners();
    } catch (err: any) {
      let errorMessage = "Failed to save banner";

      // Check if the error contains a specific message for file size
      if (
        err.response?.data?.error &&
        err.response.data.error.includes("file size")
      ) {
        errorMessage = err.response.data.error;
      } else if (err.message && err.message.includes("file size")) {
        errorMessage = err.message;
      }

      addToast(errorMessage, "error");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-gray-100 px-6">
          <h1 className="text-lg font-semibold">Banner Management</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </header>

        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <main className="flex-1 p-6">
          <Tabs defaultValue="main">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="main">Main Banner</TabsTrigger>
              <TabsTrigger value="offer">Offer Banner</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="pt-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <BannerForm
                  type="main"
                  title="Main Banner"
                  initialData={banners.main}
                  onSave={(formData) => saveBanner("main", formData)}
                  isUploading={uploading.main}
                  addToast={addToast}
                />
              )}
            </TabsContent>

            <TabsContent value="offer" className="pt-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <BannerForm
                  type="offer"
                  title="Offer Banner"
                  initialData={banners.offer}
                  onSave={(formData) => saveBanner("offer", formData)}
                  isUploading={uploading.offer}
                  addToast={addToast}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BannerManagement;
