import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, TextField, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import ModalAgregarUsuario from './ModalAgregarUsuario .jsx';
import {Box} from '@mui/material';
import ModalUsuario from './ModalUsuario.jsx';
import "../../../styles/Usuarios.css"

const RotatingIcon = styled(SettingsIcon)(({ theme, rotate }) => ({
  transition: 'transform 0.5s ease',
  transform: rotate ? 'rotate(360deg)' : 'rotate(0deg)',
}));



const VerUsuarios = () => {
  const [rotateId, setRotateId] = useState(null); // Estado para rastrear qué ícono está girando
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

   // Usa la variable de entorno VITE_API_URL
   const apiUrl = import.meta.env.VITE_API_URL;

  // Obtener los usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/user/listar_usuarios`,

          
          { withCredentials: true }
        );
        
        if (Array.isArray(response.data.usuarios)) {
          setUsers(response.data.usuarios);
        } else {
          console.error("Datos inesperados:", response.data);
        }
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.rol.toLowerCase().includes(search.toLowerCase()) ||
      user.cel.toLowerCase().includes(search.toLowerCase()) ||
      user.dni.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user); // Guarda el usuario seleccionado
    setOpenModal(true); // Abre el modal
  };

  const handleButtonClick = (row) => {
    setRotateId(row.id); // Identifica qué botón está girando
    setTimeout(() => setRotateId(null), 100); // Restablece después de la animación
    handleEdit(row); // Llama a la función para abrir el modal
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        newUser,
        { withCredentials: true }
      );
      setUsers(prev => [...prev, response.data.usuario]);
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
      // Opcional: Mostrar alerta al usuario
      alert(error.response?.data?.message || "Error al registrar");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null); // Limpia el usuario seleccionado
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 100 },
    { field: 'lastname', headerName: 'Apellido', width: 100 },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'dni', headerName: 'DNI', width: 100 },
    {
      field: 'create_at',
      headerName: 'Fecha de Creación',
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
      },
    },
    { field: 'cel', headerName: 'Celular', width: 150 },
    { field: 'rol', headerName: 'Rol', width: 100 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 80,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="white"
          onClick={() => handleButtonClick(params.row)} // Llama a la función con animación
        >
          <RotatingIcon rotate={rotateId === params.row.id ? 1 : 0} />
        </Button>
      ),
    },
  ];

  const rows = filteredUsers.map((user, index) => ({
    id: user._id || index,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    dni: user.dni,
    create_at: user.create_at,
    cel: user.cel,
    rol: user.rol,
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="title">
        Usuarios Registrados ({filteredUsers.length})
      </Typography>
      <TextField
        label="Buscar usuario"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
        className="search-input"
      />
      <Button
    variant="contained"
    color="success"
    sx={{
      minWidth: '40px',
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        width: '230px',
        justifyContent: 'flex-start',
        paddingLeft: '12px',
      },
      '&:hover .button-text': {
        opacity: 1,
        width: 'auto',
      }
    }}
    onClick={() => setOpenAddModal(true)}
  >
    <AddIcon />
    <Box
      component="span"
      className="button-text"
      sx={{
        opacity: 0,
        width: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        marginLeft: '8px',
        marginTop: '2px',
        transition: 'all 0.3s ease',
      }}
    >
      Agregar Usuario
    </Box>
  </Button>

      <ModalAgregarUsuario
        openModal={openAddModal}
        handleCloseModal={() => setOpenAddModal(false)}
        handleAddUser={handleAddUser}
      />

      {selectedUser && (
        <ModalUsuario
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedUser={selectedUser}
          handleEdit={(updatedUser) => console.log(updatedUser)}
          handleDelete={(userId) => console.log(userId)}
          handleChange={(field, value) => {
            setSelectedUser((prev) => ({ ...prev, [field]: value }));
          }}
        />
      )}

      <div style={{ height: 380, width: '100%' }} className="data-grid">
        {loading ? (
          <Typography variant="h6" color="primary">
            Cargando usuarios...
          </Typography>
        ) : (
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        )}
      </div>
    </Container>
  );
};

export default VerUsuarios;
