import React, { useState, useEffect, useContext } from 'react'
import './jobDashboard.css'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import { format } from 'timeago.js'

function JobDashboard() {

    const { user: currentUser } = useContext(MyContext);
    const [unSortedJobs, setUnSortedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const [showDashboardModal, setShowDashboardModal] = useState(false);
    const [modalJob, setModalJob] = useState('');

    const handleAppliedJobs = () => {
        const filtered = unSortedJobs.filter((job) => {
            return job.appliedCandidates.includes(currentUser._id)
        });
        console.log(filtered)
        setFilteredJobs(filtered);
    };

    const handleMyJobs = () => {
        console.log('hi')
        const filtered = unSortedJobs.filter((job) => {
            return job.userId === currentUser._id
        });
        console.log(filtered)
        setFilteredJobs(filtered);
    };

    const handleShowModal = (job) => {
        console.log(job)
        setModalJob(job);
        setShowDashboardModal(true);
        console.log(modalJob)
    };

    const handleModalClose = () => {
        setShowDashboardModal(false);
        setModalJob('');
    };


    useEffect(() => {

        async function fetchData() {

            try {
                const response = await axios.get('https://recruit-link-socket-backend.onrender.com/api/application/alljobs/dashboard', );
                console.log(response);
                setUnSortedJobs(response.data);
            } catch (err) {
                console.log('Error Fetching jobs..', err);
            }
        }
        console.log(currentUser)

        fetchData();
    }, []);


    return (
        <div className="jobDashboardContainer">
            <div className="jobDashboardWrapper">
                <div className="jobDashboardTop">
                    <div className="loginLeft">
                        <h3 className="loginLogo text-center">RecruitLink</h3>
                        <span className="loginDesc" style={{ width: '50vw' }}>
                            <i>
                                Find the best jobs suited for you or
                                Recruit people based on your demand
                                within the Site at your own Comfort Zone
                            </i>
                        </span>
                    </div>
                    <div className="jobDashboardTopButtons">
                        <Link to='/findJobs' style={{ textDecoration: 'none' }}>
                            <Button variant='primary'>Find Jobs</Button>
                        </Link>
                        <Link to='/createJobs' style={{ textDecoration: 'none' }}>
                            <Button variant='secondary'>Post Job</Button>
                        </Link>
                    </div>
                </div>
                <div className="jobDashboardMiddle">
                    <div className="jobDashboardMiddleWrapper">
                        <h4 onClick={handleAppliedJobs}>Applied Jobs</h4>
                        <h4>Interested Jobs</h4>
                        <h4 onClick={handleMyJobs}>My Jobs</h4>
                    </div>
                    <div className="jobDashboardBottom">

                        <div className="findJobsFetchedDetails">
                            {filteredJobs.length > 0 ? <>
                                {filteredJobs.map((job) => (
                                    <li key={job._id} style={{ listStyle: 'none' }}>
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
                                                <Button variant='secondary' onClick={() => handleShowModal(job)}>View Details</Button>
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
            </div>

            <Modal
                show={showDashboardModal}
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
                        {modalJob && modalJob.appliedCandidates.includes(currentUser._id) &&
                            <Button variant='primary' disabled>Application Submitted</Button>}
                        {modalJob.userId === currentUser._id &&
                        <Link to={`/jobDashboard/appliedcandidates/${modalJob._id}`} style={{textDecoration : 'none'}}>
                            <Button variant='light'>Applied Candidates</Button>
                        </Link>
                            }
                        {modalJob.userId === currentUser._id &&
                            <Button variant='danger'>Delete Job</Button>}
                        <Button variant="secondary" onClick={handleModalClose}> Close </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default JobDashboard