import React, { useContext, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { MyContext } from '../../context/AuthContext'
import axios from 'axios';
import './jobMain.css';

function JobMain(){

  const { user:currentUser, url } = useContext(MyContext);

  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workplaceType, setWorkplaceType] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [applicationCollection, setApplicationCollection] = useState('');
  const [ requiredTechnicalSkills, setRequiredTechnicalSkills ] = useState('');
  const [ requiredNonTechnicalSkills, setRequiredNonTechnicalSkills ] = useState('');
  const [ requiredCommunicationSkills, setRequiredCommunicationSkills ] = useState('');
  const [ workingHours, setWorkingHours ] = useState('');
  const [ salary, setSalary ] = useState('');
  const [ workingExperience, setWorkingExperience ] = useState('');

  const [ stageOne, setStageOne ] = useState(false);
  const [ stageTwo, setStageTwo ] = useState(false);
  const [ stageDesc, setStageDesc ] = useState(false);

  const [ isFetching, setIsFetching ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);


  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleWorkplaceTypeChange = (e) => {
    setWorkplaceType(e.target.value);
  };

  const handleJobLocation = (e)=>{
    setJobLocation(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  const handleApplicationCollectionChange = (e) => {
    setApplicationCollection(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    const details =
    {
      userId : currentUser._id,
      email : currentUser.email,
      username : currentUser.username,
      jobTitle : jobTitle,
      company : companyName,
      workPlaceType : workplaceType,
      jobLocation : jobLocation,
      jobType : jobType,
      description : description,
      requiredTechincalSkills : requiredTechnicalSkills,
      requiredNonTechnicalSkills : requiredNonTechnicalSkills,
      requiredCommunicationLanguage : requiredCommunicationSkills,
      workingHours : workingHours,
      salary : salary,
      workingExperience : workingExperience,
      applicationCollection : applicationCollection 
    }
    try{

      const response = await axios.post(`${url}/application/jobs/createnew`, details);
      console.log(response);
      setIsFetching(false);
      setShowModal(true);
    }catch(err){
      setIsFetching(false);
      console.log(err);
    }
  };

  const handleNext = ()=>{
    setStageOne(true);
    setStageDesc(true);
  };

  const handleTwoNext = ()=>{
    setStageDesc(false);
    setStageTwo(true);
  };

  const closeModalScreen = ()=>{
    setShowModal(false);
    location.reload();
  }

  return (
    <div className="formContainer">
      <div className="loginLeft">
        <h3 className="loginLogo">RecruitLink</h3>
        <span className="loginDesc">
          Post a Job and Recruit the Deserved Candidate
        </span>
      </div>
    <Form onSubmit={handleSubmit} style={{
      width : '60%',
      border : '2px solid black',
      padding : '20px',
      margin : 'auto',
      display : 'flex',
      flexDirection : 'column',
      backgroundColor : 'white',
      rowGap : '20px'
    }}>
      { !stageOne && <>
      <Form.Group controlId="formJobTitle">
        <Form.Label>Job Title</Form.Label>
        <Form.Control
          as="select"
          value={jobTitle}
          onChange={handleJobTitleChange}
          required
        >
          <option value="">Select a job title</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="UX/UI Designer">UX/UI Designer</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formCompanyName">
        <Form.Label>Company Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter company name"
          value={companyName}
          onChange={handleCompanyNameChange}
        />
      </Form.Group>

      <Form.Group controlId="formWorkplaceType">
        <Form.Label>Workplace Type</Form.Label>
        <Form.Control
          as="select"
          value={workplaceType}
          onChange={handleWorkplaceTypeChange}
        >
          <option value="">Select workplace type</option>
          <option value="Office">Office</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId='jobLocation'>
        <Form.Label>Job Location</Form.Label>
        <Form.Control
        type='text'
        value={jobLocation}
        onChange={handleJobLocation}
        placeholder='Ex : Chennai...'>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formJobType">
        <Form.Label>Job Type</Form.Label>
        <Form.Control
          as="select"
          value={jobType}
          onChange={handleJobTypeChange}
>
          <option value="">Select job type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Internship">Internship</option>
          <option value="Other">Other</option>
        </Form.Control>
      </Form.Group>
      </>

}
{ stageDesc && 
<>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Enter job description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </Form.Group>

      <Form.Group controlId="formApplicationCollection">
        <Form.Label>Application Collection</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter application collection method"
          value={applicationCollection}
          onChange={handleApplicationCollectionChange}
        />
      </Form.Group>
</>
}
{ stageTwo && 
<>
<Form.Group controlId="technicalSkills">
        <Form.Label>Technical Skills</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 'python','java',..."
          value={requiredTechnicalSkills}
          onChange={(e)=>setRequiredTechnicalSkills(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="nonTechnicalSkills">
        <Form.Label>Non Technical Skills</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 'Communication','LeaderShip',..."
          value={requiredNonTechnicalSkills}
          onChange={(e)=>setRequiredNonTechnicalSkills(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="communicationLanguage">
        <Form.Label>Required Communication Language</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 'Tamil','English'..."
          value={requiredCommunicationSkills}
          onChange={(e)=>setRequiredCommunicationSkills(e.target.value)}
        />
      </Form.Group>


      <Form.Group controlId="workingHours">
        <Form.Label>Add Working Hours</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 9.00am To 4.00pm"
          value={workingHours}
          onChange={(e)=>setWorkingHours(e.target.value)}
        />
      </Form.Group>


      <Form.Group controlId="salary">
        <Form.Label>Salary Range</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 9,000 To 14,000 Rupees"
          value={salary}
          onChange={(e)=>setSalary(e.target.value)}
        />
      </Form.Group>


      <Form.Group controlId="workingExperience">
        <Form.Label>Required Working Experience</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 2+ years"
          value={workingExperience}
          onChange={(e)=>setWorkingExperience(e.target.value)}
        />
      </Form.Group>
</>}
{ !stageOne && <Button variant="primary" onClick={handleNext}>
        Next
      </Button>
}
      { stageOne && !stageTwo &&
      <Button variant="primary" onClick={handleTwoNext}>
        Next
      </Button>
      }
       { stageTwo && 
       <Button variant="primary" type='submit'>
       { isFetching ? 
        <div class="spinner-border" role="status" style={{ color: "white" }}>
        <span class="visually-hidden">Loading...</span>
    </div>
    :
    'Post Job'
    }
     </Button>
     }
    </Form>

    <Modal
        show={showModal}
        onHide={closeModalScreen}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Body>
          <h3>Job Successfully Created!!</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalScreen}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default JobMain;
