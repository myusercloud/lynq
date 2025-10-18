import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, addReview } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add reviews');
      return;
    }
    
    try {
      await dispatch(addReview({ productId: id, reviewData: reviewForm })).unwrap();
      toast.success('Review added successfully');
      setReviewForm({ rating: 5, comment: '' });
      // Refresh product data to show new review
      dispatch(fetchProductById(id));
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Product not found</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/products"
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={currentProduct.images[selectedImage]?.url || 'https://via.placeholder.com/500x500'}
              alt={currentProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(currentProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2">({currentProduct.numReviews} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-primary-600 mb-6">
            ${currentProduct.price}
          </div>

          <p className="text-gray-700 mb-6">{currentProduct.description}</p>

          {/* Features */}
          {currentProduct.features && currentProduct.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {currentProduct.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {currentProduct.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({currentProduct.stock} available)</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={quantity >= currentProduct.stock}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            <button className="btn-outline">
              <Heart size={20} />
            </button>
          </div>

          {/* Specifications */}
          {currentProduct.specifications && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {Object.entries(currentProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {/* Add Review Form */}
        {isAuthenticated && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}
                      className="mr-1"
                    >
                      <Star
                        size={24}
                        className={i < reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
          <div className="space-y-6">
            {currentProduct.reviews.map((review, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{review.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
