import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../features/cart/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalPrice, totalItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Please login to view your cart</h2>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <Link to={`/products/${item.product._id}`}>
                  <img
                    src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100'}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.product.brand}
                  </p>
                  <p className="text-primary-600 font-semibold mt-2">
                    ${item.price}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totalPrice > 100 ? 'Free' : '$10.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(totalPrice + (totalPrice > 100 ? 0 : 10) + (totalPrice * 0.1)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full btn-primary text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full btn-secondary text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
