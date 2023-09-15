// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableBasic from 'src/views/tables/TableBasic'
import TableDense from 'src/views/tables/TableDense'
import TableSpanning from 'src/views/tables/TableSpanning'
import TableCustomized from 'src/views/tables/TableCustomized'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
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
import { HiOutlineDownload } from 'react-icons/hi'
import { MdModeEditOutline } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import AddOrEditPurchase from 'src/views/AddorEditPurchase'
import withAuth from 'src/hoc/withAuth'
import axiosInstance from 'src/hoc/axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import FallbackSpinner from 'src/@core/components/spinner'
import { Icon } from '@iconify/react'
import { Box } from 'mdi-material-ui'

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const Purchase = () => {

  const [data, setData] = useState([]);
  const router = useRouter();

  //1 for puchase 0 for sell
  const [type, setType] = useState(1);

  const [toaster, setToaster] = useState(false);
  const [errorToaster, setErrorToaster] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [downloadingToaster, setDownloadingToaster] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [addPurchase, setAddPurchase] = useState(false);

  const handleClickOpen = (type) => {
    // alert()
    setType(type);
    setAddPurchase(true);
  };

  const handleClose = () => {
    setAddPurchase(false);
    setEditPurchase(null)
  };

  const handleOpenToaster = () => {
    setToaster(true);
  }

  const handleCloseToaster = () => {
    setToaster(false);
    setErrorToaster(false);
  }

  const handleSearch = value => {
    setSearchValue(value)

    const searchRegex = new RegExp(escapeRegExp(value), 'i')

    const filteredRows = data.filter(row => {
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

  const fetch = () => {
    try {
      axiosInstance.get("transaction/get")
        .then(res => {
          console.log(res.data.data)

          const arrayUniqueById = [...new Map(res.data.data.map(item =>
            [item['invoiceNo'], item])).values()];

          setData(arrayUniqueById);
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // generateInvoice();
    fetch();
  }, [])

  async function generateInvoice(challanNo) {
    try {
      setDownloadingToaster(true);

      const response = await axios.post(window.location.protocol + '//' + window.location.host + '/api/user', { challanNo: challanNo }, {
        responseType: 'arraybuffer',
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      console.log(pdfBlob);

      // Convert Blob to ArrayBuffer
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = pdfUrl;
      link.download = `${challanNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    setDownloadingToaster(false);

  }

  const deleteInvoice = (id) => {
    try {
      axiosInstance.get("transaction/deleteTransaction/" + id)
        .then(res => {
          fetch();
        })
        .catch(err => {
          console.log(err)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  if (!data) return <FallbackSpinner />

  return (
    <Grid container spacing={6}>
      <Snackbar open={toaster} autoHideDuration={6000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="success" sx={{ width: '100%' }}>
          Purchase added successfully
        </Alert>
      </Snackbar>
      <Snackbar open={downloadingToaster} autoHideDuration={20000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="info" sx={{ width: '100%' }}>
          Downloading Invoice
        </Alert>
      </Snackbar>
      <Snackbar open={errorToaster} autoHideDuration={6000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="error" sx={{ width: '100%' }}>
          Error While Adding Product
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        {/* <Button variant="outlined" onClick={() => setType(!type)}>
          See {type ? "Sell" : "Purchase"} Data
        </Button> */}
        <Card>
          {/* <CardHeader title='Invoices' titleTypographyProps={{ variant: 'h6' }} /> */}

          {/* <Button variant="outlined" onClick={() => handleClickOpen(1)}>
            Add Purchase
          </Button>

          <Button variant="outlined" onClick={() => handleClickOpen(0)}>
            Add Sell
          </Button> */}

          <Typography variant='h6' sx={{padding:2}}>Invoices</Typography>

          <FormControl sx={{ float: 'right',marginTop:-4 }}>
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
          {/* <TableStickyHeader setEditStock={setEditStock}  editStock={editStock} data={data} /> */}

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Date
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Invoice No
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Party
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Type
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 100 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 && (
                    <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', margin: "20px" }}>
                      <Typography>No Data Found</Typography>
                    </Grid>)}

                  {(searchValue ? filteredData : data).map(d => (

                    <TableRow hover role='checkbox' tabIndex={-1} key={d.id} style={{ cursor: "pointer" }} >
                      <TableCell key={data.id} align="left" onClick={() => router.push(`/invoice/${d.id}`)}>
                        {moment(d.invoiceDate).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell key={data.id} align="left" onClick={() => router.push(`/invoice/${d.id}`)}>
                        {d.invoiceNo}
                      </TableCell>
                      <TableCell key={data.id} align="left" onClick={() => router.push(`/invoice/${d.id}`)}>
                        {d.clientName}
                      </TableCell>

                      <TableCell key={data.id} align="left" onClick={() => router.push(`/invoice/${d.id}`)}>
                        {d?.type}
                      </TableCell>
                      {/* <TableCell key={data.id} align="left" >
                        <MdModeEditOutline color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={(e) => generateInvoice(e)} />
                      </TableCell> */}
                      <TableCell key={data.id} align="left" >
                        <HiOutlineDownload color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={() => generateInvoice(d.invoiceNo)} />
                        <AiFillDelete color="#ff4747" size="20px" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteInvoice(d.id)} />

                      </TableCell>

                    </TableRow>
                  ))}

                  {/* })} */}

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Card>
      </Grid>

      <AddOrEditPurchase addPurchase={addPurchase} setErrorToaster={setErrorToaster} type={type} editPurchase={editPurchase} handleClose={handleClose} handleOpenToaster={handleOpenToaster} fetch={fetch} />

    </Grid>
  )
}

export default withAuth(Purchase)
