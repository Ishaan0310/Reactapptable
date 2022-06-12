import './App.css';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import {GridActionsCellItem} from '@mui/x-data-grid';
import React from 'react';
import axios from 'axios';
import apiUrlMapping from '../src/resources/apiMapping.json';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
const geRowWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows){
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}
export default function App() {
  
  const employeetable = [
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (event) => [
        <GridActionsCellItem  onClick={(e) => onClickOfViewButton(event)} icon={<VisibilityIcon/>} label="View" />,                   
        <GridActionsCellItem  onClick={(e) => onClickOfEditButton(event)} icon={<EditIcon/>} label="Edit" />,  
         <GridActionsCellItem onClick={(e) => deleteRecord(event.id)} icon={<DeleteIcon/>} label="Delete" />,
    ]
      
    },
    {
      field: 'employee_id',
      headerName: 'Employee_id',
      headerClassName: 'super-app-theme--header',
      width: 200,
      editable: true,
    },
    {
      field: 'start_date',
      headerName: 'start_date',
      headerClassName: 'super-app-theme--header',
      width: 275,
      editable: true,
    },
    {
      field: 'end_date',
      headerName: 'end_date',
      headerClassName: 'super-app-theme--header',
      width: 250,   
      editable: true,
    },
    {
      field: 'job_id',
      headerName: 'job_id',
      headerClassName: 'super-app-theme--header',
      width: 150,
      editable: true,
    },
    {
      field: 'department_id',
      headerName: 'department_id',
      headerClassName: 'super-app-theme--header',
      width: 150,
      editable: true,
    },
  ]
  
  const [rows, setRows] = React.useState([])
  const [addOrEdit, setAddOrEdit] = React.useState("")
  const [editId, setEditId] = React.useState("")
  const handleClickOpen2 = () => {setOpenView(true);};
  const handleClickOpen = () => {setOpen(true);};
  const [openview, setOpenView] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [employee_id, setemployee_id] = React.useState("");
  const [start_date, setstart_date] = React.useState("");
  const [end_date, setend_date]	= React.useState("");
  const [job_id, setjob_id]	= React.useState("");
  const [department_id, setdepartment_id]	= React.useState("");
  const handleClose = () => {setOpen(false);};
  const handleClose2 = () => {setOpenView(false);};


  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.employeeData.getAll).then(response =>
      {
        setRows(geRowWithId(response.data))

      });
  }
  const onClickofSaveRecord = () => 
  {
    setAddOrEdit("Save")
    setemployee_id("")
    setstart_date("")
    setend_date("")
    setjob_id("")
    setdepartment_id("")
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addOrEditRecordAndClose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
  }

  const addRecordAndClose = () => 
  {
    if (employee_id !== undefined && start_date !== undefined && end_date !== undefined && job_id !== undefined && department_id !== undefined )
	{
      let payload = 
	  {
        "employee_id": employee_id,
        "start_date": start_date,
        "end_date": end_date,
        "job_id": job_id,
        "department_id": department_id,
      
      }
      console.log("The Data to DB is ", payload)
      console.log(apiUrlMapping)
      axios.post(apiUrlMapping.employeeData.Post, payload).then(response => 

	  {
	    getAllRecords()
      handleClose()
      setemployee_id("")
      setstart_date("")
      setend_date("")
      setjob_id("")
      setdepartment_id("")
        
        
      })
    }
  }
const deleteRecord = (index) =>
{
  let dataId = rows[index]._id  
  console.log(apiUrlMapping.employeeData.delete) 
  console.log(dataId)
  axios.delete(apiUrlMapping.employeeData.delete + "/" + dataId).then(()=>{getAllRecords();});

}
const onClickOfEditButton = (e) => 
{
  setAddOrEdit("Edit")
  let editRecord = rows[e.id]
  console.log(editRecord._id)
  setemployee_id(editRecord.employee_id)
  setstart_date(editRecord.start_date)
  setend_date(editRecord.end_date)
  setjob_id(editRecord.job_id)
  setdepartment_id(editRecord.department_id)
  setEditId(editRecord._id)
  handleClickOpen()
} 
const editRecordAndClose = () => 
{
  if (employee_id !== undefined && start_date !== undefined && end_date !== undefined && job_id !== undefined && department_id !== undefined){
    let payload = 
  {
      "employee_id":employee_id,
      "start_date":start_date,
      "end_date":end_date,
      "job_id":job_id,
      "department_id":department_id
  }
 
    axios.put(apiUrlMapping.employeeData.put + "/" + editId, payload).then(response => 
  {
      getAllRecords();
      handleClose();
      
    })
  }
}
const onClickOfViewButton = (e) =>
  {
    let viewRecord = rows[e.id]
    setemployee_id(viewRecord.employee_id)
    setstart_date(viewRecord.start_date)
    setend_date(viewRecord.end_date)
    setjob_id(viewRecord.job_id)
    setdepartment_id(viewRecord.department_id)
    handleClickOpen2()
  }
  return (
    <div className="tabularcomponents-centered">
      <div className="text-alligned">
      <br></br>
       <br></br>
        <h1 id="under">Employee Data</h1>
       <br></br>
       <br></br>
       <br></br>
      </div>
       <div className='gri' >
       <DataGrid
            rows={rows}
            columns={employeetable}
            components={{Toolbar: GridToolbar,}}
            componentsProps={{toolbar:{ showQuickFilter: true}}}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            
            />
       
       </div>
       <div className="center" >
          <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
  </div>
  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save employee Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="employee_id"  onChange={(e) => { setemployee_id(e.target.value) }}value={employee_id}label="employee_id"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="start_date" onChange={(e) => { setstart_date(e.target.value) }}value={start_date} label="start_date" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="end_date" onChange={(e) => { setend_date(e.target.value) }} value={end_date} label="end_date" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="job_id" onChange={(e) => { setjob_id(e.target.value) }} value={job_id} label="job_id" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="department_id" onChange={(e) => { setdepartment_id(e.target.value) }} value={department_id} label="department_id" type="text" fullWidth/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>
  <Dialog open={openview} onClose={handleClose2}>
        <DialogTitle>Employee</DialogTitle>
        <DialogContent>
          <TextField disabled={true} autoFocus margin="dense" id="employee_id" onChange={(e) => { setemployee_id(e.target.value) }} value={employee_id} label="employee_id" type="text" fullWidth />
          <TextField disabled={true} autoFocus margin="dense" id="start_date" onChange={(e) => { setstart_date(e.target.value) }} value={start_date} label="start_date" type="text" fullWidth />
          <TextField disabled={true} autoFocus margin="dense" id="end_date" onChange={(e) => { setend_date(e.target.value) }} value={end_date} label="end_date" type="text" fullWidth />
          <TextField disabled={true} autoFocus margin="dense" id="job_id" onChange={(e) => { setjob_id(e.target.value) }} value={job_id} label="job_id" type="text" fullWidth />
          <TextField disabled={true} autoFocus margin="dense" id="department_id" onChange={(e) => { setdepartment_id(e.target.value) }} value={department_id} label="department_id" type="text" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

