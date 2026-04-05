import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductCategory from './pages/ProductCategory';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Estimate from './pages/Estimate';
import Brands from './pages/Brands';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;