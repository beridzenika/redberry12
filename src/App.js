import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";
import MoviePage from "./pages/MoviePage";

import LoginModal from "./components/Forms/LoginModal";
import SigninModal from "./components/Forms/SigninModal";

import RequireAuth from "./components/RequireAuth/RequireAuth";

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
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route 
                    path="/profile" 
                    element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                    } 
                />
                <Route 
                    path="/tickets" 
                    element={
                        <RequireAuth>
                            <MyTickets />
                        </RequireAuth>
                    } 
                />
            </Routes>

            <Footer />

            <LoginModal />
            <SigninModal />
        </div>
    );
}

export default App;
