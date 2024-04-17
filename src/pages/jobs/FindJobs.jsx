import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Topbar from '../../component/topbar/Topbar'
import './findJobs.css'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import { MyContext } from '../../context/AuthContext'

function FindJobs() {

  const [ unSortedJobs, setUnSortedJobs ] = useState([]);
  const [ filteredJobs, setFiteredJobs ] = useState([]);
  const [ jobTitleValue, setJobTitleValue ] = useState('');
  const [ workPlaceTypeValue, setWorkPlaceTypeValue ] = useState('');
  const [ jobTypeValue, setJobTypeValue ] = useState('');
  const [ inputValue, setInputValue ] = useState('');

  const { user:currentUser, url } = useContext(MyContext);

  const [ showModal, setShowModal ] = useState(false);
  const [ modalJob, setModalJob ] = useState('');


  useEffect(()=>{
    
    async function fetchData(){

      console.log(currentUser)

      const user = currentUser.username;
    try{
      const response = await axios.get(`${url}/application/alljobs/${currentUser.username}`);
      console.log(response);
      setUnSortedJobs(response.data);
      setFiteredJobs(response.data);
    }catch(err){
      console.log('Error Fetching jobs..', err);
    }
  }

    fetchData();
  },[]);

  const handleShowModal = (job)=>{
    setModalJob(job);
    localStorage.setItem('job', JSON.stringify(job));
    setShowModal(true);
  };

  const handleModalClose = ()=>{
    setModalJob('');
    setShowModal(false);
  };

  const handleWorkPlaceChange = (e)=>{
    setWorkPlaceTypeValue(e.target.value);

    if(e.target.value == 'Select'){
      setFiteredJobs(unSortedJobs);
      return;
    }

    const filtered = unSortedJobs.filter((job)=>{
      return job.workPlaceType == e.target.value;
    });
    setFiteredJobs(filtered);

  };

  const handleJobTitleChange = (e)=>{
    setJobTitleValue(e.target.value);

    if(e.target.value == 'Select'){
      setFiteredJobs(unSortedJobs);
      return;
    };

    const filtered = unSortedJobs.filter((job)=>{
      return job.jobTitle == e.target.value;
    });
    setFiteredJobs(filtered);
  };

  const handleJobTypeChange = (e)=>{
    setJobTypeValue(e.target.value);

    if(e.target.value == 'Select'){
      setFiteredJobs(unSortedJobs);
      return;
    };

    const filtered = unSortedJobs.filter((job)=>{
      return job.jobType == e.target.value;
    });
    setFiteredJobs(filtered);
  };

  const handleInputChange = (e)=>{
    const filtered = unSortedJobs.filter((job)=>{
      return job.jobTitle.toLowerCase().includes(e.target.value)
    });
    setFiteredJobs(filtered);
  }

    return (
    <div className="findJobsContainer">
      <div className="findJobsWrapper">
        <div className="findJobsTopbar">
          <Topbar></Topbar>
        </div>

        <div className="findJobsBody">
          <div className="findJobsBodyHeader">
          <h3 className="loginLogo text-center">Find Jobs</h3>
          <span className='loginDesc'>Easy Filtering / Sorting or Searching Options...</span>
          <input type="text" placeholder='Search for Jobs... Ex : UI/UX Design' onChange={handleInputChange}/>
          </div>
          <div className="findJobsMain">
          <div className="findJobsFilter">

            <div className="findJobsFilterOption">
            <label htmlFor="jobTitle">Filter by Job Title : </label>
            <select id="jobTitle" value={jobTitleValue} onChange={handleJobTitleChange}>
              <option value="Select">Select</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="UX/UI Designer">UX/UI Designer</option>
            </select>
            </div>

            <div className="findJobsFilterOption">
              <label htmlFor="workPlaceType">Filter by Work Place Type : </label>
              <select id="workPlaceType" value={workPlaceTypeValue} onChange={handleWorkPlaceChange}>
                <option value="Select">Select</option>
                <option value="On-Site">On-Site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="findJobsFilterOption">
              <label htmlFor="jobType">Filter by Job Type : </label>
              <select id="jobType" value={jobTypeValue} onChange={handleJobTypeChange}>
                <option value="Select">Select</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </div>

        <div className="findJobsFetchedDetails">
          { filteredJobs.length > 0 ? <>
          { filteredJobs.map((job)=>(
            <li key={job._id} style={{ listStyle : 'none'}}>
              <div className="findedJobsResult">
                <div className="findedJobsResutHeader">
                  <h2>{job.jobTitle}</h2>
                  <h4>@ {job.company}</h4>
                  <h6>{job.jobLocation}</h6>
                </div>
                <div className="findedJobsResultBody">
                  <h6>Job Type : {job.jobType}</h6>
                  <h6>Work Place : {job.workPlaceType}</h6>
                  <h6>Salary : {job.salary}</h6>
                </div>
                <div className="findedJobsResultFooter">
                  <Button variant='secondary' onClick={()=>handleShowModal(job)}>View Details</Button>
                </div>
              </div>
            </li>
          ))}
          </> 
          :
           <>
           <div className="findedJobsNoResult">
            <h3>OOPS!!!</h3>
            <h5>No Jobs Found...</h5>
           </div>
           </>}
        </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Title>
          <h2 className='text-center p-3'>Job Details</h2>
          <p className='text-center'>Job Posted {format(modalJob.createdAt)}</p>
        </Modal.Title>
        <Modal.Body>
             <div className="ModalJobs">
                <div className="ModalJobsHeader">
                  <h2>{modalJob.jobTitle}</h2>
                  <h4>@ {modalJob.company}</h4>
                  <h6>{modalJob.jobLocation}</h6>
                </div>
                <div className="findedJobsResultBody">
                <h6>Recruiter Username : <Link to={`/profile/${modalJob.username}`} style={{
                                textDecoration : 'none'
                            }}>{modalJob.username}</Link></h6>
                  <h6>Job Type : {modalJob.jobType}</h6>
                  <h6>Work Place : {modalJob.workPlaceType}</h6>
                  <h6>Salary : {modalJob.salary}</h6>
                  <h6>Working Hours : {modalJob.workingHours}</h6>
                  <h6>Required Working Experience : {modalJob.workingExperience}</h6>
                  <h6>Required Technical Skills : {modalJob.requiredTechincalSkills}</h6>
                  <h6>Required Non-Technical Skills : {modalJob.requiredNonTechnicalSkills}</h6>
                  <h6>Required Communication Language : {modalJob.requiredCommunicationLanguage}</h6>
                </div>
                <div className="modalJobsResultDesc">
                  <h4>Description : </h4><p><b>
                    {modalJob.description}</b></p>
                </div>
              </div>
        </Modal.Body>
        <Modal.Footer>
        <div className="findedJobsResultFooter">
                  <Button variant='secondary'>Add to Interest</Button>
                  { modalJob && modalJob.appliedCandidates.includes(currentUser._id) ? 
                  <Button variant='light' disabled>Application Submitted</Button>
                  :
                  <Link to='applyjob' style={{ textDecoration : 'none' }}>
                  <Button variant='primary'>Apply</Button>
                  </Link>
}
                  <Button variant="danger" onClick={handleModalClose}> Close </Button>
                </div>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default FindJobs