import React, { useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  categories: Category[];
  colors: Color[];
  productTypes: ProductType[];
  plantTypes: PlantType[];
}

interface ProductFormValues {
  name: string;
  imageFiles: FileList | null;
  imageUrls: string[];
  category: string;
  season: string;
  color: string;
  shortDescription: string;
  description: string;
  rating: number;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  sizeRanges: string[];
  inStock: boolean;
  reviews: number;
  productType: string;
  plantType: string;
  isBestseller: boolean;
  isTrending: boolean;
  weight: string;
  dimensions: string;
  waterRequirement: string;
  sunlightRequirement: string;
  faqs: Array<{ question: string; answer: string }>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  categories = [],
  colors = [],
  productTypes = [],
  plantTypes = [],
}) => {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      imageUrls: initialData?.imageUrls || [],
      imageFiles: null,
      category: initialData?.category || "",
      season: initialData?.season || "All",
      color: initialData?.color || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      rating: initialData?.rating || 0,
      price: initialData?.price || 0,
      originalPrice: initialData?.originalPrice || 0,
      discountPercentage: initialData?.discountPercentage || 0,
      sizeRanges: initialData?.sizeRanges || [""],
      inStock: initialData?.inStock ?? true,
      reviews: initialData?.reviews || 0,
      productType: initialData?.productType || "",
      plantType: initialData?.plantType || "",
      isBestseller: initialData?.isBestseller || false,
      isTrending: initialData?.isTrending || false,
      weight: initialData?.weight || "",
      dimensions: initialData?.dimensions || "",
      waterRequirement: initialData?.waterRequirement || "",
      sunlightRequirement: initialData?.sunlightRequirement || "",
      faqs: initialData?.faqs || [{ question: "", answer: "" }],
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const handleFormSubmit = (data: ProductFormValues) => {
    const formData = new FormData();

    // Append all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "imageFiles" && data.imageFiles) {
        Array.from(data.imageFiles).forEach((file) => {
          formData.append("images", file);
        });
      } else if (key === "faqs") {
        formData.append("faqs", JSON.stringify(value));
      } else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-y-scroll h-[80vh]">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageFiles"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Preview existing images if any */}
              {initialData?.imageUrls && initialData.imageUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {initialData.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Category and Color */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color._id} value={color._id}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Description</h3>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[150px]" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Plant Care Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Plant Care</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="waterRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Requirement</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sunlightRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sunlight Requirement</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Product Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Status</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">In Stock</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isBestseller"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bestseller</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isTrending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Trending</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* FAQs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">FAQs</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                >
                  Add FAQ
                </Button>
              </div>

              {faqFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFaq(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`faqs.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter question" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`faqs.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter answer" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Form Submission Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
