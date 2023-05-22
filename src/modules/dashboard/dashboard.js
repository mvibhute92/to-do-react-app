import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  TableHead,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TextField,
  TableCell,
  MenuItem,
  Menu,
  Box,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOpenOutlined";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Axios from "axios";
export default function DashboardPage() {
  const [empList, setEmpList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState("Add Employee");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const open = Boolean(anchorEl);

  useEffect(() => {
    getemployee();
  }, []);
  const getemployee = async () => {
    const response = await Axios.get("http://localhost:8000/getemployee");

    if (response.status === 200) {
      setEmpList(response.data.employeeList);
    } else {
      setEmpList([]);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuClicked = (row) => (event) => {
    setSelectedRow({ ...row });
    setAnchorEl(event.currentTarget);
  };
  const handleEdit = () => {
    setAnchorEl(null);
    setIsEdit(true);
    setText("Edit Employee");
    setFormData({ ...selectedRow });
  };
  const handleDelete = async () => {
    setAnchorEl(null);
    const response = await Axios.delete(
      `http://localhost:8000/deleteemployee/${selectedRow._id}`
    );

    if (response.status === 200) {
      getemployee();
    }
  };
  const handleEditCancel = () => {
    setFormData({ first_name: "", last_name: "", email: "", phone: "" });
    setIsEdit(false);
    setText("Add Employee");
  };
  const inputChangeHandler = (e) => {
    const { id, value } = e.target;
    setShowWarning(false);
    setFormData((formData) => ({ ...formData, [id]: value }));
  };
  const handleAddEmployee = async () => {
    if (!Object.values(formData).includes("")) {
      const response = await Axios.post(
        `http://localhost:8000/addemployee`,
        formData
      );

      if (response.status === 200) {
        setFormData({ first_name: "", last_name: "", email: "", phone: "" });
        getemployee();
      }
    } else {
      setShowWarning(true);
    }
  };
  const updatedEmployee = async () => {
    if (!Object.values(formData).includes("")) {
      const response = await Axios.put(
        `http://localhost:8000/editemployee/${selectedRow._id}`,
        formData
      );

      if (response.status === 200) {
        getemployee();
      }
    } else {
      setShowWarning(true);
    }
  };
  return (
    <>
      <Box m={1} display='flex' justifyContent={"flex-end"} sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 999 }}>
        {showWarning && (
          <Alert variant="filled" severity="warning">
            All Fields are mandatory!
          </Alert>
        )}
      </Box>
      <Grid
        container
        xs={6}
        lg={12}
        flex
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid xs={6} lg={8} mt={5} mb={5}>
          <>
            <Typography variant="h6" gutterBottom>
              {text}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="first_name"
                  label="First name"
                  fullWidth
                  type="text"
                  value={formData.first_name}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="last_name"
                  label="Last name"
                  fullWidth
                  type="text"
                  value={formData.last_name}
                  onChange={inputChangeHandler}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="email"
                  label="email"
                  type="email"
                  value={formData.email}
                  fullWidth
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="phone"
                  label="Phone*"
                  type="phone"
                  onChange={inputChangeHandler}
                  value={formData.phone}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={12} justifyContent={"flex-end"}>
                {isEdit ? (
                  <Box>
                    <Button
                      sx={{ marginRight: "10px" }}
                      variant="contained"
                      onClick={updatedEmployee}
                    >
                      Edit Employee
                    </Button>
                    <Button variant="contained" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                )}
              </Grid>
            </Grid>
          </>
        </Grid>
        <Grid xs={6} lg={8} mt={5} mb={5}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ background: "#0000000d" }}>
                <TableRow>
                  <TableCell sx={{ width: "21.25%" }} align="right">
                    First Name
                  </TableCell>
                  <TableCell sx={{ width: "21.25%" }} align="right">
                    Last Name
                  </TableCell>
                  <TableCell sx={{ width: "21.25%" }} align="right">
                    Email
                  </TableCell>
                  <TableCell sx={{ width: "21.25%" }} align="right">
                    Phone
                  </TableCell>
                  <TableCell sx={{ width: "15%" }} align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="right">{row.first_name}</TableCell>
                    <TableCell align="right">{row.last_name}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">
                      <Button>
                        <MenuIcon color="primary" onClick={menuClicked(row)} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleEdit}>
                <CreateIcon></CreateIcon> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon />
                Delete
              </MenuItem>
            </Menu>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
