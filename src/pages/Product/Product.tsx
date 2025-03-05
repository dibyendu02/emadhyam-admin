import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getData, postData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import ProductForm from "./ProductForm";

export default function Product() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [plantTypes, setPlantTypes] = useState<string[]>([]);

  const [newProduct, setNewProduct] = useState<any>({
    name: "",
    imageUrls: [],
    category: "",
    season: "",
    color: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPercentage: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const fetchProducts = async () => {
    try {
      const response = await getData("/api/product", auth.token);
      setProducts(response || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getData("/api/category", auth.token);
      console.log(response);
      setCategories(response || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  const fetchColors = async () => {
    try {
      const response = await getData("/api/colortype", auth.token);
      console.log(response);
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

  const handleAddProduct = async () => {
    try {
      await postData("/api/product", newProduct, auth.token, "media");
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
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
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.season}</TableCell>
                    <TableCell>{product.color.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.discountPercentage}%</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleViewMore(product)}
                      >
                        View More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
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
            />
          </div>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Product Details</h3>
            <img
              src={selectedProduct.imageUrls[0]}
              alt={selectedProduct.name}
              className="w-48 h-48 mb-4 object-cover mx-auto rounded"
            />
            <p>
              <strong>Product Name:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category.name}
            </p>
            <p>
              <strong>Season:</strong> {selectedProduct.season}
            </p>
            <p>
              <strong>Color:</strong> {selectedProduct.color.name}
            </p>
            <p>
              <strong>Short Description:</strong>{" "}
              {selectedProduct.shortDescription}
            </p>
            <p>
              <strong>Full Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Price:</strong> ${selectedProduct.price}
            </p>
            <p>
              <strong>Original Price:</strong> ${selectedProduct.originalPrice}
            </p>
            <p>
              <strong>Discount:</strong> {selectedProduct.discountPercentage}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
