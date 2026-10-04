import Home from "./pages/Home";
import Sessions from "./pages/Sessions";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LoginModal from "./components/Modals/LoginModal";

import { ModalProvider } from "./contexts/ModalContext";

import "./styles/variables.css";
import "./styles/global.css";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <ModalProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sessions" element={<Sessions />} />
        </Routes>

        <Footer />

        <LoginModal/>
      </ModalProvider>
    </div>
  );
}

export default App;
