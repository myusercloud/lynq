# E-Commerce Website

A full-stack e-commerce website built with React frontend and Node.js backend.

## Features

### Frontend (React)
- **Modern UI**: Built with React 18, Tailwind CSS, and Lucide React icons
- **Product Catalog**: Browse products with filtering, search, and pagination
- **Product Details**: Detailed product pages with reviews and specifications
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Login/register with JWT tokens
- **Order Management**: View order history and order details
- **Responsive Design**: Mobile-first design that works on all devices
- **State Management**: Redux Toolkit for global state management

### Backend (Node.js/Express)
- **RESTful API**: Complete API with authentication, products, cart, and orders
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Product Management**: CRUD operations for products with categories and reviews
- **Shopping Cart**: Persistent cart functionality
- **Order Processing**: Complete order management system
- **Admin Features**: Admin dashboard and user management
- **Data Validation**: Express-validator for input validation
- **Error Handling**: Comprehensive error handling middleware

## Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Lucide React
- Axios
- React Hook Form
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcryptjs
- Express Validator
- Multer (for file uploads)
- Stripe (for payments)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   cd backend
   node seed.js
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## Project Structure

```
ecommerce/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js       # Main server file
│   └── seed.js         # Database seeding
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── features/   # Redux slices
│   │   ├── pages/      # Page components
│   │   ├── api/        # API configuration
│   │   └── store/      # Redux store
│   └── package.json
└── package.json        # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/pay` - Update order payment
- `PUT /api/orders/:id/deliver` - Update order delivery (admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update user password

## Features Overview

### Product Management
- Browse products by category, brand, price range
- Search products by name, description, brand
- Sort products by price, rating, newest
- Detailed product pages with images, reviews, specifications
- Product reviews and ratings system

### Shopping Cart
- Add/remove products from cart
- Update quantities
- Persistent cart across sessions
- Real-time cart updates

### Order Management
- Complete checkout process
- Order history and tracking
- Order status updates
- Shipping address management

### User Management
- User registration and authentication
- Profile management
- Admin user management
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or issues, please open an issue on GitHub.
