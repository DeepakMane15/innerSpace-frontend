// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

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
import { Alert, Button, Divider, Snackbar } from '@mui/material'
import AddOrEditPurchase from 'src/views/AddorEditPurchase'
import withAuth from 'src/hoc/withAuth'
import axiosInstance from 'src/hoc/axios'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MdModeEditOutline } from 'react-icons/md'
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai'
import { Box, FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import moment from 'moment/moment';

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const Sale = ({ editPurchase, type }) => {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [toaster, setToaster] = useState(false);
  const [errorToaster, setErrorToaster] = useState(false);
  const [editStock, setEditStock] = useState(null);


  const [open, setOpen] = useState(false);



  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([]);
  console.log(products)
  const [productMaster, setProductMaster] = useState([]);

  // const categories = ['instant', 'odd']

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [invoice, setInvoice] = useState("");
  const [party, setParty] = useState("");
  const [invoiceError, setInvoiceError] = useState(false);
  const [partyError, setPartyError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [contactNoError, setContactNoError] = useState(false);
  const [error, setError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [filteredData, setFilteredData] = useState([])
  const [parties, setParties] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedParty, setSelectedParty] = useState(null);
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [newProduct, setNewProduct] = useState({ category: "", productId: "", code: "", size: "", quantity: "", filteredData: [] })

  useEffect(() => {
    if (editPurchase) {
      // alert("yess")
      setInvoice(editPurchase.id);
      setParty(editPurchase.clientName);
    }
  }, [])

  useEffect(() => {
    reset();
    axiosInstance.get("product/get")
      .then(res => {
        if (res.data.status === 200) {
          setProductMaster(res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })

    axiosInstance.get("category/get")
      .then(res => {
        if (res.data.status === 200) {
          setCategories(res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })

    axiosInstance.get("size/get")
      .then(res => {
        if (res.data.status === 200) {
          setSizes(res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
    axiosInstance.get("client/get")
      .then(res => {
        if (res.data.status === 200) {
          setParties(res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })

  }, [editPurchase])

  const handleSubmit = () => {

    if (!invoice || !party || !date || !address || !contactNo) {
      if (!invoice) {
        setInvoiceError(true);
      }
      if (!party) {
        setPartyError(true);
      }
      if (!date) {
        setDateError(true);
      }
      if (!address) {
        setAddressError(true);
      }
      if (!contactNo) {
        setContactNoError(true);
      }

      return;
    }
    setInvoiceError(false);
    setPartyError(false);
    setDateError(false);
    setAddressError(false);
    setContactNoError(false);
    setError(false);

    products.forEach(p => {
      if (p.category === '' || p.productId === '' || p.quantity === '') {
        alert("Please enter all product details!");
        setError(true);

        return;
      }
    })
    if (!error) {
      try {
        const data = {

          products: products,
          clientName: party,
          id: invoice,
          type: type ? "purchase" : "sell",
          invoiceDate: date,
          address: address,
          contactNo: contactNo
        }

        console.log(data)

        axiosInstance.post("transaction", data)
          .then(res => {
            if (res.data.status === 200) {
              reset();
              handleClose();
              handleOpenToaster();
            } else {
              setErrorToaster(true)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const reset = () => {
    setInvoiceError(false);
    setPartyError(false);
    setDateError(false);
    setError(false);
    setProducts([])
    setParty("");
    setAddress("");
    setContactNo("");
    setInvoice("");
    setDate(moment().format("YYYY-MM-DD"))

  }

  const handleSizeQuantity = (e, name) => {
    let entity, value;

    if (name) {
      entity = name;
      value = e;
    } else {
      entity = e.target.name;
      value = e.target.value;
    }

    let data = { ...newProduct };

    if (entity === 'productId') {

      let productCode = productMaster.filter(p => p._id === value);
      if (productCode && productCode[0]?.code != data['code']) {
        data['code'] = productCode[0]?.code;
      }
    } else if (e.target.name === 'category') {
      data['category'] = e.target.value;
      data['filteredData'] = productMaster.filter(p => p.categoryId._id === e.target.value);
    }
    data[entity] = value;
    setNewProduct(data);

  }

  const addSizeQuantity = () => {
    let newfield = { category: "", productId: "", code: "", size: "", quantity: "", filteredData: [] }
    setProducts([...products, newProduct])
    setNewProduct(newfield);
  }

  const deleteSizeQuantity = (index) => {
    console.log(products);

    return;
    let data = [...products];
    data.splice(index, 1)
    setProducts(data)
  }

  const handleProductCode = (e) => {
    let data = { ...newProduct };
    data['code'] = e.target.value;

    setNewProduct(data);

    const searchRegex = new RegExp(escapeRegExp(e.target.value), 'i')
    let filteredRows = [];
    if (newProduct.category.length) {
      filteredRows = newProduct.filteredData.filter(row => {
        return Object.keys(row).some(field => {

          return searchRegex.test(row['code'].toString())
        })
      })

      if (e.target.value.length) {
        if (filteredRows.length > 0) {
          data['productId'] = filteredRows[0]._id;
          data['category'] = filteredRows[0].categoryId._id;
          data['filteredData'] = filteredRows;
          setNewProduct(data);
        }

      } else {
        data['filteredData'] = [];
        setNewProduct(data);
      }

    }
    else {
      let categoryId = productMaster.filter(p => p.code === e.target.value);
      if (categoryId.length) {
        newProduct['category'] = categoryId[0].categoryId._id;
        newProduct['filteredData'] = categoryId;
        handleProductCode(e);
      }

      // filteredRows = productMaster.filter(row => {
      //   return Object.keys(row).some(field => {

      //     return searchRegex.test(row['code'].toString())
      //   })
      // })
    }
  }

  const markSegregated = () => {
    let data = { ...newProduct };
    data['isSegregated'] = true;
    data['from'] = '';
    data['leftOver'] = '';
    setNewProduct(data);
  }



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditStock(null)
  };

  const handleOpenToaster = () => {
    setToaster(true);
  }

  const handleCloseToaster = () => {
    setToaster(false);
  }

  const handlePartyChange = (party) => {
    setParty(party?._id)
    setSelectedParty(party);
    setAddress(party?.address);
    setContactNo(party?.contactNo)
  }


  return (
    <Grid container spacing={6}>
      <Snackbar open={toaster} autoHideDuration={6000} onClose={handleCloseToaster} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ top: "10%" }}>
        <Alert onClose={handleCloseToaster} severity="success" sx={{ width: '100%' }}>
          Stock added
        </Alert>
      </Snackbar>
      <Grid item xs={12}>

        <Card>
          <CardHeader title='Add Sale' titleTypographyProps={{ variant: 'h6' }} />
          <form onSubmit={handleSubmit} style={{ margin: "30px" }}>
            <Grid container spacing={5} component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: "max" },
              }}
              noValidate
              autoComplete="off">

              <Grid item xs={2}>
                <label>Challan No : </label>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  name='invoice'
                  error={invoiceError}
                  type='text'
                  placeholder="Enter Challan No"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                />
              </Grid>

              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <label>Date : </label>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  variant="standard"
                  required
                  name='date'
                  error={dateError}
                  type='date'
                  label='Date'
                  placeholder='Date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <label>Party : </label>
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  options={parties}
                  getOptionLabel={option => option.name}
                  name="party"
                  required
                  disableClearable
                  onChange={(e, values) => handlePartyChange(values)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="productId"
                      error={partyError}
                      variant="standard"
                      label="Party Name"
                      placeholder="Party Name"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <label>GST No : </label>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  required
                  name='date'
                  error={dateError}
                  type='text'
                  placeholder='GST No'
                  value={selectedParty?.gstNo}
                />
              </Grid>

              <Grid item xs={2}>
                <label>Address : </label>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  name='address'
                  error={addressError}
                  type='text'
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={2}>
                <label>Contact No : </label>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  name='contactNo'
                  error={contactNoError}
                  type='text'
                  placeholder="Enter Contact No"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider><Typography variant='subtitle1' >Add products</Typography></Divider>
              </Grid>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" sx={{ minWidth: 80 }}>
                          Category
                        </TableCell>
                        <TableCell align="left" sx={{ minWidth: 100 }}>
                          Code
                        </TableCell>
                        <TableCell align="left" sx={{ minWidth: 100 }}>
                          Name
                        </TableCell>
                        <TableCell align="left" sx={{ minWidth: 100 }}>
                          Size
                        </TableCell>
                        <TableCell align="left" sx={{ width: 80 }}>
                          Quantity
                        </TableCell>
                        <TableCell align="left" sx={{ width: 60 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(products.length === 0 ? (
                        <div style={{ textAlign: 'center' }}>No products added</div>
                      )
                        : products.map(p => (
                          <TableRow hover role='checkbox' tabIndex={-1} key={p._id}>
                            <TableCell key={data._id} align="left">
                              {categories.filter(c => c._id === p.category)[0]?.name}
                            </TableCell>
                            <TableCell key={data.id} align="left">
                              {p.code}
                            </TableCell>
                            <TableCell key={data.id} align="left">
                              {productMaster.filter(c => c._id === p.productId)[0]?.name}
                            </TableCell>
                            <TableCell key={data.id} align="left">
                              {productMaster.filter(c => c._id === p.productId)[0]?.size}
                            </TableCell>
                            <TableCell key={data.id} align="left">
                              {p.quantity}
                            </TableCell>
                            <TableCell key={data.id} align="left">
                              <MdModeEditOutline color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={() => deleteSizeQuantity("index")} />
                              <AiFillDelete color="red" size="20px" style={{ cursor: "pointer", marginLeft: 8 }} onClick={() => deleteSizeQuantity("index")} />

                            </TableCell>
                          </TableRow>
                        )))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id='category'>Category</InputLabel>
                  <Select
                    label='Category'
                    name="category"
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    value={newProduct.category}
                    onChange={(e) => handleSizeQuantity(e)}
                  >
                    {categories.map(c => (
                      <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  required
                  name='code'
                  type='text'
                  label='Code'
                  placeholder='product code'
                  value={newProduct.code}
                  onChange={(e) => handleProductCode(e)}
                />
              </Grid>
              <Grid item xs={4} >
                <Autocomplete
                  options={newProduct.category != '' ? newProduct.filteredData : productMaster}
                  getOptionLabel={option => option.name + " " + option.size}
                  name="productId"
                  value={newProduct.productId ? productMaster.filter(p => p._id === newProduct.productId)[0] : null}
                  onChange={(e, values) => handleSizeQuantity(values?._id, "productId")}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="productId"
                      variant="standard"
                      label="Product Name"
                      placeholder="Product Name"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
                {!type && newProduct.productId && (
                  <a style={{ color: "#9155FD", float: "right", cursor: "pointer" }} onClick={markSegregated}>Segregated</a>
                )}

              </Grid>
              {newProduct?.isSegregated && (
                <>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='category'>From Product</InputLabel>
                      <Select
                        label='From Product'
                        name="from"
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label'
                        value={newProduct.from}
                        onChange={(e) => handleSizeQuantity(e)}
                      >
                        {productMaster.filter(p => p.code === newProduct.code && p._id != newProduct.productId).map(p => (
                          <MenuItem key={p._id} value={p._id}>{p.name + "  " + p.size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='category'>Left Over</InputLabel>
                      <Select
                        label='From Product'
                        name="leftOver"
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label'
                        value={newProduct.leftOver}
                        onChange={(e) => handleSizeQuantity(e)}
                      >
                        {productMaster.filter(p => p.code === newProduct.code).map(p => (
                          <MenuItem key={p._id} value={p._id}>{p.name + "  " + p.size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                </>
              )}
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  required
                  name='quantity'
                  type='text'
                  label='Quantity'
                  placeholder='carterleonard@gmail.com'
                  value={newProduct.quantity}
                  onChange={(e) => handleSizeQuantity(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button style={{ float: 'right' }} disabled={!newProduct.category || !newProduct.code || !newProduct.productId || !newProduct.quantity} onClick={addSizeQuantity} >
                  <BsFillPlusCircleFill color="#9155FD" size="20px" />
                </Button>
              </Grid>

            </Grid>
            <Button variant="outlined" sx={{ float: 'right', margin: '10px 0 20px 0' }} onClick={handleSubmit}>
              Submit
            </Button>

          </form>

        </Card>
      </Grid>

    </Grid>
  )
}

export default withAuth(Sale)
