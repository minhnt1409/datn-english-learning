import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { showMessage } from "../../components/show_message/ShowMessage";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({open, setOpen, action, folderId, title, description, setRefetch, refetch}) {
  const handleClose = () => setOpen(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if(action === 'edit') {
      try {
        const response = await axios.put(
          `http://localhost:8000/folders/${folderId}`,
          { title: data.get('title'), description: data.get('description') },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status !== 200) {
          showMessage("Error", "Updated Failed", "danger");
        } else {
          showMessage("Success", "Updated Folder Successfully", "success")
          setRefetch(!refetch)
        }
        setOpen(false)
      } catch (error) {
        showMessage("Error", "Updated Failed", "danger");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/folders",
          { title: data.get('title'), description: data.get('description'), userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          showMessage("Success", "Created Successfully", "success");
        } else {
          showMessage("Error", "Created Fail", "danger");
        }
        setOpen(false)
      } catch (error) {
        showMessage("Error", "Created Fail", "danger");
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {action === 'edit' ? 'Edit Folder': 'Add Folder'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}