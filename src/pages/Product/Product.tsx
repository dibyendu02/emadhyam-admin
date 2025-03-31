import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getData, postData, putData, deleteData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";

export default function Product() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [plantTypes, setPlantTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getData("/api/product", auth.token);
      setProducts(response || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getData("/api/category", auth.token);
      setCategories(response || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await getData("/api/colortype", auth.token);
      setColors(response || []);
    } catch (err) {
      console.error("Error fetching colors:", err);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await getData("/api/producttype", auth.token);
      setProductTypes(response || []);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  };

  const fetchPlantTypes = async () => {
    try {
      const response = await getData("/api/planttype", auth.token);
      setPlantTypes(response || []);
    } catch (err) {
      console.error("Error fetching plant types:", err);
    }
  };

  const handleViewMore = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: any) => {
    console.log("Editing product with data:", product);

    // Create a deep copy to prevent any reference issues
    const productCopy = JSON.parse(JSON.stringify(product));

    setSelectedProduct(productCopy);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    // Add a small delay before resetting selected product to avoid flicker
    setTimeout(() => {
      setSelectedProduct(null);
      setFormErrors({});
    }, 100);
  };

  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Product name is required";
    }

    if (!formData.category || formData.category === "") {
      errors.category = "Category is required";
    }

    // Remove color validation as it's no longer mandatory

    if (!formData.price || formData.price === "") {
      errors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      errors.price = "Price must be a number";
    }

    return errors;
  };

  const handleAddProduct = async (formData: any) => {
    setFormErrors({});
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const productData = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "imageUrls" && formData[key] instanceof FileList) {
          // Handle file uploads
          for (let i = 0; i < formData[key].length; i++) {
            productData.append("files", formData[key][i]);
          }
        } else if (key === "faqs") {
          // Special handling for FAQs - convert array to JSON string
          const faqsJson = JSON.stringify(formData[key]);
          productData.append("faqs", faqsJson);
        } else if (key !== "imageUrls" && key !== "existingImages") {
          // Add other fields - only add if they have a value
          if (formData[key] !== "" && formData[key] !== null) {
            productData.append(key, formData[key].toString());
          }
        }
      });

      // Make the API call
      await postData("/api/product", productData, auth.token, "media");
      setIsAddModalOpen(false);
      fetchProducts();

      // Show success message
      setActionSuccess({
        type: "add",
        message: "Product was successfully added!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error adding product:", err);
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    setFormErrors({});
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const productData = new FormData();
      const productId = formData._id;

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "imageUrls" && formData[key] instanceof FileList) {
          // Handle file uploads
          for (let i = 0; i < formData[key].length; i++) {
            productData.append("files", formData[key][i]);
          }
        } else if (key === "faqs") {
          // Special handling for FAQs - convert array to JSON string
          const faqsJson = JSON.stringify(formData[key]);
          productData.append("faqs", faqsJson);
        } else if (key === "existingImages") {
          // Handle existing images that may have been modified (some deleted)
          const existingImagesJson = JSON.stringify(formData[key]);
          productData.append("existingImages", existingImagesJson);
        } else if (key !== "imageUrls" && key !== "_id") {
          // Always include the fields even if empty, to allow clearing values
          productData.append(key, formData[key].toString());
        }
      });

      // Make the API call to update
      await putData(
        `/api/product/${productId}`,
        productData,
        auth.token,
        "media"
      );
      setIsEditModalOpen(false);
      fetchProducts();

      // Show success message
      setActionSuccess({
        type: "update",
        message: "Product was successfully updated!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error updating product:", err);
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteData(`/api/product/${productId}`, auth.token);
      fetchProducts();

      // Show success message
      setActionSuccess({
        type: "delete",
        message: "Product was successfully deleted!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleApiError = (err: any) => {
    // Handle validation errors from the server
    if (err.response && err.response.data && err.response.data.details) {
      const serverErrors = err.response.data.details;

      // Map server errors to form fields
      const mappedErrors: { [key: string]: string } = {};
      if (serverErrors.includes("category")) {
        mappedErrors.category = "Invalid category selected";
      }
      if (serverErrors.includes("color")) {
        mappedErrors.color = "Invalid color selected";
      }
      if (serverErrors.includes("name")) {
        mappedErrors.name = "Product name is required";
      }
      if (serverErrors.includes("price")) {
        mappedErrors.price = "Valid price is required";
      }

      setFormErrors(mappedErrors);
    }
  };

  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    } else {
      fetchProducts();
      fetchCategories();
      fetchColors();
      fetchProductTypes();
      fetchPlantTypes();
    }
  }, [auth.token]);

  // Skeleton loader component for table rows
  const TableSkeleton = () => {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            <TableCell>
              <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  // Empty state component
  const EmptyState = () => {
    return (
      <TableRow>
        <TableCell colSpan={8} className="h-80 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No products available
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by adding your first product
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Product</Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
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

        {/* Success message */}
        {actionSuccess && (
          <div
            className={`mx-6 mt-2 p-3 rounded ${
              actionSuccess.type === "delete"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {actionSuccess.message}
          </div>
        )}

        <div className="mt-2 px-5 flex justify-end">
          <Button className="w-40" onClick={() => setIsAddModalOpen(true)}>
            Add Product
          </Button>
        </div>

        <main className="p-6">
          <div className="border shadow-sm rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeleton />
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category?.name || "N/A"}</TableCell>
                      <TableCell>{product.season}</TableCell>
                      <TableCell>{product.color?.name || "N/A"}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.discountPercentage || 0}%</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMore(product)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyState />
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50 dark:bg-black/80 z-50 p-4">
          <div className="w-full max-w-4xl h-[calc(100vh-2rem)] overflow-hidden">
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setIsAddModalOpen(false)}
              categories={categories}
              colors={colors}
              productTypes={productTypes}
              plantTypes={plantTypes}
              errors={formErrors}
              isSubmitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/50 dark:bg-black/80 z-50 p-4">
          <div className="w-full max-w-4xl h-[calc(100vh-2rem)] overflow-hidden">
            <ProductForm
              key={`edit-form-${selectedProduct._id}`} // Add this key prop
              onSubmit={handleUpdateProduct}
              onCancel={closeEditModal}
              categories={categories}
              colors={colors}
              productTypes={productTypes}
              plantTypes={plantTypes}
              errors={formErrors}
              isSubmitting={submitting}
              initialData={selectedProduct}
              isEditMode={true}
            />
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={closeModal}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}
