import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import Topbar from '../../component/topbar/Topbar';
import './sendMail.css'
import { MyContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SendMail() {
    const [ details, setDetails ] = useState(()=>{
        const det = JSON.parse(localStorage.getItem('email'));
        return det;
    });
    const [email, setEmail] = useState(()=>{
        const mail = details.applicantEmail;
        return mail
    });
    const [subject, setSubject] = useState('Response to the Job Application Regards');
    const [body, setBody] = useState('');

    const { user:currentUser } = useContext(MyContext);

    const [ showModal, setShowModal ] = useState(false);
    const [ isFetching, setIsFetching ] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFetching(true);

        try {
            const response = await axios.post('https://recruit-link-socket-backend.onrender.com/api/application/appliedcandidate/sendmail', {
                userId : currentUser._id,
                email : currentUser.email,
                applicantUserId : details.applicantId,
                applicantEmail : email,
                mailSubject : subject,
                mailBody  : body
            });
            console.log('Email sent successfully:', response);
            setIsFetching(false);
            if(response.data.includes('email sent successfully!!')){
                setShowModal(true);
            };
            // Optionally, you can display a success message or redirect the user
        } catch (error) {
            setIsFetching();
            console.error('Error sending email:', error);
            // Optionally, you can display an error message to the user
        }
    };

    const handleModalClose = ()=>{
        setShowModal(false);
        navigate(`/jobDashboard/appliedcandidates/${details.jobPostId}`);
    }

    return (
        <div className="sendMailContainer">
            <div className="sendMailWrapper">
                <div className="sendMailTopbar">
                    <Topbar></Topbar>
                </div>
                <div className="sendMailBody">
                    <div className="sendMailBodyTop">
                        <h1>Send Mail To The Job Applicant</h1>
                    </div>
                    <div className="sendMailBodyBottom">

                    <Form onSubmit={handleSubmit}  className='sendMailForm'>
                <Form.Group controlId="formEmail">
                    <Form.Label>Applicant Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formSubject">
                    <Form.Label>Mail Subject</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBody">
                    <Form.Label>Mail Body</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        placeholder="Enter body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    { isFetching ? 
                    <div class="spinner-border" role="status" style={{color:"white"}}>
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  : 
                  'Send Email'}
                </Button>
            </Form>


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
        <Modal.Body>
          <h3>Email Sent Successfully</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
    );
}

export default SendMail;
