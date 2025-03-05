import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  toggleModal,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upload Content</h2>
          <button
            onClick={toggleModal}
            className="text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
