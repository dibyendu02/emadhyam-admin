import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ProductFormProps {
  onSubmit: (product: any) => void;
  onCancel: () => void;
  categories: any[];
  colors: any[];
  productTypes: any[];
  plantTypes: any[];
  errors?: { [key: string]: string };
  isSubmitting?: boolean;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  categories,
  colors,
  productTypes,
  plantTypes,
  errors = {},
  isSubmitting = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    season: "All",
    color: "",
    shortDescription: "",
    description: "",
    price: "",
    originalPrice: "",
    discountPercentage: "0",
    imageUrls: null as FileList | null,
    productType: "",
    plantType: "",
    isBestseller: false,
    isTrending: false,
    weight: "",
    dimensions: "",
    waterRequirement: "",
    sunlightRequirement: "",
    faqs: [{ question: "", answer: "" }],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (
      name === "price" ||
      name === "originalPrice" ||
      name === "discountPercentage"
    ) {
      // For price fields, allow only numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, imageUrls: e.target.files });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFaqChange = (index: number, field: string, value: string) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Season</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="All">All Seasons</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Color <span className="text-red-500">*</span>
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.color ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color._id} value={color._id}>
                      {color.name}
                    </option>
                  ))}
                </select>
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Type
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select a product type</option>
                  {productTypes.map((type: any) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Plant Type
                </label>
                <select
                  name="plantType"
                  value={formData.plantType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select a plant type</option>
                  {plantTypes.map((type: any) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing and Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Original Price (if discounted)
                </label>
                <input
                  type="text"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter original price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Percentage
                </label>
                <input
                  type="text"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter discount percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Images
                </label>
                <input
                  type="file"
                  name="imageUrls"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  multiple
                  accept="image/*"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isBestseller"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="isBestseller" className="ml-2">
                    Bestseller
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTrending"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="isTrending" className="ml-2">
                    Trending
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows={2}
                placeholder="Enter a short description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Additional Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="E.g., 500g"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="E.g., 10cm x 5cm x 2cm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Water Requirement
              </label>
              <input
                type="text"
                name="waterRequirement"
                value={formData.waterRequirement}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="E.g., Low, Medium, High"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sunlight Requirement
              </label>
              <input
                type="text"
                name="sunlightRequirement"
                value={formData.sunlightRequirement}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="E.g., Full sun, Partial shade, Shade"
              />
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Product FAQs</h3>
              <Button
                type="button"
                onClick={addFaq}
                className="text-xs"
                variant="outline"
              >
                Add FAQ
              </Button>
            </div>

            {formData.faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">FAQ #{index + 1}</h4>
                  {formData.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter question"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={2}
                      placeholder="Enter answer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex justify-end gap-4 border-t">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>

          {/* Display general form error if exists */}
          {errors &&
            Object.keys(errors).length > 0 &&
            !errors.name &&
            !errors.category &&
            !errors.color &&
            !errors.price && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
                <p>Please fix the errors above before submitting the form.</p>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
