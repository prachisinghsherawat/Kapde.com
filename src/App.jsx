import logo from './logo.svg';
import './App.css';
import { NavbarIs } from './Components/Navbar/Navbar';
import { AllRoutes } from './AllRoutes/AllRoutes';
import { Footer } from "./Components/Footer/Footer"
// import { useContext } from 'react';
// import { ThemeContext } from './Components/Context/Theme';


function App() {

  // const [{theme}] = useContext(ThemeContext)

  return (
    <div className="App">
      <NavbarIs />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;
