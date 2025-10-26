import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import AddItem from "./components/AddItem";
import {AuthenticationComponent} from "./components/AuthenticationComponent";
import {ItemInformation} from "./components/ItemInformation";
import {ItemsList} from "./components/ItemsList";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<AuthenticationComponent />} />
                    <Route path="/item" element={<AddItem />} />
                    <Route path="/item/:itemId" element={<ItemInformation />} />
                    <Route path="/items" element={<ItemsList />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
