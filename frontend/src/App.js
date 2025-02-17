import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddQuestionPage from "./pages/AddQuestionPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AddQuestionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
