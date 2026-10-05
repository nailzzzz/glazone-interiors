import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Quote from './pages/Quote';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ServiceDetails from './pages/ServiceDetails';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Admin Pages
import Dashboard from './admin/Dashboard';
import ManageServices from './admin/ManageServices';
import ManageProducts from './admin/ManageProducts';
import ManageProjects from './admin/ManageProjects';
import ManageGallery from './admin/ManageGallery';
import ManageEnquiries from './admin/ManageEnquiries';
import Settings from './admin/Settings';
import Migration from './admin/Migration';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}
          <Route path="/" element={<MainLayout />}>

            <Route index element={<Home />} />

            <Route path="about" element={<About />} />

            <Route path="services" element={<Services />} />

            <Route
              path="services/:slug"
              element={<ServiceDetails />}
            />

            <Route path="products" element={<Products />} />

            <Route path="projects" element={<Projects />} />

            <Route path="gallery" element={<Gallery />} />

            <Route path="contact" element={<Contact />} />

            <Route path="quote" element={<Quote />} />

            <Route path="login" element={<Login />} />

            {/* Privacy & Terms */}
            <Route path="privacy" element={<Privacy />} />

            <Route path="terms" element={<Terms />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Route>


          {/* =========================
              ADMIN PROTECTED ROUTES
          ========================= */}
          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<Dashboard />} />

            <Route
              path="services"
              element={<ManageServices />}
            />

            <Route
              path="products"
              element={<ManageProducts />}
            />

            <Route
              path="projects"
              element={<ManageProjects />}
            />

            <Route
              path="gallery"
              element={<ManageGallery />}
            />

            <Route
              path="enquiries"
              element={<ManageEnquiries />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

            <Route
              path="migration"
              element={<Migration />}
            />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;