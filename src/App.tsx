import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import AddItem from "./components/AddItem";
import {AuthenticationComponent} from "./components/AuthenticationComponent";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<AuthenticationComponent />} />
                    <Route path="/item" element={<AddItem />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
