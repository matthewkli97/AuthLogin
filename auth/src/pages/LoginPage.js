import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Alert,Button, Form, FormGroup, Label, Input, Container, Col } from 'reactstrap';


export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            alert: null
        };
    }

    onInputChange = (e, input) => {
        switch (input) {
            case "email":
                this.setState({ email: e.target.value });
                return;
            case "password":
                this.setState({ password: e.target.value });
                return;
        }
    }

    postData = (url, data) => {
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
                console.log("asdfs")
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
        
        this.postData(`https://api.hellosummary.me/v1/sessions`, { email: this.state.email, password: this.state.password })
        .catch(error => console.error(error));
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
                                <Label for="exampleEmail">Email</Label>
                                <Input type="email" name="email" onChange={(e) => this.onInputChange(e, "email")} id="exampleEmail" placeholder="with a placeholder" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" name="password" onChange={(e) => this.onInputChange(e, "password")} id="examplePassword" placeholder="password placeholder" />
                            </FormGroup>
                        </Form>
                    </Col>
                    <Button onClick={this.onFormSubmit}>Submit</Button>
                    <p><Link to="/signup">I don't have an account</Link></p>
                </Container>
            );
        } else {
            return (
                <Redirect to='/signup' />
            );
        }
    }
}