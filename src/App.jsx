import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LanguageSwitcher from "./components/i18n/LanguageSwitcher";
import logo from "./logo.png";
import tituloBeirario from "./titulo beirario.png";

const Root = () => {
  return (
    <div className="bg-dark-blue text-white min-h-screen font-sans relative">
      <div
        className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-10"
        style={{ backgroundImage: `url(${logo})`, zIndex: 0 }}
      ></div>
      <div className="relative" style={{ zIndex: 1 }}>
        <header className="p-4 shadow-lg shadow-neon-green/10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex-grow flex justify-center">
              <img
                src={tituloBeirario}
                alt="Fitness Beira Rio Open 2026"
                className="h-12 md:h-16"
              />
            </div>
            <div className="flex-1 flex justify-end">
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
