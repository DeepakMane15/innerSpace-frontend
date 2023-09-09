// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField';

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
import { Alert, Button, Snackbar } from '@mui/material'
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

const Purchase = ({ editPurchase, type }) => {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [toaster, setToaster] = useState(false);
  const [editStock, setEditStock] = useState(null);


  const [open, setOpen] = useState(false);



  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([{ category: undefined, code: undefined, productId: undefined, quantity: undefined, filteredData: [] }]);

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

          // type: type ? "purchase" : "sell",
          type: 'purchase',
          invoiceDate: date
        }
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
    setProducts([{ category: "", productId: "", code: "", size: "", quantity: "", filteredData: [] }])
    setParty("");
    setInvoice("");
    setDate(moment().format("YYYY-MM-DD"))

  }

  const handleSizeQuantity = (index, e, name) => {

    let entity, value;

    if (name) {
      entity = name;
      value = e;
    } else {
      entity = e.target.name;
      value = e.target.value;
    }

    let data = [...products];


    if (entity === 'productId') {

      let productCode = productMaster.filter(p => p._id === value);
      let data = [...products];
      if (productCode && productCode[0]?.code != data[index]['code']) {
        data[index]['code'] = productCode[0]?.code;
        setProducts(data);
      }
    } else if (e.target.name === 'category') {
      let data = [...products];
      data[index]['filteredData'] = productMaster.filter(p => p.categoryId._id === e.target.value);;
      setProducts(data);
    }
    data[index][entity] = value;
    setProducts(data);

  }

  const addSizeQuantity = () => {
    let newfield = { category: undefined, code: undefined, productId: undefined, quantity: undefined, filteredData: [] }
    setProducts([...products, newfield])
  }

  const deleteSizeQuantity = (index) => {
    // alert(index);

    // return;
    let data = [...products];
    data.splice(index, 1)
    setProducts(data)
  }

  const handleProductCode = (e, index) => {
    let data = [...products];
    data[index]['code'] = e.target.value;
    setProducts(data);

    const searchRegex = new RegExp(escapeRegExp(e.target.value), 'i')

    const filteredRows = productMaster.filter(row => {
      return Object.keys(row).some(field => {

        // @ts-ignore

        return searchRegex.test(row['code'].toString())
      })
    })
    if (e.target.value.length) {
      if (filteredRows.length > 0) {

        let data = [...products];
        data[index]['productId'] = filteredRows[0]._id;
        data[index]['filteredData'] = filteredRows;
        setProducts(data);
      }

    } else {
      let data = [...products];
      data[index]['filteredData'] = [];
      setProducts(data);
    }
  }

  const markSegregated = (index) => {
    let data = [...products];
    data[index]['isSegregated'] = true;
    data[index]['from'] = '';
    data[index]['leftOver'] = '';
    setProducts(data);
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
          <CardHeader title='Add Purchase' titleTypographyProps={{ variant: 'h6' }} />
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
                <Typography variant='subtitle1' >Add products</Typography>
              </Grid>

              {products.map((q, index) => (<>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id='category'>Category</InputLabel>
                    <Select
                      label='Category'
                      name="category"
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                      value={q.category}
                      onChange={(e) => handleSizeQuantity(index, e)}
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
                    value={q.code}
                    onChange={(e) => handleProductCode(e, index)}
                  />
                </Grid>
                <Grid item xs={4} >
                  <Autocomplete
                    options={q.category != '' ? q.filteredData : productMaster}
                    getOptionLabel={option => option.name + " " + option.size}
                    name="productId"
                    onChange={(e, values) => handleSizeQuantity(index, values?._id, "productId")}
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
                  {type && q.productId && (
                    <a style={{ color: "#9155FD", float: "right", cursor: "pointer" }} onClick={() => markSegregated(index)}>Segregated</a>
                  )}

                </Grid>
                {q?.isSegregated && (
                  <>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id='category'>From Product</InputLabel>
                        <Select
                          label='From Product'
                          name="from"
                          id='form-layouts-separator-select'
                          labelId='form-layouts-separator-select-label'
                          value={q.from}
                          onChange={(e) => handleSizeQuantity(index, e)}
                        >
                          {productMaster.filter(p => p.code === q.code && p._id != q.productId).map(p => (
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
                          value={q.leftOver}
                          onChange={(e) => handleSizeQuantity(index, e)}
                        >
                          {productMaster.filter(p => p.code === q.code).map(p => (
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
                    value={q.quantity}
                    onChange={(e) => handleSizeQuantity(index, e)}
                  />
                </Grid>
                {(index > 0) && (
                  <Grid item xs={12}>
                    <AiFillDelete color="red" size="20px" style={{ cursor: "pointer" }} onClick={() => deleteSizeQuantity(index)} />
                  </Grid>
                )}
              </>
              ))}

              <Grid item xs={6}>
                <BsFillPlusCircleFill color="#9155FD" size="20px" style={{ cursor: "pointer" }} onClick={addSizeQuantity} />
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

export default withAuth(Purchase)
