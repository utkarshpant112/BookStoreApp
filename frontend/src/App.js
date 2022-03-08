import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { useContext } from "react";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EtsyNavbar from "./components/EtsyNavbar";
import ProfilePage from "./pages/ProfilePage";
import CreateShopPage from "./pages/CreateShopPage";
import ShopPage from "./pages/ShopPage";
import MuPurchasesPage from "./pages/MyPurchasesPage";
import LoginModal from "./components/LoginModal";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <EtsyNavbar></EtsyNavbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/createshop" element={<CreateShopPage />} />
              <Route path="/shoppage/:shopname" element={<ShopPage />} />
              <Route path="/search/:name" element={<SearchPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/mypurchases" element={<MuPurchasesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="page-footer">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
