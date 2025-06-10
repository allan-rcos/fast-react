import React from 'react';
import CreateModal from "./CreateModal";
import Banner from "../../../components/Banner";
import FormGroup from "../../../components/form/FormGroup";
import Modal from "../../../components/modal/Modal";

class EditModal extends CreateModal {
    state = {
        message: '',
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

        this.state.username = props.user['username']
        this.state.email = props.user['email']
    }

    setMessage(message) {
        this.setState({message})
    }

    save() {
        let username = this.state.username.trim();
        let email = this.state.email.trim();
        let password = this.state.password.trim()
        let usernameMessage = (username.length < 3
            && username.length !== 0)
            ? 'Username most contain more than 3 characters' : '';
        let emailMessage = email === this.props.user['email']
            ? '' : !this.validateEmail() ? 'Invalid email.' : '';
        let passwordMessage = password.length
            ? this.validatePassword() : '';
        let message = ''
        this.setUsernameMessage(usernameMessage);
        this.setPasswordMessage(passwordMessage)

        if ((username.length === 0 || username === this.props.user['username'])
            && (email.length === 0 || email === this.props.user['email'])
            && password.length === 0)
            message = 'Nothing to change.';

        this.setMessage(message);

        if (usernameMessage !== ''
            || emailMessage !== ''
            || passwordMessage !== ''
            || message !== '')
            return

        this.props.onConfirm({username, email, password})
    }

    render() {
        return (
            <Modal
                title={"Edit user ".concat(this.props.user['username'])} {...this.props}
                onConfirm={() => this.save()}>
                {this.props.message &&
                    <Banner color="red">{this.props.message}</Banner>}
                {this.state.message &&
                    <Banner>{this.state.message}</Banner>}
                <div className="px-5 py-7">
                    <FormGroup
                        autocomplete="off"
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
                        name="confirm"
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

export default EditModal;