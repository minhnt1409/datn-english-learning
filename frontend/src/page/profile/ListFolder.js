import React, { useState } from "react";
import {Grid, IconButton} from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import FolderPopup from '../folder/FolderPopup'

function ListFolders({folders, refetch, isUser}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={'add'}
        refetch={refetch}
      />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {isUser && (
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <IconButton title="Add Course" size="large" onClick={() => setOpen(true)}>
              <AddCircleOutlineOutlinedIcon fontSize="large" />
            </IconButton>
          </Grid>        
        )}
        {folders?.map((folder) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardFolder
              folder={folder}
              refetch={refetch}
              enableAction={isUser}
              action={() => navigate(`/folder/${folder._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListFolders;
