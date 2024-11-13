/* eslint-disable react/prop-types */
import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/index.jsx";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";

import Availableaution from "./pages/availableauction/availableauction.jsx";
import Auctions from "./pages/auctions/Auctions.jsx";
import BreederRequest from "./pages/breeder/manage-request/index.jsx";
import BreederDashboard from "./pages/breeder/breeder-dashboard/index.jsx";
import StaffDashboard from "./pages/staff/staff-dashboard/index.jsx";
import StaffResponse from "./pages/staff/manage-response/index.jsx";
import Bidding from "./pages/bidding/Bidding.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import Register from "./pages/LoginPage/Register.jsx";
import CreateAuction from "./pages/staff/manage-auction/index.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AboutUs from "./pages/about/index.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import BidderActivities from "./pages/bidder/activities/index.jsx";
import BidderConfirmImg from "./pages/bidder/confirm-image/index.jsx";
import Profile from "./pages/profile/main-profile/index.jsx";
import Topbar from "./components/scenes/global/topbar.jsx";
import AdminDashboard from "./components/scenes/admin-dashboard/index.jsx";
import Besidebar from "./components/scenes/global/sidebar.jsx";
import SuccessPage from "./pages/success/index.jsx";
import Team from "./components/scenes/team/index.jsx";
import Invoices from "./components/scenes/invoices/index.jsx";
import Form from "./components/scenes/form/index.jsx";
import FailPage from "./pages/fail/index.jsx";
import Wallet from "./pages/wallet/index.jsx";
import AuctionCard from "./pages/ListAuction/AuctionCard.jsx";
import BreederActivities from "./pages/breeder/breeder-activities/index.jsx";
import BreederConfirmImg from "./pages/breeder/confirm-breeder-image/index.jsx";
import Overview from "./components/scenes/overview/index .jsx";
import Pie from "./components/scenes/pie/index.jsx";
import StaffActivities from "./pages/staff/staff-activities/index.jsx";
import StaffConfirm from "./pages/staff/staff-confirm/index.jsx";
import Password from "./pages/profile/password/index.jsx";
import Invoice from "./components/Invoice/Invoice.jsx";
import SidebarLayout from "./components/profileSidebar/index.jsx";
import PrivacyPolicy from "./pages/policy/index.jsx";
import Terms from "./pages/term/index.jsx";
import requestPermissions from "./config/notification.js";
import { useEffect } from "react";
import Transaction from "./components/scenes/transaction/index.jsx";
import Auction from "./components/scenes/auction/index.jsx";
import ConfirmWithdraw from "./pages/staff/manage-withdraw/ConfirmWithdraw.jsx";
// import Calendar from "./components/scenes/calendar/index.jsx";

function AppLayout() {
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <div className="appLayout">
      <Header />
      <div className="contentWrapper">
        <Outlet />
      </div>
      <Footer className="siteFooter" />
    </div>
  );
}

function AppLayout2({ children }) {
  return (
    <div className="appLayout ">
      <Header />
      <div className="contentWrapper ">{children}</div>
      <Footer className="siteFooter" />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="app">
      <Besidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

function ProfileLayout() {
  return (
    <div className="appLayout">
      <Header />
      <div className="contentWrapper">
        <SidebarLayout />
        <Outlet />
      </div>
      <Footer className="siteFooter" />
    </div>
  );
}

function ProfileDetailLayout() {
  return (
    <div className="appLayout">
      <Header />
      <div className="contentWrapper">
        <Outlet />
      </div>
      <Footer className="siteFooter" />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/about", element: <AboutUs /> },
        { path: "/privacy", element: <PrivacyPolicy /> },
        { path: "/terms", element: <Terms /> },
        { path: "/wallet", element: <Wallet /> },
        { path: "/availableaution", element: <Availableaution /> },
        { path: "/AuctionSchedule", element: <AuctionCard /> },
        { path: "/auctions/:auctionId", element: <Auctions /> },
        { path: "/auctions/:auctionId/:roomId", element: <Bidding /> },
        { path: "/invoice", element: <Invoice /> },
      ],
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedRoles={["BIDDER", "STAFF", "BREEDER"]}>
          <ProfileLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Profile /> },
        { path: "password", element: <Password /> },
        { path: "wallet", element: <Wallet /> },
        { path: "bidder-activities", element: <BidderActivities /> },
        { path: "breeder-activities", element: <BreederActivities /> },
        { path: "staff-activities", element: <StaffActivities /> },
      ],
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedRoles={["BIDDER", "STAFF", "BREEDER"]}>
          <ProfileDetailLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "breeder/koi-details/:shippingId",
          element: <BreederConfirmImg />,
        },
        {
          path: "bidder/koi-details/:shippingId",
          element: <BidderConfirmImg />,
        },
        { path: "staff/koi-details/:shippingId", element: <StaffConfirm /> },
      ],
    },
    {
      path: "/wallet",

      element: (
        <>
          <AppLayout2>
            <Wallet />
          </AppLayout2>
        </>
      ),
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/success",
      element: <SuccessPage />,
    },
    {
      path: "/fail",
      element: <FailPage />,
    },
    {
      path: "/breeder-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["BREEDER"]}>
          <BreederDashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "breeder-request",
          element: (
            <ProtectedRoute allowedRoles={["BREEDER"]}>
              <BreederRequest />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/staff-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["STAFF"]}>
          <StaffDashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "staff-request",
          element: (
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffResponse />
            </ProtectedRoute>
          ),
        },
        {
          path: "create-auction",
          element: (
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <CreateAuction />
            </ProtectedRoute>
          ),
        },
        {
          path: "confirm-withdraw", // Thêm route mới cho Confirm Withdraw
          element: (
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <ConfirmWithdraw /> 
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "team", element: <Team /> },
        { path: "transaction", element: <Transaction /> },
        { path: "auction", element: <Auction /> },
        { path: "invoices", element: <Invoices /> },
        { path: "form", element: <Form /> },
        { path: "overview", element: <Overview /> },
        { path: "pie", element: <Pie /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
