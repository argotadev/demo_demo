import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Login.css';
import { Servicios } from './Servicios';
import { Ubicacion } from './Ubicacion';
import { Contacto } from './Contacto';

export const Inicio = () => {
  const navigate = useNavigate();

  const goToUbicacion = () => {
    navigate('/contacto'); 
  };

  return (
    <div className='container jumbo mt-5'>
      <h1 className='text-center'></h1>
      <p className='lead text-center'>
        Agronat es tu aliado en el cuidado y mantenimiento de espacios agrícolas y recreativos. Nos especializamos en fumigación profesional para proteger tus cultivos de plagas, limpieza de piscinas para mantener el agua cristalina y segura, y ofrecemos una amplia gama de productos agrícolas de alta calidad diseñados para mejorar la productividad y salud de tus cultivos. 
      </p>
      
      <div className="text-center">
        <button 
          type="button" 
          className="btn btn-success"
          onClick={goToUbicacion}
        >
          ¡Contáctanos!
        </button>
      </div>

      {/* <Servicios/> */}
      <Ubicacion/>
    </div>
  );
};