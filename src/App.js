import Home from "./pages/Home";
import Sessions from "./pages/Sessions";
import Header from "./components/Header";

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
      </Routes>
    </div>
  );
}

export default App;
