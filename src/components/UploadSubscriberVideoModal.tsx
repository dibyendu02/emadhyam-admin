import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import CustomModal from "@/components/CustomModal";
import { BASE_URL } from "../global/server";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Input } from "./ui/input";

interface UploadContentVideoModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onVideoUploaded: () => void;
}

const UploadSubscriberVideoModal: React.FC<UploadContentVideoModalProps> = ({
  isOpen,
  toggleModal,
  onVideoUploaded,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("meditation");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const auth = useSelector((state: RootState) => state.auth);

  console.log(auth.token);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    setIsUploading(true); // Start uploading
    setError(""); // Clear any previous error

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("file", videoFile);

    try {
      //   const response = await fetch(`${BASE_URL}/api/contentVideo`, {
      //     method: "POST",
      //     headers: {
      //       token: `Bearer ${auth.token}`,
      //     },
      //     body: formData,
      //   });

      await axios.post(`${BASE_URL}/api/subscriberVideo/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${auth.token}`,
        },
      });
      //   if (response?._id) {
      //      // Close the modal after successful submission
      //   } else {
      //     setError("Failed to upload video. Please try again.");
      //   }
      onVideoUploaded();
      toggleModal();
    } catch (error) {
      console.error("Error uploading video", error);
      setError("Error uploading video. Please try again.");
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  return (
    <CustomModal isOpen={isOpen} toggleModal={toggleModal}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full px-4 py-2 mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          >
            <option value="meditation">Meditation</option>
            <option value="education">Education</option>
            <option value="consultancy">Consultancy</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Video File
          </label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUploading}
            className={isUploading ? "bg-gray-400" : ""}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default UploadSubscriberVideoModal;
