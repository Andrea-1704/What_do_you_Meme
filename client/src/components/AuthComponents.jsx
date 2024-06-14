import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginForm(props) {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { mail, password };
    // eslint-disable-next-line react/prop-types
    props.login(credentials);
  };

  return (
    <Row>
      <Col md={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' value={mail} onChange={ev => setMail(ev.target.value)} required />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required minLength={6}/>
          </Form.Group>

          <Button type='submit'>Login</Button>
          <Link className='btn btn-danger mx-2 my-2' to={'/'}>Cancel</Link>
        </Form>
      </Col>
    </Row>
  );
}

export { LoginForm };
