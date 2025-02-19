import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import ReviewCard from "../../components/base/ReviewCard"
const reviews = [
  { id: 1, name: "John Doe", review: "Amazing quality and fast delivery!", rating: 5 },
  { id: 2, name: "Jane Smith", review: "Absolutely love the designs!", rating: 4.5 },
  { id: 3, name: "Emily Johnson", review: "Best shopping experience ever!", rating: 5 },
];

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
console.log(user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      
      {/* 🌟 Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center h-[500px] bg-cover bg-center" 
        style={{ backgroundImage: "url('/landing.jpeg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold">Elevate Your Home with Style</h1>
          <p className="mt-2 text-lg">Discover premium home décor at unbeatable prices.</p>
          <Link to="/shop" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Shop Now
          </Link>
        </div>
      </section>

      {/* 🏡 About Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">About Us</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We bring you an exclusive range of stylish and elegant home décor items that enhance the beauty of your space. Our collection is curated to blend luxury with affordability.
        </p>
      </section>

      {/* ⭐ Customer Reviews */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Customer Reviews</h2>
        <div className="flex overflow-x-auto gap-6 mt-6 px-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>


    </div>
  );
};

export default Home;
