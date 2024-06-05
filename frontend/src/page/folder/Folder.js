import React, { useEffect, useState } from "react";
import {useQuery} from 'react-query'
import {Typography, Grid, Card, CardContent, Box, Button, IconButton} from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';
import FolderPopup from './FolderPopup'
import Header from '../../components/Header';
import rootApi from '../../api/rootApi'
import path from '../../api/Api'

function Folder() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const { folderId } = useParams();
  const [isUser, setIsUser] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleOpen = () => setOpen(true);

  const {data, refetch} = useQuery(['get-folder-detail', folderId], () => {
    return rootApi.get(path.folder.getDetail({folderId}))
  })

  useEffect(() => {
    setIsUser(data?.data?.userId === userId)
  }, [data])

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
      <Header />
      <Box mb={2} marginTop={2}>
        <Card elevation={1}>
          <CardContent style={{padding: 24}}>
            <Box display="flex" justifyContent="space-between">
              <Box style={{width: '80%'}}>
                <Typography
                  variant="h2"
                  gutterBottom
                  style={{textOverflow: 'ellipsis', overflow: 'hidden'}}
                >
                  Folder: {data?.data?.title}
                  {isUser && (
                    <>
                      <IconButton title="Edit" size="large">
                        <EditIcon fontSize="large" onClick={() => {
                          setAction('edit')
                          handleOpen()
                        }}/>
                      </IconButton>
                      <IconButton title="Add Course" size="large" onClick={() => navigate(`create_course`)}>
                        <AddCircleOutlineOutlinedIcon fontSize="large" />
                      </IconButton>
                    </>
                  )}
                </Typography>

                <Typography>{data?.data?.description}</Typography>
              </Box>
              <Button onClick={() => navigate(-1)}>Back</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Courses (Total: {data?.data?.courses.length})</Typography>
        </Grid>
        {data?.data?.courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              course={course}
              refetch={refetch}
              enableAction={isUser}
              action={() => navigate(`/course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Folder;
