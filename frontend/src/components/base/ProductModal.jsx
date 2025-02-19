import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addProduct } from "../../store/slices/productSlice";

const ProductModal = ({ open, setOpen, product }) => {
  const dispatch = useDispatch();
  console.log(product);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    discount: "",
    description: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        discount: product.discount || "",
        description: product.description || "",
        images: product.images || [],
      });
    } else {
      setForm({ name: "", price: "", stock: "", discount: "", description: "", images: [] });
    }
  }, [product]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async () => {
    setErrors({});
    try {
      await dispatch(addProduct(form)).unwrap();
      toast.success("Product added successfully!");
      setOpen(false);
      setForm({ name: "", price: "", stock: "", discount: "", description: "", images: [] });
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error(error.message || "Something went wrong!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="product-modal-description">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Upload Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Input name="price" placeholder="Price" type="number" value={form.price} onChange={handleInputChange} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

          <Input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleInputChange} />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}

          <Input name="discount" placeholder="Discount (%)" type="number" value={form.discount} onChange={handleInputChange} />
          {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}

          <Textarea name="description" placeholder="Product Description" value={form.description} onChange={handleInputChange} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {form.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {form.images.map((image, idx) => {
                const imgUrl = typeof image === "string" ? image : URL.createObjectURL(image);
                return <img key={idx} src={imgUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md" />;
              })}
            </div>
          )}
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (product ? "Updating..." : "Uploading...") : product ? "Update" : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
