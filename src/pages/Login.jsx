import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Login() {

  const cookies = new Cookies();
  let navigate = useNavigate();

  // Validar la sesión
  useEffect(() => {
    if(cookies.get('name')) {
      navigate('/home');
    }
  }, []);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // Función para loguearme en el sistema
  const fnLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/api/login', {
      'email': usuario,
      'password' : password
    })
    .then(response => response.data)
    .then(res => {

      // Validar si hay un errror
      if(res.error) {
        Swal.fire({
          icon: 'error',
          title: res.msg,
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      cookies.set('id', res.id, { path: '/' });
      cookies.set('name', res.name, { path: '/' });
      cookies.set('api_key', res.api_key, { path: '/' });
      cookies.set('is_administrator', res.is_administrator, { path: '/' });
      navigate("/home");

    });

  }

  return (
    <div className="bg-dark w-100 d-flex justify-content-center align-items-center" style={{height: '100vh'}}>

      <Card className="col-3">
        <Card.Body>
          <Card.Title className='text-center mb-4'>Ingrese los datos de acceso</Card.Title>

            <Form onSubmit={(e) => fnLogin(e)}>
              <Form.Group className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese el usuario"
                  onChange={(e) => setUsuario(e.target.value)}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese la contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className='d-grid'>
              <Button variant="primary" type="submit">
                Ingresa
              </Button>
              </div>
            </Form>

        </Card.Body>
      </Card>

    </div>
  )
}