import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MdModeEditOutline } from 'react-icons/md'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import axiosInstance from 'src/hoc/axios';




const AddOrEditProductMaster = ({ open, setOpen, handleClickOpen, handleClose, handleOpenToaster, fetch, setEditMaster, editMaster }) => {

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("648e1709d1da73680b68f45d");
  const [subCategory, setSubCategory] = useState("648e18f20f0c7fc6c1f7616b");

  const categories = ['instant', 'odd']


  React.useEffect(() => {
    console.log("editMaster ", editMaster)

  }, [editMaster])

  const handleSubmit = () => {
    alert("f")
    try {
      const data = {

        name: name,
        categoryId: category,
        subCategoryId: subCategory,
      }
      axiosInstance.post("product", data)
        .then(res => {
          console.log(res.data.data);
          reset();
          handleClose();
          handleOpenToaster();
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

  const reset = () => {
    setName("");
    setCode("")

  }

  return (
    <div>

      <Dialog open={open || editMaster} onClose={handleClose}>
        <DialogTitle>Add Master</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
            <Grid container spacing={5} component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: "max" },
              }}
              noValidate
              autoComplete="off">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name='ProductName'
                  type='text'
                  label='Product Name'
                  placeholder='Product name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name='productCode'
                  type='text'
                  label='Product Code'
                  placeholder='Product Code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Grid> */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  name='category'
                  type='text'
                  label='Product Category'
                  placeholder='Product Category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  name='subCategory'
                  type='text'
                  label='Sub Category'
                  placeholder='Sub Category'
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit"
            onClick={handleSubmit}
          >Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddOrEditProductMaster;
