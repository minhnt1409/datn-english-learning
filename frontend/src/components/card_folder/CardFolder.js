import React, { useEffect, useState } from "react";
import {useQuery, useMutation} from 'react-query'
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderPopup from '../../page/folder/FolderPopup'
import ConfirmModal from '../../components/confirm/ConfirmModal'
import rootApi from '../../api/rootApi'
import path from '../../api/Api'
import { showMessage } from "../show_message/ShowMessage";

// project import
import MainCard from '../MainCard';

export default function CardFolder({ color = 'primary', folder, action, enableAction, refetch}) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const confirmAction = () => {
    const { action, id, title } = modalContent;
    action(id, title);
    setShowModal(false);
  };

  const handleDeleteFolder = async (folderId, title) => {
    openModal({
      message: `Are you sure you want to delete folder ${title}?`,
      action: onConfirm,
      id: folderId,
      title,
    });
  };

  const {mutateAsync} = useMutation(
    ['delete-folder'],
    () => {
      return rootApi.delete(path.folder.delete({folderId: folder._id}))
    },
  )

  const onConfirm = () =>
    mutateAsync(undefined)
      .then((resp) => {
        if (resp.status !== 200) {
          showMessage("Error", "Deleted Failed", "danger");
          refetch()
        } else {
          showMessage("Success", "Deleted Successfully", "success");
          refetch()
        }
      })

  const handleOpen = () => setOpen(true);
  
  return (
    <>
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalContent.message}
      />
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={'edit'}
        description={folder?.description}
        title={folder?.title}
        folderId={folder?._id}
        refetch={refetch}
      />
      <MainCard contentSX={{ p: 2.25 }} onClick={action}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            {folder?.title}
          </Typography>
          {enableAction && (
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <IconButton aria-label="edit" size="small" onClick={(e) => {
                  e.stopPropagation()
                  handleOpen()
                }}>
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton aria-label="delete" size="small" onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteFolder(folder?._id, folder?.title)
                }}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Stack>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {folder?.courses?.length}
            </Typography>
          </Grid>
          <Grid item>
            <Chip variant="combined" color={color} label="Courses" sx={{ ml: 1.25, pl: 1 }} size="small" />
          </Grid>
        </Grid>
        <Box sx={{ pt: 2.25 }}>
          <Typography variant="caption" color="text.secondary">
            Description: {folder?.description}
          </Typography>
        </Box>
      </MainCard>
    </>
  );
}

CardFolder.propTypes = {
  folder: PropTypes.any,
};