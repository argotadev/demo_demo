import React from 'react';
import '../../styles/Contacto.css'; // Archivo CSS para estilos

export const Contacto = () => {
  return (
    <div className="contacto-container">
      <h1 className="contacto-title">¿Listo para espacios más limpios y seguros?</h1>
      <p className="contacto-subtitle">¡Estoy a un mensaje de distancia!</p>
      
      <div className="contacto-content">
        {/* Tarjeta de Oficina */}
        <div className="contacto-card oficina">
          <h2>📍 Visítame</h2>
          <p className="highlight">Oficina Pellegrini 1261</p>
          <p>Pasa por mi oficina en Saladas para:</p>
          <ul>
            <li>Asesoramiento personalizado</li>
            <li>Compra directa de productos</li>
            <li>Solución rápida a tus consultas</li>
          </ul>
          <div className="horario">
            <p>⏰ <strong>Horario:</strong> Lunes a Viernes 8:00 - 12:00 / 16:00 - 20:00</p>
          </div>
        </div>

        {/* Tarjeta de Contacto Digital */}
        <div className="contacto-card digital">
          <h2>📱 Contacto Express</h2>
          <div className="contacto-item">
            <div className="icono whatsapp">📱</div>
            <div>
              <h3>WhatsApp Directo</h3>
              <a href="https://wa.me/543795172153" target="_blank" rel="noopener noreferrer" className="destacado">
                3795-172153
              </a>
              <p className="small">(Respuesta en minutos!)</p>
            </div>
          </div>

          <div className="contacto-item">
            <div className="icono email">✉️</div>
            <div>
              <h3>Correo Profesional</h3>
              <a href="mailto:agronat19@gmail.com" className="destacado">
                agronat19@gmail.com
              </a>
              <p className="small">(Respondo en menos de 24hs)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa con estilo */}
      <div className="mapa-container">
        <h3>Encontrá mi oficina fácilmente:</h3>
        <div className="mapa-frame">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7028.728990009316!2d-58.62819302201257!3d-28.25696255164693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x944fcf440b38e861%3A0x757a6cb659640e6c!2sC.%20Pellegrini%201261%2C%20W3420%20Saladas%2C%20Corrientes!5e0!3m2!1ses!2sar!4v1746131865501!5m2!1ses!2sar" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>        </div>
      </div>

      <div className="llamado-accion">
        <p>⚠️ <strong>¿Problemas urgentes con plagas o piscinas?</strong></p>
        <a href="tel:+543795172153" className="boton-urgente">
          ¡LLAMÁ AHORA!
        </a>
      </div>
    </div>
  );
};