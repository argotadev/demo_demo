import React from 'react'
import { useState,useEffect } from 'react'
import { Global } from '../../helpers/Global';
export const Articulos = () => {


  /**POR DEFECTO LA LISTA DE ARTICULOS DEBE ESTAR VACÍA */
  const [articulos, setArticulos ] = useState([]);


  useEffect(()=>{
    conseguirArticulos();
  },[])

  const conseguirArticulos = async ()=>{
    const url = Global.url_listar_articulos
    let peticion = await fetch(url,{
      method: 'GET'
    });
    let datos = await peticion.json();
    console.log(datos);

    if (datos.status == 'success'){
      setArticulos(datos.articulos)
    }
  }

  return (
    <>
    {/*Validamos que haya almenos 1 elemento para recorrer el array de articulos */}
      {articulos.length > 0 ?(
                                articulos.map(articulo => (
                                  <article key={articulo._id} className='articulo-item'>
                                    <div className='mascara'>
                                      <img src={articulo.imagen} alt={articulo.titulo} />
                                    </div>
                                    <div className='datos'>
                                      <h3 className='titulo'>{articulo.titulo}</h3>
                                      <p className='description'>{articulo.contenido}</p>
                                      <button className='edit'>Editar</button>
                                      <button className='delete'>Borrar</button>
                                    </div>
                                  </article>
        ))
      ) : (
        <h1>No hay Artículos disponibles</h1>
      )}
    </>
  );
  
}
