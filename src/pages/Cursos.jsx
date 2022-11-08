import React, { useState, useEffect } from 'react'
import {
  Container,
  Col,
  Row,
  Button,
  Form
} from 'react-bootstrap'
import axios from 'axios'
import Menu from '../components/Menu'
import Tabla from '../components/Tabla'
import Swal from 'sweetalert2'

export default function Cursos() {

  const url = 'http://localhost:8000/api/cursos';
  const [showForm, setShowForm] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({});

  const listarCursos = () => {
    axios.get(url)
    .then(response => response.data)
    .then(res => {
      return res.map(item => {
        return {
          id: item.id,
          name: item.name,
          horas: item.horas,
          accion: (
            <Row>
              <Col>
                <Button size="sm" variant="warning" onClick={() => editarCurso(item.id)}>Editar</Button>
              </Col>
              <Col>
                <Button size="sm" variant="danger" onClick={() => eliminarCurso(item.id)}>Eliminar</Button>
              </Col>
            </Row>
          )
        }
      });
    })
    .then(data => {
      setCursos(data);
    });
  }

  const fnEnviar = (e) => {
    
    e.preventDefault();
    let request;

    if(form.id) {
      request = axios.put(`${url}/${form.id}`, form);
    } else {
      request = axios.post(url, form);
    }
    
    request
    .then(res => {

      if(res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'El curso ha sido guardado correctamente',
          confirmButtonText: 'Aceptar'
        });
      }
      listarCursos();
    })
    .then(() => {
      setShowForm(false);
    });

  }

  const eliminarCurso = (id) => {
    Swal.fire({
      icon: 'question',
      title: '¿Quieres eliminar este curso?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })
    .then(result => {
      if(result.isConfirmed) {
        axios.delete(`${url}/${id}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'El curso ha sido eliminado correctamente'
          });
          listarCursos();
        });
      }
    })
  }

  const editarCurso = (id) => {
    axios.get(`${url}/${id}`)
    .then(response => response.data)
    .then(res => {
      setForm(res);
      setShowForm(true);
    });
  }

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
    },
    {
      name: 'Nombre',
      selector: row => row.name,
    },
    {
      name: 'Horas',
      selector: row => row.horas,
    },
    {
      name: 'Acción',
      selector: row => row.accion,
    }
  ];

  useEffect(() => {
    listarCursos();
  }, []);

  return (
    <>
      <Menu />

      {
        !showForm && (
          <Container>
            <Col lg="8" className="mx-auto">
              <Row className="my-2 justify-content-between">
                <Col><h4>Cursos</h4></Col>
                <Col className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => { setShowForm(true); setForm({}) }}>Agregar</Button>
                </Col>
              </Row>
      
              <Row>
                <Tabla
                  columnas={columns}
                  filas={cursos}
                />
              </Row>
            </Col>
          </Container>
        )
      }

      {
        showForm && (
          <Container>
            <Col lg="4" className="mx-auto">
              <Row className="my-2 justify-content-between">
                <Col><h4>Cursos</h4></Col>
                <Col className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => setShowForm(false)}>Volver</Button>
                </Col>
              </Row>

              <Row>

                <Form onSubmit={(e) => fnEnviar(e)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el nombre"
                      onChange={(e) => setForm({...form, name:e.target.value})}
                      value={form.name}
                      autoFocus
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Horas</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Ingrese las horas"
                      onChange={(e) => setForm({...form, horas:e.target.value})}
                      value={form.horas}
                    />
                  </Form.Group>
                  <div className='d-grid'>
                  <Button variant="primary" type="submit">
                    Guardar
                  </Button>
                  </div>
                </Form>

              </Row>
            </Col>
          </Container>
        )
      }

    </>
  )
}
