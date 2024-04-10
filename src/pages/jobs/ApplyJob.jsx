import React, { useContext, useState } from 'react'
import Topbar from '../../component/topbar/Topbar'
import './applyJob.css'
import axios from 'axios'
import { Form, Button, Modal } from 'react-bootstrap'
import { MyContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function ApplyJob() {

    const { user:currentUser } = useContext(MyContext);
    const [ jobDetails, setJobDetails ] = useState(null);

    const [email, setEmail] = useState(()=>{
        const details = JSON.parse(localStorage.getItem('job'));
        setJobDetails(details);
        return details.applicationCollection;
    });
    const [ subjectDefaultBody, setSubjectDefaultBody ] = useState(' Application for [Job Title] Position')
    const [emailDefaultBody, setEmailDefaultBody] = useState(`Dear Hiring Manager,\n\nI am writing to express my interest in the [Job Title] position at [Company Name], as advertised on [where you found the job posting].\n\nWith [mention any relevant experience or skills], I believe I am well-suited for this role and would be a valuable addition to your team. I am particularly drawn to [mention any specific aspects of the job or company that appeal to you].\n\nAttached is my resume for your review. Additionally, you can find samples of my work/portfolio at [portfolio link].\n\nI am eager to discuss how my skills and experiences align with the needs of your team. Please let me know if there is any further information you need from me or if you would like to schedule an interview.\n\nThank you for considering my application. I look forward to the opportunity to contribute to [Company Name].\n\nSincerely,\n[Your Name]\n[Your Contact Information]`);
    const [subject, setEmailSubject] = useState('');
    const [body, setEmailBody] = useState('');
    const [resume, setResume] = useState(null);
    const [portfolioLink, setPortfolioLink] = useState('');

    const [ emailError, setEmailError ] = useState(false);
    const [ subjectError, setSubjectError ] = useState(false);
    const [ bodyError, setBodyError ] = useState(false);
    const [ resumeError, setResumeError ] = useState(false);

    const [ showModal, setShowModal ] = useState(false);
    const navigate = useNavigate();
    const [ isFetching, setIsFetching ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFetching(true);

        if(email.length < 5 ){
            setEmailError(true);
            return;
        }
        if( subject.length < 1 ){
            setSubjectError(true);
            return;
        }
        if( body.length < 1 ){
            setBodyError(true);
            return;
        }
        if( !resume ){
            setResumeError(true);
            return;
        }

        const formData = new FormData();
        formData.append('recruiterEmail', email);
        formData.append('recruiterId', jobDetails.userId);
        formData.append('subject', subject);
        formData.append('body', body);
        formData.append('resume', resume);
        formData.append('portFolioLink', portfolioLink);
        formData.append('applicantEmail', currentUser.email);
        formData.append('jobPostId', jobDetails._id);
        formData.append('applicantId', currentUser._id);
        formData.append('recruiterUsername', currentUser.username)

        try {
            const response = await axios.post('https://recruit-link-socket-backend.onrender.com/api/job/jobapply', formData);
            console.log(response);
            if (response.data.includes('job applied successfully!!')) {
                console.log('Email sent successfully!');
                // Optionally, reset form fields
                setEmail('');
                setEmailSubject('');
                setEmailBody('');
                setResume(null);
                setPortfolioLink('');
                setIsFetching(false);
                setShowModal(true);
            } else {
                setIsFetching(false);
                console.error('Failed to send message');
            }
        } catch (error) {
            setIsFetching(false);
            console.error('Error:', error);
        }
    };

    const handleCloseModal = ()=>{
        setShowModal(false);
        navigate('/jobDashboard');
    }


    return (
        <div className="applyJobContainer">
            <div className="applyJobWrapper">
                <div className="applyJobTopbar">
                    <Topbar></Topbar>
                </div>
                <div className="applyJobMain">
                    <div className="findJobsBodyHeader">
                        <h3 className="loginLogo text-center">Job Application</h3>
                        <span className='loginDesc'>Apply for Job at Easy Steps...</span>
                    </div>
                    <div className="applyJobBody">

                            <Form onSubmit={handleSubmit} className='applyJobBodyForm'>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled
                                    />
                                    { emailError && <Form.Text className='text-danger'>
                                        Please Enter the Email...
                                        </Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="formSubject">
                                    <Form.Label>Subject</Form.Label>
                                    <Button variant='primary' onClick={()=>setEmailSubject(subjectDefaultBody)}>General Template</Button>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter subject"
                                        value={subject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                    />
                                    { subjectError && <Form.Text className='text-danger'>
                                        Please Enter the Subject...
                                        </Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="formBody">
                                    <Form.Label>Body of Email</Form.Label>
                                    <Button onClick={()=>setEmailBody(emailDefaultBody)}>General Template</Button>
                                    <Form.Control
                                        as="textarea"
                                        rows={7}
                                        placeholder="Give Your Application Body"
                                        value={body}
                                        onChange={(e) => setEmailBody(e.target.value)}
                                    />
                                    { bodyError && <Form.Text className='text-danger'>
                                        Please Enter the body of Email...
                                        </Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="formResume">
                                    <Form.Label>Add Your Resume (PDF)</Form.Label>
                                    <Form.Control
                                        type='file'
                                        label="Choose file"
                                        accept=".pdf"
                                        onChange={(e) => setResume(e.target.files[0])}
                                    />
                                    { resumeError && <Form.Text className='text-danger'>
                                        Please Include Your Resume...
                                        </Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="formPortfolioLink">
                                    <Form.Label>Portfolio Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter portfolio link"
                                        value={portfolioLink}
                                        onChange={(e) => setPortfolioLink(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    { isFetching ? 
                                    <div class="spinner-border" role="status" style={{color:"white"}}>
                                    <span class="visually-hidden">Loading...</span>
                                  </div>
                                  :
                                  'Apply Job'
                                  }
                                </Button>
                            </Form>

                    </div>
                </div>
            </div>

            <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Body>
            Application Successfully Sent!!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Go To Dashboard Page
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
    )
}

export default ApplyJob