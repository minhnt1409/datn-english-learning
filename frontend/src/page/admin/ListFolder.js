import React from "react";
import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, useTheme } from '@mui/material/styles';

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

function ListFolders({ folders, handleDeleteFolder }) {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          Folder Management
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
                <StyledTableCell>Courses</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folders.map((folder, index) => (
                <StyledTableRow key={folder.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{folder?.title}</TableCell>
                  <TableCell>{folder?.userId?.username}</TableCell>
                  <TableCell>{folder?.courses?.length}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteFolder(folder?._id, folder?.title)}
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

export default ListFolders;
