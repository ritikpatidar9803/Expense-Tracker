import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Guard from './Guard/index';
import { lazy, Suspense } from "react";
import Loader from "./components/Shared/Loader";

const Homepage = lazy(() => import("./components/Home"));
const Signup = lazy(() => import("./components/Home/signup"));
const PageNotFound = lazy(() => import('./components/PageNotFound/index'));
const UserLayout = lazy(() => import("./components/User/Userlayout"));
const ForgotPassword = lazy(() => import("./components/Home/ForgotPassword"));
const Dashboard = lazy(() => import('./components/Shared/Dashboard/index'));
const Report = lazy(() => import("./components/Shared/Report"));
const Transactions = lazy(() => import("./components/Shared/Transactions"));
const AdminLayout = lazy(() => import('./components/Admin/Adminlayout/index'));
const Users = lazy(() => import('./components/Shared/Users/index'));



function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* admin related routes */}
          <Route path="/app/admin"
            element={<Guard endpoint="/api/user/session" role="admin"><AdminLayout /></Guard>}

          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* user related routes */}
          <Route path="/app/user"
            element={<Guard endpoint="/api/user/session" role="user"><UserLayout /></Guard>}

          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
