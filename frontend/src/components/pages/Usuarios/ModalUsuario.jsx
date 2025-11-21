import {
    Grid,
    Avatar,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Typography,
  } from '@mui/material';
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import CloseIcon from '@mui/icons-material/Close';

  // Usa la variable de entorno VITE_API_URL
  const apiUrl = import.meta.env.VITE_API_URL;

  
  const ModalUsuario = ({ openModal, handleCloseModal, selectedUser, handleEdit, handleDelete, handleChange }) => (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      {/* Título del modal con la "X" para cerrar */}
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Editar Usuario
        <IconButton
          onClick={handleCloseModal}
          style={{ color: 'gray', position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
  
      {/* Contenido del modal */}
      <DialogContent>
        {selectedUser ? (
          <Grid container spacing={3} style={{ padding: '20px' }}>
            {/* Icono del usuario */}
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Avatar style={{ margin: '0 auto', backgroundColor: '#3f51b5', width: 80, height: 80 }}>
                <AccountCircleIcon style={{ fontSize: 60 }} />
              </Avatar>
            </Grid>
  
            {/* Datos del usuario en formato editable */}
            {[
              { label: 'Nombre', key: 'name' },
              { label: 'Apellido', key: 'lastname' },
              { label: 'Correo', key: 'email' },
              { label: 'Rol', key: 'rol' },
              { label: 'Celular', key: 'cel' },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={selectedUser[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              </Grid>
            ))}
  
            {/* Campo de solo lectura */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Creación"
                value={selectedUser.create_at ? new Date(selectedUser.create_at).toLocaleDateString() : ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">Cargando...</Typography>
        )}
      </DialogContent>
  
      {/* Botones de acciones */}
      <DialogActions style={{ justifyContent: 'space-between', padding: '20px' }}>
        {/* Botón de borrar */}
        <Button
          onClick={() => {
            if (selectedUser?.id) handleDelete(selectedUser.id);
          }}
          color="error"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          Borrar
        </Button>
  
        {/* Botón de editar */}
        <Button
          onClick={() => handleEdit(selectedUser)}
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  export default ModalUsuario;
  