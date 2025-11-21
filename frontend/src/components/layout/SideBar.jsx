import React from 'react'
export const SideBar = () => {
  return (
    <aside className="lateral">
      <div className='search'>
        <h3 className='title'>Buscador</h3>

        <form>
          <input type='text' id='search_field'></input>
          <button id = 'search'>Buscar</button>
        </form>
      </div>
      {/* <div className='add'>
        <h3 className='title'>Añadir Pelicula</h3>

        <form>
          <input type='text' id='title' placeholder='Titulo'></input>
          <textarea  id="descripcion" placeholder='Decripción'></textarea>
          <input type="submit" id='save' value='Guardar'/>
        </form>
      </div>      */}
          
    </aside>
  )
}
