import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: 'rating' }));
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopEase
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </Link>
              <Link to="/products?category=electronics" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300', link: '/products?category=electronics' },
              { name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300', link: '/products?category=clothing' },
              { name: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', link: '/products?category=home' },
              { name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', link: '/products?category=sports' },
            ].map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Products
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.numReviews})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                        <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors">
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShopEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Browse and purchase products with our intuitive and user-friendly interface.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                We carefully curate our products to ensure the highest quality and customer satisfaction.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
