import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { showMessage } from "../../components/show_message/ShowMessage";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({ open, setOpen, action, folderId, title, description, refetch }) => {
  const handleClose = () => setOpen(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());

    try {
      let response;
      if (action === 'edit') {
        response = await axios.put(
          `http://localhost:8000/folders/${folderId}`,
          formDataObject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/folders",
          { ...formDataObject, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        showMessage("Success", `${action === 'edit' ? 'Updated' : 'Created'} Successfully`, "success");
        refetch();
      } else {
        showMessage("Error", `${action === 'edit' ? 'Updated' : 'Created'} Failed`, "danger");
      }
      setOpen(false);
    } catch (error) {
      showMessage("Error", `${action === 'edit' ? 'Updated' : 'Created'} Failed`, "danger");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...modalStyle }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {action === 'edit' ? 'Edit Folder' : 'Add Folder'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            defaultValue={title}
            autoComplete="title"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            defaultValue={description}
            type="description"
            id="description"
            autoComplete="current-description"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BasicModal;
