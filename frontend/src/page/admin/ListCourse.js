import React from "react";
import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, List, ListItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

function ListCourses({ courses, handleDeleteCourse }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses Management
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>STT</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>User</StyledTableCell>
                <StyledTableCell>Folder</StyledTableCell>
                <StyledTableCell>Cards</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <StyledTableRow key={course._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course?.title}</TableCell>
                  <TableCell>{course?.userId?.username}</TableCell>
                  <TableCell>
                    <List>
                      {course?.folders.map((folder) => (
                        <ListItem key={folder._id} disableGutters>
                          - {folder.title}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    <List>
                      {course?.cards.map((card) => (
                        <ListItem key={card._id} disableGutters>
                          - {card.key}: {card.value}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteCourse(course._id, course?.title)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ListCourses;
