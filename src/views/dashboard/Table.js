// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import { useEffect } from 'react'
import SellStock from '../sellStock'
import { useState } from 'react'
import { CSVLink } from "react-csv";
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { Autocomplete, Button, Menu, MenuItem, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import { SlOptionsVertical } from 'react-icons/sl'
import axiosInstance from 'src/hoc/axios'
import { Grid } from 'mdi-material-ui'

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const DashboardTable = ({ data, columns, fetch, applyFilters, categories, subCategory, handleSubCategoryChange, filteredColumns, filteredSubCategories, handleCategoryChange, category }) => {

  const [toaster, setToaster] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [editStock, setEditStock] = useState(null);
  const [filteredData, setFilteredData] = useState([]);


  const [stock, setStock] = useState(null);


  const [anchorEl, setAnchorEl] = useState(null);
  const openEl = Boolean(anchorEl);




  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (stock) => {
    setStock(stock);
  };

  const handleClose = () => {
    setStock(null)
  };

  const handleOpenToaster = () => {
    setToaster(true);
  }

  const handleCloseToaster = () => {
    setToaster(false);
  }

  const getHeaders = () => {
    const headers = [
      { label: "Name", key: "name" },
      { label: "Code", key: "code" },

    ];

    (filteredColumns.length > 0 ? filteredColumns : columns.filter(c => c.categoryId[0]._id === category._id))[0]?.size?.forEach(element => {
      headers.push({ label: element, key: element })
    });

    return headers
  }


  const csvReport = {
    data: data,
    headers: getHeaders(),
    filename: "stocks",
  };


  const handleSearch = value => {
    setSearchValue(value)

    const searchRegex = new RegExp(escapeRegExp(value), 'i')

    const filteredRows = data.filter(row => {

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



  return (
    <>
      <Card>
        <FormControl>
          <Autocomplete
            disableClearable
            options={categories}
            getOptionLabel={option => option.name}
            name="category"
            sx={{ width: '220px', marginLeft: '10px' }}
            onChange={handleCategoryChange}
            value={category}
            renderInput={params => (
              <TextField
                {...params}
                name="categoryId"
                variant="standard"
                label="Category"
                placeholder="Category"
                margin="normal"
              />
            )}
          />
        </FormControl>
        <FormControl>
          <Autocomplete
            disableClearable
            options={filteredSubCategories}
            getOptionLabel={option => option.name}
            name="subCategory"
            sx={{ width: '220px', marginLeft: '10px' }}
            onChange={handleSubCategoryChange}
            value={subCategory}
            renderInput={params => (
              <TextField
                {...params}
                name="subCategoryId"
                variant="standard"
                label="Sub-Category"
                placeholder="Sub-Category"
                margin="normal"
              />
            )}
          />
        </FormControl>
        {/* <FormControl>
          <Button variant='contained' sx={{ marginTop: "30px", marginLeft: "20px" }} onClick={() => applyFilters(category._id, subCategory._id)}>
            Apply
          </Button>
        </FormControl> */}

        <Button
          id="demo-positioned-button"

          // variant='outlined'
          sx={{ marginTop: '15px', float: 'right' }}
          aria-controls={openEl ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openEl ? 'true' : undefined}
          onClick={handleClick}
        >
          <SlOptionsVertical />
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={openEl}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem > <CSVLink {...csvReport}
            style={{
              // color: "rgb(105 57 191) !important",
              textDecoration: "none",
              color: '#111'

              // fontWeight: "600",
              // border: "1px solid",
              // height: "35px",
              // display: "flex",
              // width: "70px",
              // borderRadius: "2%",
              // textAlign: "center",
              // padding: "5px",
              // margin: "10px"
            }}
          >Export</CSVLink></MenuItem>
        </Menu>
        <FormControl sx={{ float: 'right', marginTop: '10px' }}>
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




        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>{category?.name}</TableCell>
                {/* <TableCell>Size</TableCell>
                <TableCell>Qty</TableCell> */}
                {(filteredColumns.length > 0 ? filteredColumns : columns.filter(c => c.categoryId[0]._id === category._id))[0]?.size?.map(c => (
                  <TableCell key={c}>{c}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>

              {Object.keys(searchValue ? filteredData : data).length === 0 && (
                <Typography sx={{ display: 'flex', alignItems: 'center', margin: "20px" }}>No Data Found</Typography>

              )}

              {(searchValue ? filteredData : data).map((d, index) => (
                <TableRow hover key={d.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }} style={{ backgroundColor: (index % 2 === 0) && '#f1f1f1' }} >
                  <TableCell key={d.id} align="left"> {d.name}
                  </TableCell>

                  {(filteredColumns.length > 0 ? filteredColumns : columns.filter(c => c.categoryId[0]._id === category._id))[0]?.size?.map(c => (
                    <TableCell key={c}> {d[c]} </TableCell>

                    // d.filter(dd => dd.size === c).map(dd => (
                    //   <TableCell key={c}> {dd.quantity || 0} </TableCell>
                    // ))
                  ))}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card >
      <SellStock handleClose={handleClose} stock={stock} />
    </>
  )
}

export default DashboardTable
