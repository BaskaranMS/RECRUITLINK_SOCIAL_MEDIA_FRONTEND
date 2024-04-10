import React, { useContext, useEffect, useState } from 'react'
import  { useParams, useNavigate }  from 'react-router-dom'
import axios from 'axios'
import Topbar from '../../component/topbar/Topbar';
import { Table, Button } from 'react-bootstrap'
import { format  } from 'timeago.js';
import { MyContext } from '../../context/AuthContext';

function AppliedCandidates() {
const { jobId } = useParams();
const navigate = useNavigate();

const { user } = useContext(MyContext);
const [ emails, setEmails ] = useState([]);

const [ applied, setApplied ] = useState(false);
const [ sended, setSended ] = useState(false);
const [ recieved, setRecieved ] = useState(false);
const [ initial, setInitial ] = useState(true);

    useEffect(()=>{
        console.log(jobId);

        async function fetchData(){
            try{
                const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/application/appliedcandidates/${jobId}`);
                console.log(response);
                setEmails(response.data);
            }catch(err){
                console.log(err);
            }
        } 


        fetchData();
    },[]);

    const onSendEmail = (email)=>{
        localStorage.setItem('email', JSON.stringify(email));
        navigate('/appliedcandidate/sendmail');
    };

    const handleSendedMails = async ()=>{
        setInitial(false);
        setApplied(false)
        setRecieved(false);
                setSended(!sended);
        try{

            const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/application/appliedcandidates/sendedmails/${user.email}`);
            setEmails(response.data);
        }catch(err){
            console.log(err);
        }
    };

    const handleAppliedMails = async ()=>{
        setInitial(false);
        setSended(false);
        setRecieved(false);
setApplied(!applied);
        try{

            const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/application/appliedcandidates/${jobId}`);
            setEmails(response.data);
        }catch(err){
            console.log(err);
        }
    };

    const handleRecievedMails = async ()=>{
        setInitial(false);
        setApplied(false);
        setSended(false);
setRecieved(!recieved);
        try{

            const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/application/appliedcandidates/recievedmails/${user.email}`);
            setEmails(response.data);
        }catch(err){
            console.log(err);
        }
    };
  return (
    <div className="appliedCandidatesContainer">
        <div className="appliedCandidatesWrapper">
            <div className="appliedCandidatesTopbar">
                <Topbar></Topbar>
            </div>
            <div className="appliedCandidatesHeader" style={{
                display : 'flex',
                justifyContent : 'center',
                columnGap : '20px',
                padding : '20px'
            }}>
                <Button variant='danger' onClick={handleAppliedMails}>Applied Candidates</Button>
                <Button variant='primary' onClick={handleSendedMails}>Sended Mails</Button>
                <Button variant='secondary' onClick={handleRecievedMails}>Recieved Mails</Button>
            </div>
            <div className="appliedCandidatesHeaderBody">
            { initial && <h3 className='text-danger text-center'>Applied Candidates</h3>}
                { applied && <h3 className='text-danger text-center'>Applied Candidates</h3>}
                { sended && <h3 className='text-danger text-center'>Sended Mail to Candidates</h3>}
                { recieved && <h3 className='text-danger text-center'>Recieved Mail form Recruiters</h3>}
            </div>
            <div className="appliedCandidatesBody">

            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Si. No</th>
                    <th>Applicant Email</th>
                    <th>Date and Time</th>
                    <th>Subject</th>
                    <th>Body</th>
                    { !sended && !recieved &&
                    <th>Send Mail</th>}
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {emails.map((email, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{email.applicantEmail} <br /> {email.recruiterUsername}</td>
                        <td>{format(email.createdAt)}</td>
                        <td>{email.subject || email.mailSubject}</td>
                        <td>{email.body || email.mailBody}</td>
                        { !sended && !recieved &&
                        <td>
                            <Button variant="primary" onClick={() => onSendEmail(email)}>Send Mail</Button>
                        </td>
}
                        <td>
                            <Button variant="danger" onClick={() => onDeleteEmail(email._id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

            </div>
        </div>
    </div>
  )
}

export default AppliedCandidates