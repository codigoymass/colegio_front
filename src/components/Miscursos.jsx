import React, { useState, useEffect } from 'react'
import {
  Col,
  Row,
  Button,
  Card
} from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie'

export default function Cursos() {

  const url = 'http://localhost:8000/api/usuarioscursos';
  const [cursos, setCursos] = useState([]);

  let cookies = new Cookies();

  const listarMisCursos = () => {
    axios.get(`${url}/cursos/${cookies.get('id')}`)
    .then(response => response.data)
    .then(res => {

      return res.map(item => {
        return {
          id: item.id,
          name: item.name,
          horas: item.horas
        }
      });
    })
    .then(data => {
      setCursos(data);
    });
  }

  const salirCurso = (id) => {
    Swal.fire({
      icon: 'question',
      title: '¿Quieres salirte de este curso?',
      confirmButtonText: 'Salir',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })
    .then(result => {
      if(result.isConfirmed) {
        axios.delete(`${url}/${id}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Te has salido del curso correctamente'
          });
          listarMisCursos();
        });
      }
    })
  }

  useEffect(() => {
    listarMisCursos();
  }, []);

  return (
    <>
      {
        <Col>
          <Row className="my-2 justify-content-between">

            {
              cursos.length === 0 && <span className="text-muted fw-bold">¡No tiene cursos asignados!</span>
            }

            {
              (cursos.length > 0) && (
                <>
                  <Col><h4>Mis cursos</h4></Col>
                  <Row>
                    {
                      cursos.map(item => {
                        return (
                          <Col key={item.id} lg="3">
                            <Card>
                              <Card.Body>
                                <Card.Title className="text-truncate">{item.name}</Card.Title>
                                <Card.Text>
                                  {item.horas} hrs
                                </Card.Text>
                                <Row className="px-2">
                                  <Button size="sm" variant="danger" onClick={() => salirCurso(item.id)}>Salir</Button>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      })
                    }
                  </Row>
                </>
              )
            }
          </Row>
          
        </Col>
      }

    </>
  )
}
