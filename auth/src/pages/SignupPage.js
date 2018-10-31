import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, Alert, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';


export default class SignupPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            passwordConf: "",
            alert:null
        };
    }

    onInputChange = (e, input) => {
        switch (input) {
            case "fname":
                this.setState({ firstName: e.target.value });
                return;
            case "lname":
                this.setState({ lastName: e.target.value });
                return;
            case "username":
                this.setState({ userName: e.target.value });
                return;
            case "email":
                this.setState({ email: e.target.value });
                return;
            case "password":
                this.setState({ password: e.target.value });
                return;
            case "passwordconf":
                this.setState({ passwordConf: e.target.value });
                return;
        }
    }

    postData = (url, data) => {
        this.setState({alert:null})
        // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Authorization": ""
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }

                localStorage.setItem('Authorization', response.headers.get("authorization"));

                return response.json()
            })
            .then((json) => {
                this.props.updateUser(json)
            })
            .catch(err => {
                try {
                    err.text().then((text) => {
                        this.setState({alert:text})
                    })
                } catch (e) {
                    this.setState({alert:err})
                }
            });
    }

    onFormSubmit = (e) => {
        e.preventDefault()

        this.postData(`https://api.hellosummary.me/v1/users`, {
            email: this.state.email, password: this.state.password,
            passwordConf: this.state.passwordConf, userName: this.state.userName, firstName: this.state.firstName, lastName: this.state.lastName
        })
    }

    render() {
        const styles = {
            image: {
                marginLeft: "auto",
                marginRight: "auto",
                width: "35%",
                maxWidth: 300,
                height: "auto",
                paddingLeft: "3%"
            },
            contentDiv: {
                paddingTop: 100
            }
        }

        if (this.props.currentUser === null) {
            return (
                <Container>
                    <h1>Hey! Join the conversation!</h1>
                    <h2>Let's get you logged in...</h2>
                    <img style={styles.image} src="https://firebasestorage.googleapis.com/v0/b/chat-b9230.appspot.com/o/unknownUser.png?alt=media&token=12751c87-9a50-4181-8041-d3062ca9ad1f" alt="unknown user" />
                    <Col xs={{ size: 6, offset: 3 }}>
                        {
                            this.state.alert &&

                            <Alert color="danger">
                                {this.state.alert}
                            </Alert>
                        }
                        <Form onSubmit={this.onFormSubmit}>
                            <FormGroup>
                                <Label for="firstname">First Name</Label>
                                <Input name="firstname" onChange={(e) => this.onInputChange(e, "fname")} id="firstName" placeholder="Billy" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastname">Last Name</Label>
                                <Input name="lastname" onChange={(e) => this.onInputChange(e, "lname")} id="lastname" placeholder="Joel" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" onChange={(e) => this.onInputChange(e, "email")} id="email" placeholder="billyjoel@joel.com" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input name="username" onChange={(e) => this.onInputChange(e, "username")} id="username" placeholder="billyjoel123" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" onChange={(e) => this.onInputChange(e, "password")} id="password" placeholder="password placeholder" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="passwordconf">Password Confirmation</Label>
                                <Input type="password" name="passwordconf" onChange={(e) => this.onInputChange(e, "passwordconf")} id="passwordconf" placeholder="password placeholder" />
                            </FormGroup>
                        </Form>
                    </Col>
                    <Button onClick={this.onFormSubmit}>Submit</Button>
                    <p><Link to="/login">I already have an account.</Link></p>
                </Container>
            );
        } else {
            return (
                <Redirect to='/welcome' />
            );
        }
    }
}