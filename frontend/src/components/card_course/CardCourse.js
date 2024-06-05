import React, { useEffect, useState } from "react";
import {useQuery, useMutation} from 'react-query'
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmModal from '../../components/confirm/ConfirmModal'
import rootApi from '../../api/rootApi'
import path from '../../api/Api'
import { showMessage } from "../show_message/ShowMessage";

// project import
import MainCard from '../MainCard';

export default function CardFolder({ color = 'secondary', course, action, enableAction, refetch }) {
  const navigate = useNavigate()
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

  const handleDeleteCourse = async (courseId, title) => {
    openModal({
      message: `Are you sure you want to delete course ${title}?`,
      action: onConfirm,
      id: courseId,
      title,
    });
  };

  const {mutateAsync} = useMutation(
    ['delete-course'],
    () => {
      return rootApi.delete(path.course.delete({courseId: course._id}))
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

  return (
    <>
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalContent.message}
      />
      <MainCard contentSX={{ p: 2.25 }} onClick={action}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            {course?.title}
          </Typography>
          {enableAction && (
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <IconButton aria-label="edit" size="small" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/update_course/${course?._id}`);
                }}>
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton aria-label="delete" size="small"onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteCourse(course?._id, course?.title)
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
              {course?.cards?.length}
            </Typography>
          </Grid>
          <Grid item>
            <Chip variant="combined" color={color} label="Cards" sx={{ ml: 1.25, pl: 1 }} size="small" />
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
  course: PropTypes.any,
};