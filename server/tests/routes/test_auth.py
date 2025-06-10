from datetime import UTC, datetime, timedelta
from http import HTTPStatus

import jwt
from freezegun import freeze_time

from server.helpers import create_access_token, decode_token


def test_token_generation(client, user):
    response = client.get(
        '/auth/',
        auth=(user.username, user.plain_password),
    )
    data = response.json()

    assert response.status_code == HTTPStatus.OK, data

    decoded_token = decode_token(data['token'])
    exp_timestamp = int(datetime.fromisoformat(data['expires_in']).timestamp())

    assert decoded_token['sub'] == user.username
    assert exp_timestamp == decoded_token['exp']
    assert data['token_type'] == 'bearer'


def test_unauthorized_credentials(client, user):
    response = client.get(
        '/auth/',
        auth=(user.username, 'wrong-password'),
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED, response.json()

    response = client.get(
        '/auth/',
        auth=('unknown-user', 'wrong-password'),
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED, response.json()


def test_token_refresh(client, token):
    response = client.get('/auth/refresh', headers=token['headers'])
    data = response.json()
    assert response.status_code == HTTPStatus.OK, data

    assert data['token_type'] == 'bearer'
    assert data['expires_in'] != token['expires_in']
    assert 'token' in data, data

    old_payload = decode_token(token['token'])
    new_payload = decode_token(data['token'])

    assert old_payload['sub'] == new_payload['sub']


def test_subject_not_in_payload_exception(client):
    response = client.get(
        '/auth/refresh',
        headers={
            'Authorization': 'Bearer '
            + create_access_token({'not-sub': 'here'})[0]
        },
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED, response.json()
    assert response.headers['WWW-Authenticate'] == 'Bearer', response.headers


def test_invalid_token(client, settings):
    invalid_token = jwt.encode(
        {
            'sub': 'admin',
            'exp': datetime.now(tz=UTC)
            + timedelta(minutes=settings.EXPIRE_MINUTES),
        },
        'Not-' + settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    response = client.get(
        '/auth/refresh', headers={'Authorization': 'Bearer ' + invalid_token}
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED, response.json()


def test_token_expired_after_time(client, user, settings):
    now = datetime.now(tz=UTC)
    with freeze_time(now):
        response = client.get(
            '/auth/',
            auth=(user.username, user.plain_password),
        )
        data = response.json()

        assert response.status_code == HTTPStatus.OK, data
        __token = data['token']

    with freeze_time(now + timedelta(minutes=settings.EXPIRE_MINUTES + 1)):
        response = client.get(
            '/auth/refresh/',
            headers={'Authorization': 'Bearer ' + __token},
        )
        data = response.json()

        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert 'detail' in data, data
        assert response.headers['WWW-Authenticate'] == 'Bearer', (
            response.headers
        )


def test_token_generation_admin(client):
    response = client.get('/auth/', auth=('admin', 'admin'))
    data = response.json()

    assert response.status_code == HTTPStatus.OK, data

    decoded_token = decode_token(data['token'])
    exp_timestamp = int(datetime.fromisoformat(data['expires_in']).timestamp())

    assert decoded_token['sub'] == 'admin'
    assert exp_timestamp == decoded_token['exp']
    assert data['token_type'] == 'bearer'


def test_wrong_admin_password(client):
    response = client.get('/auth/', auth=('admin', 'wrong-password'))

    assert response.status_code == HTTPStatus.UNAUTHORIZED, response.json()


def test_admin_token_credentials(client):
    response = client.get('/auth/', auth=('admin', 'admin'))
    admin_token = response.json()

    response = client.get(
        '/auth/refresh',
        headers={'Authorization': 'Bearer ' + admin_token['token']},
    )
    data = response.json()

    assert response.status_code == HTTPStatus.OK, data
    assert data['expires_in'] != admin_token['expires_in']
