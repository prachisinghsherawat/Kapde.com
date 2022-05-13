import {Container , NavDropdown , Nav , Navbar} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

export const NavbarIs = () => {

    return(
        <div>

   <Navbar  collapseOnSelect expand="lg" bg="black" variant="dark">
  <Container className="navbar" >
  <Navbar.Brand href="/">KAPDE</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">

      <Nav.Link href="/tops">Tops</Nav.Link>
      <Nav.Link href="/kurtis">Kurtas</Nav.Link>
      <Nav.Link href="/frocks">Frocks</Nav.Link>
      <Nav.Link href="/middis">Middis</Nav.Link>
      <Nav.Link href="/denims">Denims</Nav.Link>
      <Nav.Link href="/jackets">Jackets</Nav.Link>
      
      

      {/* <NavDropdown title="CATEGORIES" id="collasible-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown> */}
    </Nav>
    <Nav>
      <Nav.Link href="#deets"></Nav.Link>
      <Nav.Link eventKey={2} href="#memes">
      </Nav.Link>
      <div className="cartIcon">
        <a href="/cart"><img src="https://thumbs.dreamstime.com/b/shopping-icon-shopping-cart-icon-dark-background-simple-vector-icon-shopping-icon-shopping-cart-icon-dark-background-116659167.jpg" alt="" height="100%" width="100%" /></a>
      </div>
    </Nav>
  </Navbar.Collapse>
  </Container>
  </Navbar>
            
        </div>
    )
}