import React, { useEffect, useState } from "react";
import {Typography, Grid, Button, IconButton} from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import path from '../../api/Api'
import FolderPopup from '../folder/FolderPopup'

function ListFolders({folders}) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectFolder, setSelectFolder] = useState();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleOpen = () => setOpen(true);

  return (
    <>
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={action}
      />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <IconButton title="Add Course" size="large" onClick={() => {
            setAction('add')
            handleOpen()
          }}>
            <AddCircleOutlineOutlinedIcon fontSize="large" />
          </IconButton>
        </Grid>
        {folders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardFolder
              title={folder.title}
              count={folder.courses.length}
              description={folder.description}
              action={() => navigate(`/folder/${folder._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListFolders;
