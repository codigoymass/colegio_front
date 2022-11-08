import React, { useEffect } from 'react'
import Cookies from 'universal-cookie'
import { useNavigate } from "react-router-dom"
import Menu from '../components/Menu'
import Miscursos from '../components/Miscursos'
import {
  Container
} from 'react-bootstrap'

export default function Home() {
  
  const cookies = new Cookies();
  let navigate = useNavigate();

  // Validar la sesión
  useEffect(() => {
    if(!cookies.get('name')) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Menu />
      <Container>
        <h2 className="text-center">Bienvenid@, {cookies.get('name')}</h2>
        {
          (cookies.get('is_administrator') === "0") && <Miscursos />
        }
      </Container>
    </>
  )
}