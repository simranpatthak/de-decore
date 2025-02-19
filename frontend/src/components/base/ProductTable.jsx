import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../ui/table";
import { Pencil, Trash } from "lucide-react";
import ProductModal from "./ProductModal";
import { fetchProducts, deleteProduct } from "../../store/slices/productSlice";

const ProductTable = () => {
  const dispatch = useDispatch();
  const { list: products, loading, error } = useSelector((state) => state.products);
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-200">
        <TableHead className="bg-gray-100">
  <TableRow>
    <TableHeader className="p-3 text-center whitespace-nowrap border">S.No</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Primary Image</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Product Name</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Description</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Stock</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Discount %</TableHeader>
    <TableHeader className="p-3 text-center whitespace-nowrap border">Actions</TableHeader>
  </TableRow>
</TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">{error}</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">No products found</TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id} className="border-b border-gray-200 text-center">
                  <TableCell className="p-3">{index + 1}</TableCell>
                  <TableCell className="p-3">
                  <TableCell className="p-3">
  <img
    src={product.images?.find((img) => img.isPrimary)?.url || "default.jpg"}
    alt="Product"
    className="w-12 h-12 object-cover rounded border mx-auto"
  />
</TableCell>
                  </TableCell>
                  <TableCell className="p-3 font-medium">{product.name}</TableCell>
                  <TableCell className="p-3">{product.description.split(" ").slice(0, 20).join(" ")}...</TableCell>
                  <TableCell className="p-3">{product.stock}</TableCell>
                  <TableCell className="p-3">{product.discount}%</TableCell>
                  <TableCell className="p-3">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isModalOpen && <ProductModal open={isModalOpen} setOpen={setIsModalOpen} initialData={editProduct} />}
    </div>
  );
};

export default ProductTable;
