import React, { useState } from "react";
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import {
  Chip,
  Grid,
  Stack,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderPopup from '../../page/folder/FolderPopup';
import ConfirmModal from '../../components/confirm/ConfirmModal';
import rootApi from '../../api/rootApi';
import path from '../../api/Api';
import { showMessage } from "../show_message/ShowMessage";
import MainCard from '../MainCard';

export default function CardFolder({ color = 'primary', folder, action, enableAction, refetch, avatar }) {
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

  const { mutateAsync } = useMutation(
    ['delete-folder'],
    () => {
      return rootApi.delete(path.folder.delete({ folderId: folder._id }));
    },
  );

  const onConfirm = () => mutateAsync(undefined)
    .then((resp) => {
      if (resp.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        showMessage("Success", "Deleted Successfully", "success");
      }
      refetch();
    });

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
      <MainCard
        contentSX={{
          p: 2.25,
          transition: '0.3s',
          '&:hover': {
            boxShadow: 6,
            cursor: 'pointer',
          },
        }}
        onClick={action}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h6" noWrap>
              {folder?.title}
            </Typography>
          </Grid>
          {enableAction ? (
            <Grid item xs={2}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder?._id, folder?.title);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid>
          ) : (
            <>
              {!!avatar ? (
                <Avatar alt="avatar" src={avatar} />
              ) : (<></>)}
            </>
          )}
        </Grid>
        <Grid container alignItems="center" sx={{ mt: 1 }}>
          <Grid item>
            <Typography variant="h4" color="inherit">
              {folder?.courses?.length}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              variant="outlined"
              color={color}
              label="Courses"
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
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
  color: PropTypes.string,
  folder: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
  enableAction: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};
