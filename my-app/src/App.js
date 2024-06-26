import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Home.js'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/Homework" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
