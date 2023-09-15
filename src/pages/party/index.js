
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Alert, Button, Snackbar } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { MdModeEditOutline } from 'react-icons/md'
import AddOrEditParty from 'src/views/AddOrEditParty'
import { AiFillDelete } from 'react-icons/ai'
import withAuth from 'src/hoc/withAuth'
import axiosInstance from 'src/hoc/axios'
import DeleteModal from 'src/views/DeleteModal'


const Party = () => {

  const [PartyData, setPartyData] = useState([]);

  const [toaster, setToaster] = useState(null);
  const [errorToaster, setErrorToaster] = useState(null);
  const [editParty, setEditParty] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditParty(null)
    setDeleteItem(null);
  };

  const handleOpenToaster = () => {
    setToaster(true);
  }

  const handleCloseToaster = () => {
    setToaster(false);
    setErrorToaster(false);
  }


  useEffect(() => {
    fetch();
  }, [])

  const fetch = () => {
    try {
      axiosInstance.get("client/get")
        .then(res => {
          setPartyData(res.data.data);
        })
        .catch(err => {
          console.log(err)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  const deleteProduct = () => {
    try {
      axiosInstance.put('client/delete', { id: deleteItem._id })
        .then(res => {
          if (res.data.status === 200) {
            setToaster(res.data.message);
            setDeleteItem(null);
            fetch();

            // setLoading(false);
          } else {
            // setLoading(false);
            setErrorToaster(res.data.message);
          }
        })
        .catch(err => {
          // setLoading(false);
          setErrorToaster(err);
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <Grid container spacing={6}>
      <Snackbar open={toaster} autoHideDuration={6000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="success" sx={{ width: '100%' }}>
          {toaster}
        </Alert>
      </Snackbar>

      <Snackbar open={errorToaster} autoHideDuration={6000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="error" sx={{ width: '100%' }}>
          {errorToaster}
        </Alert>
      </Snackbar>

      <Grid item xs={12}>

        <Card>
          <CardHeader title='Sticky Header' titleTypographyProps={{ variant: 'h6' }} />
          <Button variant="outlined" onClick={handleClickOpen}>
            Add Party
          </Button>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Name
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Contact No
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Gst No
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      State
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Address
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PartyData.map(d => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={d.id}>
                      <TableCell key={d.id} align="left">
                        {d.name}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        {d.contactNo}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        {d.gstNo}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        {d.state}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        {d.address}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        <MdModeEditOutline color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={() => setEditParty(d)} />
                        <AiFillDelete color="rgb(238 31 31)" size="20px" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setDeleteItem(d)} />

                      </TableCell>
                    </TableRow>
                  ))}

                  {/* })} */}

                </TableBody>
              </Table>
            </TableContainer>

            {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
          </Paper>
        </Card>
      </Grid>

      <AddOrEditParty open={open} setErrorToaster={setErrorToaster} setToaster={setToaster} handleClickOpen={handleClickOpen} setEditParty={setEditParty} editParty={editParty} handleClose={handleClose} handleOpenToaster={handleOpenToaster} fetch={fetch} />
      <DeleteModal deleteItem={deleteItem} handleClose={handleClose} deleteProduct={deleteProduct} type='Party' />

    </Grid>
  )

}

export default withAuth(Party);
