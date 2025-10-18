import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories, fetchBrands, setFilters } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Star, ShoppingCart, Filter, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, brands, pagination, filters, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    dispatch(setFilters(params));
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    handleFilterChange('search', search);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Search</h4>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    defaultValue={filters.search}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Brand</h4>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Products</h1>
              <p className="text-gray-600">
                Showing {products.length} of {pagination.totalProducts} products
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center text-primary-600 hover:text-primary-700"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
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
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product._id);
                            }}
                            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handleFilterChange('page', i + 1)}
                        className={`px-3 py-2 border rounded-lg ${
                          pagination.currentPage === i + 1
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
