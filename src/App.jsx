import logo from './logo.svg';
import './App.css';
import { NavbarIs } from './Components/Navbar/Navbar';
import { AllRoutes } from './AllRoutes/AllRoutes';


function App() {
  return (
    <div className="App">
      <NavbarIs />
      <AllRoutes />
    </div>
  );
}

export default App;
