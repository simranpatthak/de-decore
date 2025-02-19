import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../store/slices/productSlice";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import { Carousel, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
import { StarIcon } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails: product, loading, error } = useSelector((state) => state.products);
  console.log("Product from Redux:", product);
  
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center">Product not found</p>;

  // Sorting images to show primary first
  const sortedImages = product.images?.sort((a, b) => (b.isPrimary ? 1 : -1));

  return (
    <div className="container mx-auto p-4">
      {/* Image Carousel */}
      <Carousel>
        <CarouselContent>
          {sortedImages?.map((img) => (
            <CarouselItem key={img.id}>
              <img src={img.url} alt="Product" className="w-full h-72 object-cover rounded-xl" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Product Details */}
      <Card className="mt-6 p-6 shadow-lg">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>

        {/* Pricing */}
        <div className="mt-2">
          <span className="text-xl font-semibold">₹{product.price - (product.price * product.discount) / 100}</span>
          <span className="ml-2 text-gray-500 line-through">₹{product.price}</span>
          <span className="ml-2 text-green-500">({product.discount}% OFF)</span>
        </div>

        {/* Stock Status */}
        <p className={`mt-2 font-medium ${product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-yellow-500" : "text-green-500"}`}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>

        {/* Review Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Reviews</h3>
          {product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <Card key={index} className="mb-2 p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} className="text-yellow-500 w-4 h-4" />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Submit Review */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
          <form>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button">
                  <StarIcon className="w-6 h-6 text-gray-400 hover:text-yellow-500" />
                </button>
              ))}
            </div>
            <textarea className="w-full p-2 border rounded mt-2" placeholder="Write your review..."></textarea>
            <Button type="submit" className="mt-2 w-full">Submit Review</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;
