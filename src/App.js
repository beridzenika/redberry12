import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import Tickets from "./pages/Tickets";

import LoginModal from "./components/Modals/LoginModal";
import SigninModal from "./components/Modals/SigninModal";

import "./styles/variables.css";
import "./styles/global.css";

import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tickets" element={<Tickets />} />
            </Routes>

            <Footer />

            <LoginModal />
            <SigninModal />
        </div>
    );
}

export default App;
