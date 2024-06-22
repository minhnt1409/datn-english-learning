import React, { useState } from "react";
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Grid,
  Stack,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ConfirmModal from '../../components/confirm/ConfirmModal';
import rootApi from '../../api/rootApi';
import path from '../../api/Api';
import { showMessage } from "../show_message/ShowMessage";
import MainCard from '../MainCard';

export default function CardFolder({ color = 'secondary', course, action, enableAction, folderId, refetch, avatar }) {
  const navigate = useNavigate();
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

  const handleDeleteCourse = async (courseId, title) => {
    openModal({
      message: `Are you sure you want to delete course ${title}?`,
      action: onConfirm,
      id: courseId,
      title,
      type: 'delete'
    });
  };

  const handleRemoveFromFolder = async (courseId, title) => {
    openModal({
      message: `Are you sure you want to remove course ${title} from the folder?`,
      action: onConfirmRemove,
      id: courseId,
      title,
      type: 'remove'
    });
  };

  const { mutateAsync: deleteCourseMutateAsync } = useMutation(
    ['delete-course'],
    () => {
      return rootApi.delete(path.course.delete({ courseId: course._id }));
    },
  );

  const { mutateAsync: removeCourseMutateAsync } = useMutation(
    ['remove-course-from-folder'],
    () => {
      return rootApi.delete(path.folder.deleteCourse({ folderId: folderId, courseId: course._id }));
    },
  );

  const onConfirm = () => deleteCourseMutateAsync(undefined)
    .then((resp) => {
      if (resp.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        showMessage("Success", "Deleted Successfully", "success");
      }
      refetch();
    });

  const onConfirmRemove = () => removeCourseMutateAsync(undefined)
    .then((resp) => {
      if (resp.status !== 200) {
        showMessage("Error", "Remove Failed", "danger");
      } else {
        showMessage("Success", "Removed Successfully", "success");
      }
      refetch();
    });

  return (
    <>
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalContent.message}
      >
        {folderId && modalContent.type === 'remove' && (
          <Button variant="contained" color="secondary" onClick={onConfirmRemove}>
            Remove from Folder
          </Button>
        )}
      </ConfirmModal>
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
              {course?.title}
            </Typography>
          </Grid>
          {enableAction ? (
            <Grid item xs={2}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <IconButton
                  aria-label="edit"
                  title="Edit Course"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update_course/${course?._id}`);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  title="Delete Course"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCourse(course?._id, course?.title);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                {folderId && (
                  <IconButton
                    aria-label="remove"
                    title="Remove course from folder"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFolder(course?._id, course?.title);
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                )}
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
              {course?.cards?.length}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              variant="outlined"
              color={color}
              label="Cards"
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          </Grid>
        </Grid>
        <Box sx={{ pt: 2.25 }}>
          <Typography variant="caption" color="text.secondary">
            Description: {course?.description}
          </Typography>
        </Box>
      </MainCard>
    </>
  );
}

CardFolder.propTypes = {
  color: PropTypes.string,
  course: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
  enableAction: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};
