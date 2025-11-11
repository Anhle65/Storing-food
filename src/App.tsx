import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import AddItem from "./components/AddItem";
import {AuthenticationComponent} from "./components/AuthenticationComponent";
import {ItemInformation} from "./components/ItemInformation";
import {ItemsList} from "./components/ItemsList";
import {EditItem} from "./components/EditItem";
function App() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((err) => {
                    console.error('Service Worker registration failed:', err);
                });
        }
        window.requestPermission();
    }, []);
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<AuthenticationComponent />} />
                    <Route path="/item" element={<AddItem />} />
                    <Route path="/item/:itemId" element={<ItemInformation />} />
                    <Route path="/item/:itemId/edit" element={<EditItem />} />
                    <Route path="/items" element={<ItemsList />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
