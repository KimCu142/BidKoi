import { RouterProvider, useNavigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Login from "./components/LoginPage/Login";
import Register from "./components/LoginPage/Register";
import HomePage from "./components/pages/home/index.jsx"
import Header from "./components/header/index.jsx"
import Footer from "./components/footer/index.jsx";
import Profile from "./components/pages/profile/index.jsx";
import KoiLogo from "./components/logo/koi_logo.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      
      element: 
      <>
      <Header/>
      <HomePage/>,
      <Footer/>
      </>
    },
    {
      path: "/profile",
      
      element: 
      <>
      <Header/>
      <Profile/>,
      <Footer/>
      </>
    },
   
    {
      path: "/Login",
      element: <Login/>,
    },
    {
      path: "/Register",
      element: <Register />,
    },
  ]);

  return (<RouterProvider router={router} />
   
  );
}

export default App;
