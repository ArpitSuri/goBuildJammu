import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Layouts & Helpers
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../helpers/ProtectedRoute";
import Navbar from "../components/NavBar";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAttributes from "./pages/admin/AdminAttributes";
import AdminProducts from "./pages/admin/AdminProducts";
import CategoryPage from "../components/CategoryPage";
import ProductDetail from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Checkout from "../components/Checkout";
import MyOrders from "./pages/MyOrder";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/admin/AdminOrder";
import AdminUsers from "./pages/admin/AdminUsers";
import SupplierPage from "./pages/admin/AdminSuppliers";
import DeliveryPage from "./pages/DeliveryPage";


/**
 * A simple layout that includes the Navbar. 
 * Use <Outlet /> to render the child routes.
 */
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES (WITH NAVBAR) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:id" element={<CategoryPage/>}/>
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders/>}/>
          <Route path ="/orderS/:id" element={<OrderDetails />}/>
        </Route>

        {/* --- ADMIN ROUTES (NO MAIN NAVBAR) --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="categories" element={<AdminCategories />} />
          <Route path="attributes" element={<AdminAttributes />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />}/>
          <Route path="suppliers" element={<SupplierPage />}/>
          <Route path="delivery" element={<DeliveryPage />} />
          
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}