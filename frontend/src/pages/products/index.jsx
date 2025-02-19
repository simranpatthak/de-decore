import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import ProductCard from "../../components/base/ProductCards";
import { fetchProducts } from "../../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { list: products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h2>

      {/* Error Handling */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p className="text-gray-500 text-center">No products available.</p>
        )
      )}
    </div>
  );
};

export default Products;
