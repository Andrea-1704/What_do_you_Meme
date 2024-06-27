import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
      event.preventDefault();
      
      const credentials = { username, password };
      try {
        // eslint-disable-next-line react/prop-types
        await props.login(credentials, navigate);
      } catch (err) {
        setMessage({ msg:err, type: 'danger' });
      }

      
  };

  return (

    /*
    <>
        {message ? (
          <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        ) : (
          <>
            <div>Loading...</div>
          </>
        )}
    </>
    */
    
    <Row>
      {message ? (<Row>
      <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> ):(
      <Col md={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
              <Form.Label>email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
          </Form.Group>

          <Button type='submit'>Login</Button>
          <Link className='btn btn-danger mx-2 my-2' to={'/'} >Cancel</Link>
      </Form>
    </Col>)}
  </Row>
  )
}


function LogoutButton(props) {
  return(
    // eslint-disable-next-line react/prop-types
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

function GetPersonasButton(props) {
  return(
    // eslint-disable-next-line react/prop-types
    <Button variant='outline-light' onClick={props.getUserInfo}>User</Button>
  )
}
export { LoginForm, LogoutButton, GetPersonasButton };