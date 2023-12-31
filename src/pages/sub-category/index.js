
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Alert, Button, FormControl, Snackbar, TextField } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { MdModeEditOutline } from 'react-icons/md'
import AddOrEditSubCategory from 'src/views/AddOrEditSubCategory'
import withAuth from 'src/hoc/withAuth'
import axiosInstance from 'src/hoc/axios'
import { AiFillDelete } from 'react-icons/ai'
import { Icon } from '@iconify/react'
import { Box } from 'mdi-material-ui'
import DeleteModal from 'src/views/DeleteModal'

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const SubCategory = () => {

  const [SubCategoryData, setSubCategoryData] = useState([]);

  const [toaster, setToaster] = useState(null);
  const [errorToaster, setErrorToaster] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);

  const [editSubCategory, setEditSubCategory] = useState(null);


  const [addSubCategory, setAddSubCategory] = useState(false);

  const handleClickOpen = () => {
    setAddSubCategory(true);
  };

  const handleClose = () => {
    setAddSubCategory(false);
    setEditSubCategory(null);
    setDeleteItem(null)
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
      axiosInstance.get("subCategory/get")
        .then(res => {
          setSubCategoryData(res.data.data);
        })
        .catch(err => {
          console.log(err)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleSearch = value => {
    setSearchValue(value)

    const searchRegex = new RegExp(escapeRegExp(value), 'i')

    const filteredRows = SubCategoryData.filter(row => {
      console.log(row);

      return Object.keys(row).some(field => {
        // @ts-ignore
        return searchRegex.test(row[field].toString())
      })
    })
    if (value.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const deleteProduct = () => {
    try {
      axiosInstance.put('subCategory/delete', { id: deleteItem._id })
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
            Add SubCategory
          </Button>

          <FormControl sx={{ float: 'right' }}>
            <TextField
              size='small'
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              placeholder='Search…'
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <Icon icon='mdi:magnify' fontSize={20} />
                  </Box>
                ),

                // endAdornment: (
                //   <IconButton size='small' title='Clear' aria-label='Clear' onClick={searchHandler}>
                //     <Icon icon='mdi:close' fontSize={20} />
                //   </IconButton>
                // )
              }}
              sx={{
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '& .MuiInputBase-root > svg': {
                  mr: 2
                }
              }}
            />
          </FormControl>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Name
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Category
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return ( */}
                  {(searchValue ? filteredData : SubCategoryData)?.length === 0 && (
                    <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', margin: "20px" }}>
                      <Typography>No Data Found</Typography>
                    </Grid>)}

                  {(searchValue ? filteredData : SubCategoryData)?.map(d => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={d.id}>
                      <TableCell key={d.id} align="left">
                        {d.name}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        {d.categoryId[0].name}
                      </TableCell>
                      <TableCell key={d.id} align="left">
                        <MdModeEditOutline color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={() => setEditSubCategory(d)} />
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

      <AddOrEditSubCategory open={addSubCategory} setErrorToaster={setErrorToaster} handleClickOpen={handleClickOpen} setEditSubCategory={setEditSubCategory} editSubCategory={editSubCategory} handleClose={handleClose} handleOpenToaster={handleOpenToaster} fetch={fetch} />
      <DeleteModal deleteItem={deleteItem} handleClose={handleClose} deleteProduct={deleteProduct} type='Sub-Category' />

    </Grid>
  )

}

export default withAuth(SubCategory);
