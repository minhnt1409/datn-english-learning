import React, { useState } from "react";
import { Grid, IconButton } from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import FolderPopup from '../folder/FolderPopup';
import Light from "../../components/Light";

function ListFolders({ folders, refetch, isUser }) {
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
      <Light
        title={"My Folders"}
        icon={isUser ? (
          <IconButton title="Add Folder" onClick={() => setOpen(true)}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        ) : (<></>)}
      />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {folders?.map((folder) => (
          <Grid item key={folder._id} xs={12} sm={6} md={4} lg={3}>
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
