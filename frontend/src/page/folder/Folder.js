import React, { useEffect, useState } from "react";
import { useQuery } from 'react-query';
import { Typography, Grid, Card, CardContent, Box, Button, IconButton } from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import FolderPopup from './FolderPopup';
import AddCourseToFolder from './AddCourseToFolder';
import Header from '../../components/Header';
import rootApi from '../../api/rootApi';
import path from '../../api/Api';

function Folder() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { folderId } = useParams();
  const [isUser, setIsUser] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');
  const [openAddCourse, setOpenAddCourse] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleOpenAddCourse = () => setOpenAddCourse(true);

  const { data, refetch } = useQuery(['get-folder-detail', folderId], () => {
    return rootApi.get(path.folder.getDetail({ folderId }));
  });

  useEffect(() => {
    setIsUser(data?.data?.userId === userId);
  }, [data, userId]);

  return (
    <div>
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={action}
        description={data?.data?.description}
        title={data?.data?.title}
        folderId={folderId}
        refetch={refetch}
      />
      <AddCourseToFolder
        open={openAddCourse}
        setOpen={setOpenAddCourse}
        folderId={folderId}
        folderCourses={data?.data?.courses?.map(course => course._id) || []}
        refetchFolder={refetch}
      />
      <Header />
      <Box mb={2} mt={2}>
        <Card elevation={3} sx={{ borderRadius: '12px', padding: '16px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  Folder: {data?.data?.title}
                  {isUser && (
                    <Box component="span" sx={{ marginLeft: 2 }}>
                      <IconButton title="Edit" size="large" onClick={() => {
                        setAction('edit');
                        handleOpen();
                      }}>
                        <EditIcon fontSize="large" />
                      </IconButton>
                      <IconButton title="Add Course" size="large" onClick={handleOpenAddCourse}>
                        <AddCircleOutlineOutlinedIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  )}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                  Description: {data?.data?.description}
                </Typography>
              </Box>
              <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Courses (Total: {data?.data?.courses.length})
          </Typography>
        </Grid>
        {data?.data?.courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
            <CardCourse
              course={course}
              refetch={refetch}
              enableAction={isUser}
              folderId={folderId}
              action={() => navigate(`/course/${course._id}`)}
              sx={{ borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Folder;
