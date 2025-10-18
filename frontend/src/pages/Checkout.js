import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearCurrentOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'United States',
    },
    paymentMethod: 'credit_card',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0]?.url || '',
          quantity: item.quantity,
          price: item.price,
        })),
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.1,
        shippingPrice: totalPrice > 100 ? 0 : 10,
        totalPrice: totalPrice + (totalPrice > 100 ? 0 : 10) + (totalPrice * 0.1),
      };

      await dispatch(createOrder(orderData)).unwrap();
      await dispatch(clearCart()).unwrap();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error);
    }
  };

  const shippingPrice = totalPrice > 100 ? 0 : 10;
  const taxPrice = totalPrice * 0.1;
  const finalTotal = totalPrice + shippingPrice + taxPrice;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="mr-2" />
                Shipping Address
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      value={formData.shippingAddress.state}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.country"
                      value={formData.shippingAddress.country}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                {[
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'stripe', label: 'Stripe' },
                ].map((method) => (
                  <label key={method.value} className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="mr-2" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/60x60'}
                      alt={item.product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
