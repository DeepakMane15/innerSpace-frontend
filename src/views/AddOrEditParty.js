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




const AddOrEditParty = ({ open, setOpen, setToaster, setErrorToaster, handleClickOpen, handleClose, handleOpenToaster, fetch, setEditParty, editParty }) => {

  const [name, setName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [nameError, setNameError] = useState(false);
  const [gstNoError, setGstNoError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [contactNoError, setContactNoError] = useState(false);


  React.useEffect(() => {
    console.log("editParty ", editParty)
    if (editParty) {
      setName(editParty.name);
      setGstNo(editParty.gstNo);
      setState(editParty.state);
      setAddress(editParty.address);
      setContactNo(editParty.contactNo);

    } else {
      setName('');
      setGstNo('');
      setState('');
      setAddress('');
      setContactNo('');
    }

  }, [editParty])

  const handleSubmit = () => {

    if (!name || !gstNo || !state || !address || !contactNo) {

      if (!name) {
        setNameError(true);
      }

      if (!gstNo) {
        setGstNoError(true);
      }

      if (!state) {
        setStateError(true);
      }
      if (!address) {
        setAddressError(true);
      }
      if (!contactNo) {
        setContactNoError(true);
      }

      return;
    }


    setNameError(false);
    setGstNoError(false);
    setStateError(false);
    setAddressError(false);
    setContactNoError(false);


    try {
      const data = {
        name: name,
        address: address,
        gstNo: gstNo,
        contactNo: contactNo,
        state: state,

      }
      if (editParty) {
        data.id = editParty._id
      }

      // axiosInstance.post("client", data)
      (open ? axiosInstance.post("client", data) : axiosInstance.put("client/update", data))
        .then(res => {
          if (res.data.status === 200) {
            setToaster(res.data.message);
            reset();
            handleClose();

            // handleOpenToaster();
            fetch();
          } else {
            setErrorToaster(true);
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

  const reset = () => {
    setName("")
    setGstNo("")
    setState("")
    setAddress("")
    setContactNo("")

    setNameError(false);
    setGstNoError(false);
    setStateError(false);
    setAddressError(false);
    setContactNoError(false);
  }

  return (
    <div>

      <Dialog open={open || editParty} onClose={handleClose}>
        <DialogTitle>{open ? 'Add' : editParty && 'Update'} Party</DialogTitle>
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
                  error={nameError}
                  name='partyName'
                  type='text'
                  label='Party Name'
                  placeholder='Party name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={addressError}
                  name='address'
                  type='text'
                  label='Address'
                  placeholder='address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={gstNoError}
                  name='gstNo'
                  type='text'
                  label='GST No'
                  placeholder='GST No'
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={stateError}
                  name='state'
                  type='text'
                  label='State & State Code'
                  placeholder='State & State Code'
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={contactNoError}
                  name='contactNo'
                  type='number'
                  label='Contact No'
                  placeholder='Contect No'
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </Grid>

            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>Reset</Button>
          <Button type="submit"
            onClick={handleSubmit}
          >{open ? 'Add' : editParty && 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddOrEditParty;
