import { createBrowserRouter } from "react-router";
import MainLayout from "../mainlayout/MainLayout";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Home from "../pages/Home/Home";
import DashboardLayout from "../dashboardlayout/DashboardLayout";
import ManageProducts from "../dashboard/Admin/ManageProducts";
import ManageUsers from "../dashboard/Admin/ManageUsers";
import ManageOrders from "../dashboard/Admin/ManageOrders";
import MyOrders from "../dashboard/User/MyOrders";
import ProductDetailsPage from "../pages/productDetailsPage/ProductDetailsPage";
import CartPage from "../components/Cart/CartPage";
import AdminRoute from "../route/AdminRoute";
import PrivateRoute from "../route/PrivateRoute";
import Shipping from "../pages/shipping/Shipping";
import products from "../pages/Products/Products";
import ErrorPage from "../errorpage/ErrorPage";
import DefaultDashboard from "../defaultDashboard/DefaultDashboard";


const router = createBrowserRouter([
    {
        path: "/",
        errorElement:<ErrorPage/>,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'products',
                Component: products,
                loader: () => fetch('http://localhost:3000/products')

            },
            {
                path: 'products/:id',
                element: <ProductDetailsPage />,
                loader: ({ params }) => fetch(`http://localhost:3000/products/${params.id}`)
            },
            {
                path: 'cart',
                element: <CartPage />

            },
            {
                path:'/shipping',
                element:<Shipping/>
            }

        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                index:true,
                element:<PrivateRoute>
                    <DefaultDashboard/>
                </PrivateRoute>

            },
            {
                path: '/dashboard/manage-products',
                element: <PrivateRoute>
                    <AdminRoute>
                        <ManageProducts />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: '/dashboard/manage-users',
                element: <PrivateRoute>
                    <AdminRoute>
                        <ManageUsers />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: '/dashboard/manage-orders',
                element: <PrivateRoute>
                    <AdminRoute>
                        <ManageOrders />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: '/dashboard/my-orders',
                element: <PrivateRoute>
                    <MyOrders />
                </PrivateRoute>
            },
        ]
    }
]);

export default router;