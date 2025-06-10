import React, {Component} from 'react';
import {INFO} from "../../../config/API";
import Banner from "../../../components/Banner";
import FormGroup from "../../../components/form/FormGroup";
import Modal from "../../../components/modal/Modal";

class CreateModal extends Component {
    state = {
        username: '',
        usernameMessage: '',
        email: '',
        emailMessage: '',
        password: '',
        passwordMessage: '',
        confirmation: ''
    }

    constructor(props) {
        super(props);
        this.passwordRegex = '^'.concat(
            INFO['password_min_uppercase'] > 0 ?
                `(?=${'.*[A-Z]'.repeat(INFO['password_min_uppercase'])})` : '',
            INFO['password_min_special'] > 0 ?
                `(?=${'.*[!@#$&*]'.repeat(INFO['password_min_special'])})` : '',
            INFO['password_min_digits'] > 0 ?
                `(?=${'.*[0-9]'.repeat(INFO['password_min_digits'])})` : '',
            INFO['password_min_lowercase'] > 0 ?
                `(?=${'.*[a-z]'.repeat(INFO['password_min_lowercase'])})` : '',
            INFO['password_min_length'] > 0 ?
                `.{${INFO['password_min_length']},}` : '',
            '$'
        );
        this.passwordRegexMessage = []

        if (INFO['password_min_uppercase'] > 0)
            this.passwordRegexMessage.push(
                `${INFO['password_min_uppercase']} uppercase`)
        if (INFO['password_min_lowercase'] > 0)
            this.passwordRegexMessage.push(
                `${INFO['password_min_lowercase']} lowercase`)
        if (INFO['password_min_digits'] > 0)
            this.passwordRegexMessage.push(
                `${INFO['password_min_digits']} digits`)
        if (INFO['password_min_special'] > 0)
            this.passwordRegexMessage.push(
                `${INFO['password_min_special']} special`)
        if (INFO['password_min_length'] > 0)
            this.passwordRegexMessage.push(
                `${INFO['password_min_length']} length`)
    }

    setUsername(username) {
        this.setState({username})
    }

    setUsernameMessage(usernameMessage) {
        this.setState({usernameMessage})
    }

    setEmail(email) {
        this.setState({email})
    }

    setEmailMessage(emailMessage) {
        this.setState({emailMessage})
    }

    setPassword(password) {
        this.setState({password})
    }

    setPasswordMessage(passwordMessage) {
        this.setState({passwordMessage})
    }

    setConfirmation(confirmation) {
        this.setState({confirmation})
    }

    validatePassword() {
        if (!this.state.password.match(this.passwordRegex))
            return 'Password must contain at last: '
                .concat(this.passwordRegexMessage.join(', '))
        if (this.state.password !== this.state.confirmation)
            return 'Password and Confirmation dont match.'
        return ''
    }

    validateEmail() {
        return document.querySelector('input[type="email"]').checkValidity()
    }

    save(e, self) {
        e.preventDefault()
        let usernameMessage = this.state.username.trim().length < 3
            ? 'Username most contain more than 3 characters' : '';
        let emailMessage = !this.state.email.trim().length
            ? 'Email is required' :
            !this.validateEmail() ? 'Invalid Email.' : '';
        let passwordMessage = this.validatePassword()
        this.setUsernameMessage(usernameMessage);
        this.setEmailMessage(emailMessage)
        this.setPasswordMessage(passwordMessage)

        if (usernameMessage !== ''
            || emailMessage !== ''
            || passwordMessage !== '')
            return

        this.props.onConfirm({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        })
    }

    render() {
        return (
            <Modal title="Create a new user" {...this.props}
                   onConfirm={(e) => this.save(e, this)}>
                {this.props.message &&
                    <Banner color="red">{this.props.message}</Banner>}
                <div className="px-5 py-7">
                    <FormGroup
                        autocomplete="off"
                        required
                        title="Username"
                        name="username"
                        value={this.state.username}
                        error={!!this.state.usernameMessage}
                        helper={this.state.usernameMessage}
                        onChange={(e) => this.setUsername(e.target.value)}
                    />
                    <FormGroup
                        autocomplete="off"
                        required
                        title="Email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        error={!!this.state.emailMessage}
                        helper={this.state.emailMessage}
                        onChange={(e) => this.setEmail(e.target.value)}
                    />
                    <FormGroup
                        autocomplete="off"
                        required
                        title="Password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        error={!!this.state.passwordMessage}
                        helper={this.state.passwordMessage}
                        onChange={(e) => this.setPassword(e.target.value)}
                    />
                    <FormGroup
                        autocomplete="off"
                        required
                        title="Confirm Password"
                        name="confirmation"
                        type="password"
                        value={this.state.confirmation}
                        error={!!this.state.passwordMessage}
                        onChange={(e) => this.setConfirmation(e.target.value)}
                    />
                </div>
            </Modal>
        );
    }
}

export default CreateModal;