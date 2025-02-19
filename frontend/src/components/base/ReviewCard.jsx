const ReviewCard = ({ review }) => {
    return (
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-80">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{review.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{review.review}</p>
        <div className="mt-3 text-yellow-500">{"⭐".repeat(Math.round(review.rating))}</div>
      </div>
    );
  };
  
  export default ReviewCard;
  