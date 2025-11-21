import React from 'react'
import fumigacion from '../../assets/fumigacion.png';
import piscina from '../../assets/piscina.png';
import '../../styles/Servicios.css';
import productos from '../../assets/producto-organico.png';

export const Servicios = () => {
  const services = [
    {
      title: "Fumigación Profesional",
      description: "Servicios de fumigación seguros y efectivos para el control integral de plagas en ambientes residenciales y comerciales.",
      icon: fumigacion,
      accentColor: "#27ae60" // Professional green
    },
    {
      title: "Mantenimiento de Piscinas",
      description: "Soluciones completas de limpieza, mantenimiento y tratamiento químico para mantener su piscina en condiciones óptimas.",
      icon: piscina,
      accentColor: "#2980b9" // Professional blue
    },
    {
      title: "Control de Plagas",
      description: "Programas personalizados de manejo integrado de plagas utilizando productos orgánicos y técnicas eco-amigables.",
      icon: productos,
      accentColor: "#e67e22" // Professional orange
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Nuestros Servicios Profesionales</h2>
          <p className="section-subtitle">Soluciones especializadas para necesidades específicas</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="card-icon" style={{ backgroundColor: service.accentColor }}>
                <img src={service.icon} alt={service.title} />
              </div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description">{service.description}</p>
              <button 
                className="card-button" 
                style={{ backgroundColor: service.accentColor }}Q
              >
                Más información
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}