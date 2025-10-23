import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddItem from "./AddItem";

function App() {
    return (
        <div className="App">
            <h1>Food Tracker</h1>
            <AddItem />
        </div>
    );
}

export default App;
