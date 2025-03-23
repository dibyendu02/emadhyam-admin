import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getData, deleteData, postData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import ToastContainer, { useToast } from "@/components/toast/ToastContainer";

export default function ProductAttributes() {
  // Common states
  const [loading, setLoading] = useState({
    categories: false,
    colors: false,
    productTypes: false,
    plantTypes: false,
  });
  const [data, setData] = useState({
    categories: [],
    colors: [],
    productTypes: [],
    plantTypes: [],
  });
  const [newInputs, setNewInputs] = useState({
    category: "",
    color: "",
    productType: "",
    plantType: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: "",
    id: "",
    name: "",
  });

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  // Fetch all data when component mounts
  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    } else {
      fetchCategories();
      fetchColors();
      fetchProductTypes();
      fetchPlantTypes();
    }
  }, [auth.token]);

  // API Calls for Categories
  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const response = await getData("/api/category", auth.token);
      setData((prev) => ({ ...prev, categories: response || [] }));
    } catch (err: any) {
      let errorMessage = "Failed to load categories";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const addCategory = async () => {
    if (!newInputs.category.trim()) {
      addToast("Category name cannot be empty", "error");
      return;
    }

    try {
      await postData("/api/category", { name: newInputs.category }, auth.token);
      setNewInputs((prev) => ({ ...prev, category: "" }));
      fetchCategories();
      addToast("Category added successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to add category";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteData(`/api/category/${id}`, auth.token);
      fetchCategories();
      addToast("Category deleted successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to delete category";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  // API Calls for Colors
  const fetchColors = async () => {
    setLoading((prev) => ({ ...prev, colors: true }));
    try {
      const response = await getData("/api/colortype", auth.token);
      setData((prev) => ({ ...prev, colors: response || [] }));
    } catch (err: any) {
      let errorMessage = "Failed to load colors";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading((prev) => ({ ...prev, colors: false }));
    }
  };

  const addColor = async () => {
    if (!newInputs.color.trim()) {
      addToast("Color name cannot be empty", "error");
      return;
    }

    try {
      await postData("/api/colortype", { name: newInputs.color }, auth.token);
      setNewInputs((prev) => ({ ...prev, color: "" }));
      fetchColors();
      addToast("Color added successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to add color";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    }
  };

  const deleteColor = async (id: string) => {
    try {
      await deleteData(`/api/colortype/${id}`, auth.token);
      fetchColors();
      addToast("Color deleted successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to delete color";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  // API Calls for Product Types
  const fetchProductTypes = async () => {
    setLoading((prev) => ({ ...prev, productTypes: true }));
    try {
      const response = await getData("/api/producttype", auth.token);
      setData((prev) => ({ ...prev, productTypes: response || [] }));
    } catch (err: any) {
      let errorMessage = "Failed to load product types";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading((prev) => ({ ...prev, productTypes: false }));
    }
  };

  const addProductType = async () => {
    if (!newInputs.productType.trim()) {
      addToast("Product type name cannot be empty", "error");
      return;
    }

    try {
      await postData(
        "/api/producttype",
        { name: newInputs.productType },
        auth.token
      );
      setNewInputs((prev) => ({ ...prev, productType: "" }));
      fetchProductTypes();
      addToast("Product type added successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to add product type";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    }
  };

  const deleteProductType = async (id: string) => {
    try {
      await deleteData(`/api/producttype/${id}`, auth.token);
      fetchProductTypes();
      addToast("Product type deleted successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to delete product type";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  // API Calls for Plant Types
  const fetchPlantTypes = async () => {
    setLoading((prev) => ({ ...prev, plantTypes: true }));
    try {
      const response = await getData("/api/planttype", auth.token);
      setData((prev) => ({ ...prev, plantTypes: response || [] }));
    } catch (err: any) {
      let errorMessage = "Failed to load plant types";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading((prev) => ({ ...prev, plantTypes: false }));
    }
  };

  const addPlantType = async () => {
    if (!newInputs.plantType.trim()) {
      addToast("Plant type name cannot be empty", "error");
      return;
    }

    try {
      await postData(
        "/api/planttype",
        { name: newInputs.plantType },
        auth.token
      );
      setNewInputs((prev) => ({ ...prev, plantType: "" }));
      fetchPlantTypes();
      addToast("Plant type added successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to add plant type";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    }
  };

  const deletePlantType = async (id: string) => {
    try {
      await deleteData(`/api/planttype/${id}`, auth.token);
      fetchPlantTypes();
      addToast("Plant type deleted successfully", "success");
    } catch (err: any) {
      let errorMessage = "Failed to delete plant type";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      addToast(errorMessage, "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  // Helper functions for managing inputs and confirmations
  const handleInputChange = (field: string, value: string) => {
    setNewInputs((prev) => ({ ...prev, [field]: value }));
  };

  const openDeleteConfirm = (type: string, id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      name,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      type: "",
      id: "",
      name: "",
    });
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirm;

    switch (type) {
      case "category":
        deleteCategory(id);
        break;
      case "color":
        deleteColor(id);
        break;
      case "productType":
        deleteProductType(id);
        break;
      case "plantType":
        deletePlantType(id);
        break;
      default:
        closeDeleteConfirm();
    }
  };

  // UI Components for loading states and empty data
  const TableSkeleton = () => {
    return (
      <>
        {[1, 2, 3].map((_, index) => (
          <TableRow
            key={`skeleton-${index}`}
            className="flex justify-between items-center"
          >
            <TableCell className="w-2/3">
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            </TableCell>
            <TableCell className="text-right">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  const EmptyState = ({ type }: { type: string }) => {
    return (
      <TableCell colSpan={2} className="h-40 text-center w-full">
        <div className="flex flex-col items-center justify-center p-4">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No {type} available
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Add your first {type} using the form above
          </p>
        </div>
      </TableCell>
    );
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" to="#">
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
              className="h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">
              Product Attributes Management
            </h1>
          </div>
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

        {/* Toast container for notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.categories.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.colors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Product Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.productTypes.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Plant Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.plantTypes.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="productTypes">Product Types</TabsTrigger>
              <TabsTrigger value="plantTypes">Plant Types</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Categories Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Enter category name"
                      value={newInputs.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                    />
                    <Button onClick={addCategory}>Add Category</Button>
                  </div>

                  <div className="border shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="flex justify-between">
                          <TableHead className="w-2/3">Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading.categories ? (
                          <TableSkeleton />
                        ) : data.categories.length > 0 ? (
                          data.categories.map((category: any) => (
                            <TableRow
                              key={category._id}
                              className="flex justify-between items-center"
                            >
                              <TableCell className="font-medium w-2/3">
                                {category.name}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteConfirm(
                                      "category",
                                      category._id,
                                      category.name
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="flex justify-between items-center">
                            <EmptyState type="categories" />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Colors Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Enter color name"
                      value={newInputs.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                    />
                    <Button onClick={addColor}>Add Color</Button>
                  </div>

                  <div className="border shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="flex justify-between">
                          <TableHead className="w-2/3">Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading.colors ? (
                          <TableSkeleton />
                        ) : data.colors.length > 0 ? (
                          data.colors.map((color: any) => (
                            <TableRow
                              key={color._id}
                              className="flex justify-between items-center"
                            >
                              <TableCell className="font-medium w-2/3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{
                                      backgroundColor: color.name.toLowerCase(),
                                    }}
                                  ></div>
                                  {color.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteConfirm(
                                      "color",
                                      color._id,
                                      color.name
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="flex justify-between items-center">
                            <EmptyState type="colors" />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Types Tab */}
            <TabsContent value="productTypes">
              <Card>
                <CardHeader>
                  <CardTitle>Product Types Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Enter product type"
                      value={newInputs.productType}
                      onChange={(e) =>
                        handleInputChange("productType", e.target.value)
                      }
                    />
                    <Button onClick={addProductType}>Add Product Type</Button>
                  </div>

                  <div className="border shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="flex justify-between">
                          <TableHead className="w-2/3">Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading.productTypes ? (
                          <TableSkeleton />
                        ) : data.productTypes.length > 0 ? (
                          data.productTypes.map((type: any) => (
                            <TableRow
                              key={type._id}
                              className="flex justify-between items-center"
                            >
                              <TableCell className="font-medium w-2/3">
                                {type.name}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteConfirm(
                                      "productType",
                                      type._id,
                                      type.name
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="flex justify-between items-center">
                            <EmptyState type="product types" />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plant Types Tab */}
            <TabsContent value="plantTypes">
              <Card>
                <CardHeader>
                  <CardTitle>Plant Types Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Enter plant type"
                      value={newInputs.plantType}
                      onChange={(e) =>
                        handleInputChange("plantType", e.target.value)
                      }
                    />
                    <Button onClick={addPlantType}>Add Plant Type</Button>
                  </div>

                  <div className="border shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="flex justify-between">
                          <TableHead className="w-2/3">Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading.plantTypes ? (
                          <TableSkeleton />
                        ) : data.plantTypes.length > 0 ? (
                          data.plantTypes.map((type: any) => (
                            <TableRow
                              key={type._id}
                              className="flex justify-between items-center"
                            >
                              <TableCell className="font-medium w-2/3">
                                {type.name}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteConfirm(
                                      "plantType",
                                      type._id,
                                      type.name
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="flex justify-between items-center">
                            <EmptyState type="plant types" />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteConfirm}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
