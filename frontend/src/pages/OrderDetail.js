import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderById } from '../features/orders/orderSlice';
import { Package, Calendar, DollarSign, Truck, MapPin, CreditCard } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Order not found</h2>
        <p className="text-gray-500">The order you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-600">Order #{currentOrder.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2" />
              Order Status
            </h2>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
              </span>
              <div className="text-sm text-gray-600">
                <Calendar className="inline mr-1" size={16} />
                {new Date(currentOrder.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="mr-2" />
              Order Items
            </h2>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || 'https://via.placeholder.com/80x80'}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-primary-600 font-semibold">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" />
              Shipping Address
            </h2>
            <div className="text-gray-700">
              <p>{currentOrder.shippingAddress.street}</p>
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2" />
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${currentOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${currentOrder.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${currentOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${currentOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <CreditCard className="mr-2" />
                Payment Method
              </h3>
              <p className="text-gray-700 capitalize">
                {currentOrder.paymentMethod.replace('_', ' ')}
              </p>
              {currentOrder.isPaid ? (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Paid on {new Date(currentOrder.paidAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-red-600 text-sm mt-2">Not paid</p>
              )}
            </div>

            {/* Delivery Information */}
            {currentOrder.isDelivered && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <p className="text-green-600 text-sm">
                  ✓ Delivered on {new Date(currentOrder.deliveredAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
