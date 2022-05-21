import logo from './logo.svg';
import './App.css';
import { NavbarIs } from './Components/Navbar/Navbar';
import { AllRoutes } from './AllRoutes/AllRoutes';
// import { useContext } from 'react';
// import { ThemeContext } from './Components/Context/Theme';


function App() {

  // const [{theme}] = useContext(ThemeContext)

  return (
    <div className="App">
      <NavbarIs />
      <AllRoutes />
    </div>
  );
}

export default App;
