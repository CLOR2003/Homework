import React from 'react';
import {HashRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Home';
import Error from './Error';
import Game from "./GameSet";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tips' element={<Game/>}/>
        <Route path='/*' element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;