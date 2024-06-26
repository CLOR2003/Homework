import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Home'
import Error from './Error'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/Homework" element={<Home />} />
        <Route path='/Homework/*' element={<Error/>} />
      </Routes>
    </Router>
  );
}

export default App;
