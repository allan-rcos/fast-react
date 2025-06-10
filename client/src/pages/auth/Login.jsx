import React, {useState} from 'react';
import {ReactComponent as Logo} from '../../logo.svg'
import ENV from "../../config/ENV";
import {useNavigate} from "react-router-dom";
import PATHS from "../../config/PATHS";
import Token from "../../helpers/Token"
import SubmitButton from "../../components/form/SubmitButton";
import FormGroup from "../../components/form/FormGroup";
import Banner from "../../components/Banner";

function Login() {
    localStorage.clear();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    // TODO: Create a toast message system
    const show_alert = (message) => {
        setMessage(message)
    }

    const login = async (e) => {
        e.preventDefault();
        setMessage('')
        setUsernameMessage('')
        setPasswordMessage('')

        let un = username;
        let pw = password

        if (!un?.trim().length)
            un = 'admin';
        if (!pw?.trim().length)
            pw = 'admin';

        Token.setRefreshTimeout()
        const result = await fetch(ENV.API_URL('auth'), {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(un + ":" + pw)
            }
        })
        switch (result.status) {
            case 0:
                console.log(result);
                show_alert('Some issue is causing a zero code')
                break;
            case 200:
                setUsername('');
                setPassword('');
                Token.token = await result.json();
                navigate(PATHS.USERS);
                break;
            case 400:
                return show_alert('Server error!?'); // This status code means skip validation.
            case 401:
                return setPasswordMessage('Username and Password don\'t match.');
            case 404:
                return setUsernameMessage('User not found.')
            default:
                let data = await result.json();
                console.error(data);
                return show_alert(data['detail']);
        }
    }
    return (
        <div
            className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5"><Logo
                    className="mx-auto size-20"/></h1>
                <div
                    className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">

                    {message && <Banner color="red">{message}</Banner>}

                    <div className="px-5 py-7">
                        <FormGroup
                            title="Username"
                            type="text"
                            placeholder="admin"
                            value={username}
                            error={!!usernameMessage}
                            helper={usernameMessage}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FormGroup
                            title="Password"
                            type="password"
                            placeholder="admin"
                            value={password}
                            error={!!passwordMessage}
                            helper={passwordMessage}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <SubmitButton onClick={(e) => login(e)}>
                            <span className="inline-block mr-2">Login</span>
                            <span>&rarr;</span>
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;