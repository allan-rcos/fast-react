import ENV from "../config/ENV";

export class TokenError extends Error {
}

export class TokenIsNullError extends TokenError {
    message = 'Token is null.'
}

export class TokenExpiredError extends TokenError {
    message = 'Token expired, please log in again.'
}

class Token {
    get expire_time() {
        return localStorage.getItem('token_expire_time')
    }

    get token() {
        const token = localStorage.getItem('token')
        if (token == null)
            throw new TokenIsNullError()
        const tokenExpireTime = this.expire_time ?? new Date()
        if (tokenExpireTime >= new Date())
            throw new TokenExpiredError()
        return token
    }

    set token(data) {
        console.debug('Setting token: ', data)
        localStorage.setItem('token', data['token']);
        localStorage.setItem('token_expire_time', data['expires_in']);
        this.refreshUser();
    }

    get username() {
        return localStorage.getItem('username')
    }

    set username(username) {
        localStorage.setItem('username', username)
    }

    refreshUser() {
        let base64Url = this.token.split('.')[1];
        let base64 = base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );

        let data = JSON.parse(jsonPayload);
        this.username = data['sub'];
    }

    async refreshToken() {
        console.debug('Refreshing token.')
        let token = this.token
        let response = await fetch(ENV.API_URL('auth/refresh'),
            {
                headers: {
                    'Authorization': 'Bearer '.concat(token)
                }
            })
        this.token = await response.json()
    }

    setRefreshTimeout() {
        const exp = this.expire_time;
        if (!exp) return;
        const timeout = exp - new Date() - 5000;
        if (timeout <= 0) return;
        setTimeout(
            () => this.refreshToken(),
            timeout
        )
    }
}

export default new Token()
