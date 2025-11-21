import React from 'react';
import '../../styles/Quiensoy.css';
import perfil from '../../assets/perfil.jpeg';



export const Quiensoy = () => {
  return (
    <div className="quiensoy-container">
      <div className="quiensoy-content">
        {/* Foto a la izquierda (reemplaza con tu imagen) */}
        <div className="quiensoy-image">
          <img 
            src={perfil} // Cambia por la ruta correcta
            alt="Pablo Sebastián Pinat - Ingeniero Agrónomo"
            className="profile-img"
          />
        </div>

        {/* Reseña a la derecha */}
        <div className="quiensoy-text">
          <h1>Pablo Sebastián Pinat</h1>
          <h2>Ingeniero Agrónomo | Especialista en Fumigación y Limpieza</h2>
          
          <p>
            Profesional con más de 5 años de experiencia en <strong>fumigación de ambientes</strong>, 
            <strong> limpieza de piscinas</strong> y <strong>venta de productos especializados</strong>. 
            Como <strong>Ingeniero Agrónomo</strong>, combino conocimientos técnicos con soluciones 
            prácticas para garantizar espacios libres de plagas y aguas higienizadas.
          </p>

          <ul className="quiensoy-skills">
            <li>✔ Control integral de plagas (urbanas y rurales)</li>
            <li>✔ Tratamiento y mantenimiento de piscinas</li>
            <li>✔ Asesoramiento en productos de fumigación</li>
            <li>✔ Análisis de suelos y manejo fitosanitario</li>
          </ul>

          <p>
            Mi enfoque se basa en la <strong>calidad, prevención y sostenibilidad</strong>, 
            utilizando productos certificados y técnicas actualizadas para proteger 
            la salud de las personas y el medio ambiente.
          </p>
        </div>
      </div>
    </div>
  );
};