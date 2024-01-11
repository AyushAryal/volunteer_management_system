import React from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';

export default function LoginForm(){
    var username ="Ayush";
    return(<div>
            <Container>
                <Row>
                    <Col>
                    <p>Welcome, <strong>{username}</strong>! Welcome to the VMS system NDRRMA </p>
                    </Col>
                </Row>
            </Container>
            <Form>
                <Form.Label>Login</Form.Label>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="I agree to the terms and conditions." />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
    </div>

    )
}
