import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import HtmlContent from "./HtmlContent";

interface ProductDetailsProps {
  product: any;
  onClose: () => void;
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!product) return null;

  const handleEdit = () => {
    onEdit(product);
    onClose();
  };

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDelete = () => {
    onDelete(product._id);
    onClose();
  };

  const changeMainImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setModalImageIndex((prevIndex) =>
        prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
      );
    } else {
      setModalImageIndex((prevIndex) =>
        prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Product Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-full aspect-square rounded-lg overflow-hidden border cursor-pointer"
              onClick={() => openImageModal(currentImageIndex)}
            >
              <img
                src={product.imageUrls[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Additional images gallery */}
            {product.imageUrls.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {product.imageUrls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded overflow-hidden border cursor-pointer transition-all duration-200 ${
                      currentImageIndex === index
                        ? "ring-2 ring-blue-500"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => changeMainImage(index)}
                  >
                    <img
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Season:</span>{" "}
                {product.season || "All"}
              </p>

              {/* Only show color if it exists */}
              {product.color && (
                <p>
                  <span className="font-medium">Color:</span>{" "}
                  {product.color.name}
                </p>
              )}

              {/* Only show plant type if it exists */}
              {product.plantType && (
                <p>
                  <span className="font-medium">Plant Type:</span>{" "}
                  {product.plantType.name}
                </p>
              )}

              {product.productType && (
                <p>
                  <span className="font-medium">Product Type:</span>{" "}
                  {product.productType.name}
                </p>
              )}
            </div>

            <div className="flex items-end gap-2 mt-2">
              <span className="text-xl font-bold">₹{product.price}</span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              {product.discountPercentage > 0 && (
                <span className="text-green-600 text-sm font-medium">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestseller && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Best Seller
                </span>
              )}
              {product.isTrending && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  Trending
                </span>
              )}
              {product.inStock ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  In Stock
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Out of Stock
                </span>
              )}
              {product.isCodAvailable !== undefined &&
                (product.isCodAvailable ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    COD Available
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    No COD
                  </span>
                ))}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="mt-2">
                <p className="text-gray-600">{product.shortDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Full Description with Rich Content */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2 border-b pb-2">
            Description
          </h3>
          <div className="prose max-w-none">
            {product.description ? (
              <HtmlContent content={product.description} />
            ) : (
              <p className="text-gray-500 italic">
                No detailed description available.
              </p>
            )}
          </div>
        </div>

        {/* Additional Specifications */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2 border-b pb-2">
            Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.weight && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Weight:</span>
                <span>{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Dimensions:</span>
                <span>{product.dimensions}</span>
              </div>
            )}
            {product.waterRequirement && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Water Requirement:</span>
                <span>{product.waterRequirement}</span>
              </div>
            )}
            {product.sunlightRequirement && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Sunlight Requirement:</span>
                <span>{product.sunlightRequirement}</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Cash on Delivery:</span>
              <span>
                {product.isCodAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2 border-b pb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {product.faqs.map((faq: any, index: number) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium text-gray-900 mb-1">
                    Q: {faq.question}
                  </p>
                  <p className="text-gray-600">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-between border-t pt-4">
          <div className="space-x-2">
            <Button onClick={handleEdit} variant="outline">
              Edit Product
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete Product
            </Button>
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>

        {/* Delete confirmation modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete the product "{product.name}"?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button onClick={cancelDelete} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal for enlarged view */}
        {showImageModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-[80]"
                onClick={closeImageModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Previous button */}
              {product.imageUrls.length > 1 && (
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-[80]"
                  onClick={() => navigateImage("prev")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}

              {/* Next button */}
              {product.imageUrls.length > 1 && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-[80]"
                  onClick={() => navigateImage("next")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {modalImageIndex + 1} / {product.imageUrls.length}
              </div>

              {/* Image */}
              <img
                src={product.imageUrls[modalImageIndex]}
                alt={`${product.name} enlarged view`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
