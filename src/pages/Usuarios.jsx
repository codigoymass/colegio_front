import React, { useState, useEffect } from 'react'
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  Modal
} from 'react-bootstrap'
import axios from 'axios'
import Menu from '../components/Menu'
import Tabla from '../components/Tabla'
import Swal from 'sweetalert2'

export default function Usuarios() {

  const url = 'http://localhost:8000/api/usuarios';
  const [showForm, setShowForm] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({is_administrator: 0});
  const [modal, setModal] = useState(false);
  const [modalCursos, setModalCursos] = useState(false);
  const [userscursos, setUserscursos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [userId, setUserId] = useState(null);

  const listarUsuarios = () => {
    axios.get(url)
    .then(response => response.data)
    .then(res => {
      return res.map(item => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          is_administrator: (item.is_administrator === 1) ? 'Admin' : 'Alumno',
          accion: (
            <Row>
              <Col className={(item.is_administrator === 1) ? 'd-none' : ''}>
                <Button size="sm" variant="info" onClick={() => asignarCurso(item.id)}>Cursos</Button>
              </Col>
              <Col>
                <Button size="sm" variant="warning" onClick={() => editarUsuario(item.id)}>Editar</Button>
              </Col>
              <Col>
                <Button size="sm" variant="danger" onClick={() => eliminarUsuario(item.id)}>Eliminar</Button>
              </Col>
            </Row>
          )
        }
      });
    })
    .then(data => {
      setUsuarios(data);
    });    
  }

  const listarUsersCursos = () => {

    axios.get(`http://localhost:8000/api/usuarioscursos/cursos/${userId}`)
    .then(response => response.data)
    .then(res => {
      return res.map(item => {
        return {
          id: item.id,
          name: item.name,
          accion: (
            <Row>
              <Col>
                <Button size="sm" variant="danger" onClick={() => eliminarUserCursos(item.id)}>Quitar</Button>
              </Col>
            </Row>
          )
        }
      });
    })
    .then(data => {
      setUserscursos(data);
    });

  }

  const listarCursos = () => {

    axios.get('http://localhost:8000/api/cursos')
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
                <Button size="sm" variant="primary" onClick={() => guardar_user_curso(item.id)}>Seleccionar</Button>
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

  const guardar_user_curso = (id_curso) => {

    let id_user = document.getElementById('id_user').value;

    axios.post(`http://localhost:8000/api/usuarioscursos`, {user_id: id_user, curso_id: id_curso})
    .then(res => {
      if(res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'El curso se ha asignado correctamente',
          timer: 3000
        });
      }
    })
    .then(() => {
      setModalCursos(false);
    }).then(() => {
      listarUsersCursos();
    })

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
          title: 'El usuario ha sido guardado correctamente',
          confirmButtonText: 'Aceptar'
        });
      }
      listarUsuarios();
    })
    .then(() => {
      setShowForm(false);
    });

  }

  const eliminarUsuario = (id) => {
    Swal.fire({
      icon: 'question',
      title: '¿Quieres eliminar este usuario?',
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
            title: 'El usuario ha sido eliminado correctamente'
          });
          listarUsuarios();
        });
      }
    })
  }

  const eliminarUserCursos = (id) => {
    Swal.fire({
      icon: 'question',
      title: '¿Quieres quitar el curso?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })
    .then(result => {
      if(result.isConfirmed) {
        axios.delete(`http://localhost:8000/api/usuarioscursos/${id}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'El curso se ha quitado correctamente'
          });
          listarUsersCursos();
        });
      }
    })
  }

  const editarUsuario = (id) => {
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
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Teléfono',
      selector: row => row.phone,
    },
    {
      name: 'Rol',
      selector: row => row.is_administrator,
    },
    {
      name: 'Acción',
      selector: row => row.accion,
    }
  ];

  const columns_cursos = [
    {
      name: 'Curso',
      selector: row => row.name,
    },
    {
      name: 'Acción',
      selector: row => row.accion,
    }
  ];

  const asignarCurso = (id) => {
    setUserId(id);
    setModal(true);
  }

  const handleClose = () => {
    setModal(false);
  }

  const ModalAsignar = () => {
    return (
      <Modal show={modal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cursos asignados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mx-3 my-2">
            <Button variant="primary" onClick={() => setModalCursos(true)}>Agregar</Button>
          </Row>
          <input type="hidden" id="id_user" value={userId} />
          <Tabla
            columnas={columns_cursos}
            filas={userscursos}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const handleCloseCursos = () => {
    setModalCursos(false);
  }

  const ModalCursos = () => {
    return (
      <Modal show={modalCursos} onHide={handleCloseCursos} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cursos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabla
            columnas={columns_cursos}
            filas={cursos}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCursos}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  useEffect(() => {
    listarUsuarios();
    listarCursos();
  }, []);

  useEffect(() => {
    listarUsersCursos();
  }, [userId]);

  return (
    <>
      <ModalAsignar />
      <ModalCursos />
      <Menu />
      {
        !showForm && (
          <Container>
            <Col lg="12" className="mx-auto">
              <Row className="my-2 justify-content-between">
                <Col><h4>Usuarios</h4></Col>
                <Col className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => { setShowForm(true); setForm({}) }}>Agregar</Button>
                </Col>
              </Row>
      
              <Row>
                <Tabla
                  columnas={columns}
                  filas={usuarios}
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
                <Col><h4>Usuarios</h4></Col>
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese el correo"
                      onChange={(e) => setForm({...form, email:e.target.value})}
                      value={form.email}
                    />
                  </Form.Group>

                  <Form.Group className={`mb-3 ${form.id ? 'd-none' : ''}`}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingrese la contraseña"
                      onChange={(e) => setForm({...form, password:e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Ingrese el teléfono"
                      onChange={(e) => setForm({...form, phone:e.target.value})}
                      value={form.phone}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type='switch'
                      label='¿Administrador?'
                      onChange={(e) => setForm({...form, is_administrator: (e.target.checked) ? 1 : 0})}
                      checked={(form.is_administrator === 1)}
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
