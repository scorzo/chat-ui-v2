import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, TextField, InputAdornment, TableContainer, Table, TableBody, TableCell, TableRow, Paper, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, MenuItem, Select, Accordion, AccordionSummary, AccordionDetails, TableHead } from '@mui/material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LaunchIcon from '@mui/icons-material/Launch';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AdminInterface = () => {
  const [activeSection, setActiveSection] = useState('Welcome');
  const [editMode, setEditMode] = useState(false); // To handle Edit view for Main Prompt
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [moduleName, setModuleName] = useState('Itinerary Tool');
  const [branchName, setBranchName] = useState('Family > Trips');
  const [moduleDescription, setModuleDescription] = useState('Use this tool for creating family trip ideas.');
  const [optionalFields, setOptionalFields] = useState({
    importSpreadsheet: 'off',
    mergeSpreadsheet: 'off',
    scrapeURL: 'off',
  });
  const [pydanticCode, setPydanticCode] = useState(`class Itinerary(BaseModel):
  trip_id: str
  user_id: str
  name: str
  start_date: str
  end_date: str
  destinations: List[Destination]
  notes: str
  number_of_adults: int
  number_of_children: int`);

  const [jsxCode, setJsxCode] = useState(`import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css';
import './FamilyHealthModalContent.css'; // Additional CSS for family health theme

const FamilyHealthModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

  const { details } = node;
  const people = details?.family_members || [];

  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState(people[selectedPersonIndex] || {});

  useEffect(() => {
      setEditDetails(people[selectedPersonIndex] || {});
  }, [selectedPersonIndex, people]);`);

  const [leafType, setLeafType] = useState('single');

  const modules = [
    { name: 'Itinerary Tool', status: 'active', dateCreated: '2024-09-15' },
    { name: 'Bills Management', status: 'active', dateCreated: '2024-09-20' },
    { name: 'Meal Planning', status: 'active', dateCreated: '2024-09-22' },
  ];

  const api_tools = [
    {
      name: 'Calendar',
      description: 'Manage personal calendar data.',
      status: 'active',
      properties: ['sync', 'addEvent', 'removeEvent'],
      properties_required: { sync: true, addEvent: false, removeEvent: true },
      function_body: '', // New field
    },
    {
      name: 'Hotel API',
      description: 'Search and book hotel reservations.',
      status: 'active',
      properties: ['searchHotels', 'bookRoom', 'cancelBooking'],
      properties_required: { searchHotels: true, bookRoom: true, cancelBooking: false },
      function_body: '', // New field
    },
    {
      name: 'Ticketmaster API',
      description: 'Search and book concert dates.',
      status: 'active',
      properties: ['searchEvents', 'bookTicket', 'refundTicket'],
      properties_required: { searchEvents: true, bookTicket: false, refundTicket: false },
      function_body: '', // New field
    }
  ];



  useEffect(() => {
    if (!window.name) {
      window.name = "AdminConsoleWindow";
    }
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setSelectedModule(null);
  };

  const handleEditMainPromptClick = () => {
    setEditMode(true); // Enable edit mode for Main Prompt
  };

  const handleBackClick = () => {
    setEditMode(false); // Go back to the main content for Main Prompt
  };


  const handleModuleEditClick = (module) => {
    setSelectedModule(module);
    // setActiveSection('Itinerary Tool');
    setEditMode(true); // Enable edit mode for Main Prompt
  };

  const handleToolEditClick = (tool) => {
    setSelectedTool(tool);
    // setActiveSection('Itinerary Tool');
    setEditMode(true); // Enable edit mode for Main Prompt
  };

  const handleRadioChange = (event) => {
    setOptionalFields({ ...optionalFields, [event.target.name]: event.target.value });
  };


  const handleCreateToolClick = () => {
    // Placeholder function for creating a new API tool
    console.log("Create API Tool button clicked!");
    // You can add further logic here, such as opening a form to create a new API tool
  };

  const handleCreateModuleClick = () => {
    // Placeholder function for creating a new Module
    console.log("Create Module button clicked!");
    // You can add further logic here, such as opening a form to create a new Module
  };


  const renderSectionHeader = (sectionName, onEditClick) => (
      <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
        <Typography variant="h6" style={{ textAlign: 'left', marginRight: '16px' }}>
          {sectionName}
        </Typography>
        {onEditClick && (
            <Button
                variant="text"
                style={{ color: '#2196f3' }}
                startIcon={<EditOutlinedIcon style={{ color: '#2196f3' }} />}
                onClick={onEditClick}
            >
              EDIT
            </Button>
        )}
      </div>
  );


  return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar position="fixed" style={{ backgroundColor: '#333', zIndex: 1201 }}>
          <Toolbar>
            <Typography
                variant="h6"
                style={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => handleSectionClick('Welcome')}
            >
              LOWCODE/NOCODE INTERFACE
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
            <Avatar style={{ backgroundColor: '#2196f3' }}>A</Avatar>
          </Toolbar>
        </AppBar>

        <div style={{ display: 'flex', flexGrow: 1, marginTop: '64px' }}>
          {/* Sidebar */}
          <div style={{ width: '250px', backgroundColor: '#222', height: '100vh', paddingTop: '10px', color: '#fff', flexShrink: 0, position: 'fixed', top: '64px', bottom: 0, overflowY: 'auto' }}>
            <Accordion expanded={activeSection === 'Main Prompt'} onChange={() => handleSectionClick('Main Prompt')}>
              <AccordionSummary>Main Prompt</AccordionSummary>
              <AccordionDetails>
                <p>This is the main prompt given to the agent.</p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={activeSection === 'Parent Hierarchy'} onChange={() => handleSectionClick('Parent Hierarchy')}>
              <AccordionSummary>Parent Hierarchy (Branches)</AccordionSummary>
              <AccordionDetails>
                <p>All modules will be made of branches and leaves on this main structure.</p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={activeSection === 'Modules'} onChange={() => handleSectionClick('Modules')}>
              <AccordionSummary>Modules (Leaves)</AccordionSummary>
              <AccordionDetails>
                <p>Define the structures that hold your data.</p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={activeSection === 'API Tools'} onChange={() => handleSectionClick('API Tools')}>
              <AccordionSummary>API Tools</AccordionSummary>
              <AccordionDetails>
                <p>External API-driven tools (have access to the outside world).</p>
              </AccordionDetails>
            </Accordion>

            {/* Launch Agent Section */}
            <div style={{ padding: '10px', marginTop: 'auto', textAlign: 'center', cursor: 'pointer' }} onClick={() => window.open('http://localhost:3000/', 'AgentWindow')}>
              <Typography variant="body1" style={{ color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Launch Agent <LaunchIcon style={{ marginLeft: '5px' }} />
              </Typography>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flexGrow: 1, color: '#000', backgroundColor: '#fff', padding: '0', marginLeft: '250px', textAlign: 'center' }}>
            {activeSection === 'Welcome' ? (
                <>
                  <img src="/low_code.png" alt="Low-code/no-code" style={{ marginTop: '20px', width: '25%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                  <Typography variant="h4" style={{ fontSize: '2rem', marginTop: '20px' }}>
                    LOWCODE/NOCODE INTERFACE
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    Low code/no-code interface for agent tool. <a href="#learn-more" style={{ color: '#2196f3' }}>Learn more</a> or get started by <a href="#parent-hierarchy" style={{ color: '#2196f3' }}>defining your parent hierarchy</a>.
                  </Typography>
                </>
            ): activeSection === 'Main Prompt' && !editMode ? (
                    <>
                      {/* Header Bar for Main Prompt */}
                      {renderSectionHeader('Main Prompt', handleEditMainPromptClick)}

                      {/* Content for Main Prompt */}
                      <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
                        <p>You are a personal digital assistant tasked with helping bring the family closer together.</p>
                      </div>
                    </>
                ) : activeSection === 'Main Prompt' && editMode ? (
                    <>
                      {/* Header Bar for Edit Main Prompt */}
                      <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                        <IconButton onClick={handleBackClick} style={{ color: '#2196f3' }}>
                          <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" style={{ textAlign: 'left', marginRight: '16px' }}>
                          Edit Main Prompt
                        </Typography>
                      </div>

                      {/* Edit Content for Main Prompt */}
                      <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
                        <textarea
                            value="You are a personal digital assistant tasked with helping bring the family closer together."
                            rows="4"
                            cols="50"
                            style={{ width: '90%', padding: '10px', fontSize: '14px' }}
                            readOnly
                        />
                      </div>


                      {/* Footer Bar for Edit Main Prompt */}
                      <div style={{ position: 'fixed', bottom: 0, left: 250, width: 'calc(100% - 250px)', backgroundColor: '#fff', borderTop: '1px solid #ddd', padding: '10px 16px', display: 'flex', justifyContent: 'flex-start' }}>
                        <Button variant="contained" style={{ backgroundColor: '#2196f3', color: '#fff', marginRight: '10px' }}>SAVE</Button>
                        <Button variant="text" style={{ color: '#2196f3' }}>CANCEL</Button>
                      </div>
                    </>


            ): activeSection === 'Modules' && !editMode ? (
                <>
                  {/* Header Bar for Modules */}
                  <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                    <Typography variant="h6" style={{ textAlign: 'left' }}>
                      Modules
                    </Typography>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#2196f3', color: '#fff', display: 'flex', alignItems: 'center', marginLeft: '16px' }}  // Adds space to the left of the button
                        startIcon={<AddIcon style={{ color: '#fff' }} />}
                        onClick={handleCreateModuleClick}
                    >
                      CREATE MODULE
                    </Button>
                  </div>

                  {/* Filter and Table */}
                  <div style={{ width: '90%', margin: '20px auto', paddingTop: '100px' }}> {/* Adjusted paddingTop for the fixed header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FilterListIcon />
                        <Typography variant="body1" style={{ marginLeft: '10px' }}>Filter</Typography>
                      </div>
                      <TextField
                          variant="outlined"
                          placeholder="Enter module name"
                          size="small"
                          InputProps={{
                            style: { borderRadius: '0' },
                            startAdornment: (
                                <InputAdornment position="start">
                                  <IconButton disabled>
                                    <FilterListIcon />
                                  </IconButton>
                                </InputAdornment>
                            )
                          }}
                      />
                    </div>

                    {/* Table */}
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          {modules.map((module, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <CheckCircleIcon style={{ color: 'darkgreen' }} />
                                </TableCell>
                                <TableCell><a href="#" onClick={() => handleModuleEditClick(module.name)} style={{ color: '#2196f3', textDecoration: 'none' }}>{module.name}</a></TableCell>
                                <TableCell>{module.dateCreated}</TableCell>
                                <TableCell>

                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </>

            ): activeSection === 'Modules' && editMode ? (

                <>
                  {/* Header Bar for Itinerary Tool */}

                  <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                    <IconButton onClick={handleBackClick} style={{ color: '#2196f3' }}>
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ textAlign: 'left', marginRight: '16px' }}>
                      Edit Itinerary Tool
                    </Typography>
                  </div>

                  {/* Content for Itinerary Tool */}
                  <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
                    <Typography variant="h6">Info</Typography>
                    <div style={{ borderBottom: '1px solid lightgrey', marginBottom: '10px' }}>
                      <TextField
                          label="Module Name"
                          value={moduleName}
                          onChange={(e) => setModuleName(e.target.value)}
                          fullWidth
                          margin="normal"
                      />
                      <TextField
                          label="Module Description"
                          value={moduleDescription}
                          onChange={(e) => setModuleDescription(e.target.value)}
                          fullWidth
                          margin="normal"
                      />
                      <TextField
                          label="Branch Name"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                          fullWidth
                          margin="normal"
                      />
                    </div>

                    <Typography variant="h6">Optional Interface Functionality</Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Functionality</TableCell>
                            <TableCell align="center">On</TableCell>
                            <TableCell align="center">Off</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Import Spreadsheet */}
                          <TableRow>
                            <TableCell>Import spreadsheet data field and button</TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.importSpreadsheet === 'on'}
                                  onChange={(e) => handleRadioChange(e, 'importSpreadsheet')}
                                  value="on"
                                  name="importSpreadsheet"
                                  inputProps={{ 'aria-label': 'On' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.importSpreadsheet === 'off'}
                                  onChange={(e) => handleRadioChange(e, 'importSpreadsheet')}
                                  value="off"
                                  name="importSpreadsheet"
                                  inputProps={{ 'aria-label': 'Off' }}
                              />
                            </TableCell>
                          </TableRow>

                          {/* Merge Spreadsheet */}
                          <TableRow>
                            <TableCell>Merge spreadsheet data field and button</TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.mergeSpreadsheet === 'on'}
                                  onChange={(e) => handleRadioChange(e, 'mergeSpreadsheet')}
                                  value="on"
                                  name="mergeSpreadsheet"
                                  inputProps={{ 'aria-label': 'On' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.mergeSpreadsheet === 'off'}
                                  onChange={(e) => handleRadioChange(e, 'mergeSpreadsheet')}
                                  value="off"
                                  name="mergeSpreadsheet"
                                  inputProps={{ 'aria-label': 'Off' }}
                              />
                            </TableCell>
                          </TableRow>

                          {/* Scrape Webpage URL */}
                          <TableRow>
                            <TableCell>Scrape webpage URL field and button</TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.scrapeURL === 'on'}
                                  onChange={(e) => handleRadioChange(e, 'scrapeURL')}
                                  value="on"
                                  name="scrapeURL"
                                  inputProps={{ 'aria-label': 'On' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Radio
                                  checked={optionalFields.scrapeURL === 'off'}
                                  onChange={(e) => handleRadioChange(e, 'scrapeURL')}
                                  value="off"
                                  name="scrapeURL"
                                  inputProps={{ 'aria-label': 'Off' }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>


                    <Typography variant="h6">Pydantic Data Structure</Typography>
                    <TextField
                        label="Pydantic Data Structure"
                        value={pydanticCode}
                        onChange={(e) => setPydanticCode(e.target.value)}
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        margin="normal"
                        style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px' }}
                    />

                    <Typography variant="h6">JSX Interface</Typography>
                    <div style={{ borderBottom: '1px solid lightgrey', marginBottom: '10px' }}>
                      <FormControl fullWidth>
                        <FormLabel>Single instance or multi instance leaf:</FormLabel>
                        <Select
                            value={leafType}
                            onChange={(e) => setLeafType(e.target.value)}
                        >
                          <MenuItem value="single">Single Instance</MenuItem>
                          <MenuItem value="multi">Multi Instance</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <TextField
                        label="JSX Interface"
                        value={jsxCode}
                        onChange={(e) => setJsxCode(e.target.value)}
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        margin="normal"
                        style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px' }}
                    />
                  </div>

                  {/* Fixed Bottom Bar */}
                  <div style={{ position: 'fixed', bottom: 0, left: 250, width: 'calc(100% - 250px)', backgroundColor: '#fff', borderTop: '1px solid #ddd', padding: '10px 16px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Button variant="contained" style={{ backgroundColor: '#2196f3', color: '#fff', marginRight: '10px' }}>SAVE</Button>
                    <Button variant="text">CANCEL</Button>
                  </div>
                </>

            ): activeSection === 'Parent Hierarchy' && !editMode ? (
              <>
            {/* Header Bar for Main Prompt */}
            {renderSectionHeader('Parent Hierarchy', handleEditMainPromptClick)}

            {/* Content for Main Prompt */}
                <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>

                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
    {`{
  "Self": {
    "Family": {
      "Family Members": {},
      "Health": {
        "Physical Health": {},
        "Mental Health": {},
        "Preventive Care": {},
        "Emergency Care": {}
      },
      "Organizing/Planning": {
        "Household": {
          "Cleaning Schedule": {},
          "Maintenance": {},
          "Shopping List": {},
          "Family Calendar": {}
        },
        "Finance": {}
      },
      "Activities": {
        "Hobbies": {},
        "Family Outings": {},
        "Educational Activities": {},
        "Vacation Planning": {}
      }
    }
  }
}`}
  </pre>


                </div>

              </>
              ) : activeSection === 'Parent Hierarchy' && editMode ? (
              <>
            {/* Header Bar for Edit Parent Hierarchy */}
              <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
              <IconButton onClick={handleBackClick} style={{ color: '#2196f3' }}>
              <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" style={{ textAlign: 'left', marginRight: '16px' }}>
              Edit Parent Hierarchy
              </Typography>
              </div>

            {/* Edit Content for Parent Hierarchy */}
              <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px' }}>
    {`{
  "Self": {
    "Family": {
      "Family Members": {},
      "Health": {
        "Physical Health": {},
        "Mental Health": {},
        "Preventive Care": {},
        "Emergency Care": {}
      },
      "Organizing/Planning": {
        "Household": {
          "Cleaning Schedule": {},
          "Maintenance": {},
          "Shopping List": {},
          "Family Calendar": {}
        },
        "Finance": {}
      },
      "Activities": {
        "Hobbies": {},
        "Family Outings": {},
        "Educational Activities": {},
        "Vacation Planning": {}
      }
    }
  }
}`}
  </pre>
              </div>

            {/* Footer Bar for Edit Parent Hierarchy */}
              <div style={{ position: 'fixed', bottom: 0, left: 250, width: 'calc(100% - 250px)', backgroundColor: '#fff', borderTop: '1px solid #ddd', padding: '10px 16px', display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="contained" style={{ backgroundColor: '#2196f3', color: '#fff', marginRight: '10px' }}>SAVE</Button>
              <Button variant="text" style={{ color: '#2196f3' }}>CANCEL</Button>
              </div>
              </>
            ): activeSection === 'API Tools' && !editMode ? (
                <>
                  {/* Header Bar for API Tools */}

                  <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                    <Typography variant="h6" style={{ textAlign: 'left' }}>
                      API Tools
                    </Typography>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#2196f3', color: '#fff', display: 'flex', alignItems: 'center', marginLeft: '16px' }}  // Adds space to the left of the button
                        startIcon={<AddIcon style={{ color: '#fff' }} />}
                        onClick={handleCreateToolClick}
                    >
                      CREATE API TOOL
                    </Button>
                  </div>




                  {/* Filter and Table */}
                  <div style={{ width: '90%', margin: '20px auto', paddingTop: '100px' }}> {/* Adjusted paddingTop for the fixed header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FilterListIcon />
                        <Typography variant="body1" style={{ marginLeft: '10px' }}>Filter</Typography>
                      </div>
                      <TextField
                          variant="outlined"
                          placeholder="Enter API Tool name"
                          size="small"
                          InputProps={{
                            style: { borderRadius: '0' },
                            startAdornment: (
                                <InputAdornment position="start">
                                  <IconButton disabled>
                                    <FilterListIcon />
                                  </IconButton>
                                </InputAdornment>
                            )
                          }}
                      />
                    </div>

                    {/* Table */}
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          {api_tools.map((tool, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <CheckCircleIcon style={{ color: 'darkgreen' }} />
                                </TableCell>
                                <TableCell><a href="#" onClick={() => handleToolEditClick(tool.name)} style={{ color: '#2196f3', textDecoration: 'none' }}>{tool.name}</a></TableCell>
                                <TableCell>{tool.dateCreated}</TableCell>
                                <TableCell>

                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </>

            ) : activeSection === 'API Tools' && editMode ? (
                <>
                  {/* Header Bar for Edit Main Prompt */}
                  <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px 0', borderBottom: '1px solid #ddd', position: 'fixed', top: '64px', zIndex: 1100, display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
                    <IconButton onClick={handleBackClick} style={{ color: '#2196f3' }}>
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ textAlign: 'left', marginRight: '16px' }}>
                      Edit API Tools ({selectedTool || 'Tool Name'})
                    </Typography>
                  </div>



                  {/* Retrieve the selected tool's data */}
                  {selectedTool && (
                      <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
                        {/* Find the selected tool data */}
                        {(() => {
                          const selectedToolData = api_tools.find((tool) => tool.name === selectedTool);

                          return selectedToolData ? (
                              <>
                                <div style={{ borderBottom: '1px solid lightgrey', marginBottom: '10px' }}>
                                  <TextField
                                      label="Tool Name"
                                      value={selectedToolData.name}
                                      onChange={(e) => {
                                        const updatedTool = { ...selectedToolData, name: e.target.value };
                                        setSelectedTool(updatedTool.name); // Update selectedTool if name changes
                                      }}
                                      fullWidth
                                      margin="normal"
                                  />
                                  <TextField
                                      label="Tool Description"
                                      value={selectedToolData.description}
                                      onChange={(e) => {
                                        selectedToolData.description = e.target.value;
                                        setSelectedTool(selectedToolData.name);
                                      }}
                                      fullWidth
                                      margin="normal"
                                  />
                                  <TextField
                                      label="Properties (comma separated)"
                                      value={selectedToolData.properties.join(', ')}
                                      onChange={(e) => {
                                        selectedToolData.properties = e.target.value.split(',').map(p => p.trim());
                                        setSelectedTool(selectedToolData.name);
                                      }}
                                      fullWidth
                                      margin="normal"
                                  />
                                </div>

                                <Typography variant="h6">Properties Required</Typography>
                                <TableContainer component={Paper}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Property</TableCell>
                                        <TableCell align="center">Required</TableCell>
                                        <TableCell align="center">Not Required</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {selectedToolData.properties.map((property, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{property}</TableCell>
                                            <TableCell align="center">
                                              <Radio
                                                  checked={selectedToolData.properties_required[property] === true}
                                                  onChange={(e) => {
                                                    selectedToolData.properties_required[property] = true;
                                                    setSelectedTool(selectedToolData.name);
                                                  }}
                                                  value="true"
                                                  name={`property_required_${property}`}
                                                  inputProps={{ 'aria-label': 'Required' }}
                                              />
                                            </TableCell>
                                            <TableCell align="center">
                                              <Radio
                                                  checked={selectedToolData.properties_required[property] === false}
                                                  onChange={(e) => {
                                                    selectedToolData.properties_required[property] = false;
                                                    setSelectedTool(selectedToolData.name);
                                                  }}
                                                  value="false"
                                                  name={`property_required_${property}`}
                                                  inputProps={{ 'aria-label': 'Not Required' }}
                                              />
                                            </TableCell>
                                          </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>

                                {/* TextArea for Function Body */}
                                <Typography variant="h6">Function Body</Typography>
                                <TextField
                                    label="Function Body"
                                    value={selectedToolData.function_body}
                                    onChange={(e) => {
                                      selectedToolData.function_body = e.target.value;
                                      setSelectedTool(selectedToolData.name);
                                    }}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={6}
                                    variant="outlined"
                                    style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px' }}
                                />

                                <Typography variant="h6">Status</Typography>
                                <FormControl component="fieldset" fullWidth>
                                  <RadioGroup
                                      name="status"
                                      value={selectedToolData.status}
                                      onChange={(e) => {
                                        selectedToolData.status = e.target.value;
                                        setSelectedTool(selectedToolData.name);
                                      }}
                                  >
                                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                                  </RadioGroup>
                                </FormControl>
                              </>
                          ) : (
                              <Typography variant="body1">Tool not found</Typography>
                          );
                        })()}
                      </div>
                  )}




                  {/* Footer Bar for Edit Main Prompt */}
                  <div style={{ position: 'fixed', bottom: 0, left: 250, width: 'calc(100% - 250px)', backgroundColor: '#fff', borderTop: '1px solid #ddd', padding: '10px 16px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Button variant="contained" style={{ backgroundColor: '#2196f3', color: '#fff', marginRight: '10px' }}>SAVE</Button>
                    <Button variant="text" style={{ color: '#2196f3' }}>CANCEL</Button>
                  </div>
                </>

            ) : (
                <>
                  {/* Other section headers */}
                  {renderSectionHeader(activeSection)}
                  <div style={{ paddingTop: '100px', paddingLeft: '60px', paddingBottom: '100px', textAlign: 'left' }}>
                    <p>Content for {activeSection}</p>
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default AdminInterface;
