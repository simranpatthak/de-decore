import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const ProductCard = ({ product }) => {
  if (!product) return null;

  // Get the primary image
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  // Truncate description to 10 words
  const truncatedDescription = product.description.split(" ").slice(0, 10).join(" ") + "...";

  // Stock level color coding
  const getStockBadgeColor = (stock) => {
    if (stock < 5) return "bg-red-500 text-white";
    if (stock < 10) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
  };

  return (
    <Card className="w-72 shadow-md rounded-lg overflow-hidden">
      {primaryImage && (
        <img
          src={primaryImage.url} // Assuming `url` contains image path
          alt={product.name}
          className="h-40 w-full object-cover"
        />
      )}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{truncatedDescription}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
          <Badge className={`px-2 py-1 ${getStockBadgeColor(product.stock)}`}>
            {product.stock} in stock
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-center">
        <Button variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
