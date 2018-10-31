import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Alert,Button, Form, FormGroup, Label, Input, Container, Col } from 'reactstrap';


export default class ProfilePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fname: this.props.currentUser.firstName,
            lname: this.props.currentUser.lastName,
            alert: null
        };
    }

    onInputChange = (e, input) => {
        switch (input) {
            case "fname":
                this.setState({ fname: e.target.value });
                return;
            case "lname":
                this.setState({ lname: e.target.value });
                return;
        }
    }

    postData = (url, data) => {
        this.setState({ alert: null })
        let auth = window.localStorage.getItem("Authorization")
        // Default options are marked with *
        return fetch(url, {
            method: "PATCH", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }

                return response.json()
            })
            .then((json) => {
                this.props.updateUser(json)
            })
            .catch(err => {
                try {
                    err.text().then((text) => {
                        this.setState({ alert: text })
                    })
                } catch (e) {
                    this.setState({ alert: err })
                }
                
                setTimeout(function(){
                    this.props.updateUser(null);
                }, 2000);
            });
    }

    requestLogout = (e) => {
        let auth = window.localStorage.getItem("Authorization")
        // Default options are marked with *
        return fetch('https://api.hellosummary.me/v1/sessions/mine', {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Authorization": auth
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        }).then(response => {
            if (!response.ok) {
                throw response;
            }

            localStorage.removeItem("Authorization")

            this.props.updateUser(null)
        })
    }

    onFormSubmit = (e) => {
        e.preventDefault()


        this.postData(`https://api.hellosummary.me/v1/users/me`, { id: this.props.currentUser.id, firstName: this.state.fname, lastName: this.state.lname, })
         // JSON-string from `response.json()` call
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

        if (this.props.currentUser != null) {
            return (
                <Container>
                    <h1>Hey! {this.props.currentUser.firstName} {this.props.currentUser.lastName}</h1>
                    <h2>You're all logged in.</h2>
                    <img style={styles.image} src={this.props.currentUser.photoURL} alt="unknown user" />
                    <Col xs={{ size: 6, offset: 3 }}>
                        {
                            this.state.alert &&

                            <Alert color="danger">
                                {this.state.alert}
                            </Alert>
                        }
                        <Form onSubmit={this.onFormSubmit}>
                            <FormGroup>
                                <Label for="fname">New First Name</Label>
                                <Input name="fname" onChange={(e) => this.onInputChange(e, "fname")} id="fname" placeholder={this.props.currentUser.firstName} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lname">New Last Name</Label>
                                <Input name="lname" onChange={(e) => this.onInputChange(e, "lname")} id="lname" placeholder={this.props.currentUser.lastName} />
                            </FormGroup>
                        </Form>
                        <Button onClick={this.onFormSubmit}>Update Account</Button>
                        <Button onClick={this.requestLogout}>Logout</Button>
                    </Col>
                </Container>
            );
        } else {
            return (
                <Redirect to='/welcome' />
            );
        }
    }
}