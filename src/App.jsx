import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LanguageSwitcher from "./components/i18n/LanguageSwitcher";
import logo from "./logo.png";

const Root = () => {
  return (
    <div className="bg-dark-blue text-white min-h-screen font-sans relative">
      <div
        className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-10"
        style={{ backgroundImage: `url(${logo})`, zIndex: 0 }}
      ></div>
      <div className="relative" style={{ zIndex: 1 }}>
        <header className="p-4 shadow-lg shadow-neon-green/10 relative">
          <div className="container mx-auto flex justify-center items-center">
            <h1 className="text-2xl font-bold text-neon-green text-center">
              FITNESS BEIRA RIO OPEN 2026
            </h1>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
