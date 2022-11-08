import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Cookies from 'universal-cookie'
import { useNavigate, Link } from "react-router-dom"

export default function Menu() {

  let cookies = new Cookies();
  let navigate = useNavigate();

  const logout = () => {
    cookies.remove('name');
    cookies.remove('api_key');
    cookies.remove('is_administrator')
    navigate("/"); 
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Colegio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
              (cookies.get('is_administrator') === "1") && (
                <>
                  <Nav.Link>
                    <Link to="/usuarios" style={{all:'unset'}}>Usuarios</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link style={{all: 'unset'}} to="/cursos">Cursos</Link>
                  </Nav.Link>
                </>
              )
            }
            <NavDropdown title={cookies.get('is_administrator') === "1" ? 'Administrador' : 'Alumno'} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => logout()}>Salir</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
