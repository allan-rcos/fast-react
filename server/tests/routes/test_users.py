from http import HTTPStatus

from server.helpers.exceptions import (
    EmailAlreadyRegisteredException,
    OnlyOwnerException,
    UsernameAlreadyRegisteredException,
    UserNotFoundException,
)


def test_count_users(client, token, unknown_user):
    response = client.get(
        '/users/count',
        params={'page': 1, 'limit': 2},
        headers=token['headers'],
    )
    data = response.json()

    assert response.status_code == HTTPStatus.OK, data
    assert 'count' in data
    assert data['count'] > 1
    assert 'pages' in data
    assert data['pages'] == 1


def test_get_users(client, token):
    response = client.get(
        '/users/',
        headers=token['headers'],
    )
    users = response.json()

    assert response.status_code == HTTPStatus.OK, users
    assert len(users) == 1


def test_limit_filter(client, token, unknown_user):
    response = client.get(
        '/users/',
        params={'limit': 1},
        headers=token['headers'],
    )
    users = response.json()
    assert response.status_code == HTTPStatus.OK, users
    assert len(users) == 1


def test_page_filter(client, token, unknown_user):
    response = client.get(
        '/users/',
        params={'page': 2, 'limit': 1},
        headers=token['headers'],
    )
    users = response.json()
    assert response.status_code == HTTPStatus.OK, users
    assert len(users) == 1
    assert users[0]['username'] == unknown_user.username


def test_order_by_asc_filter(client, unknown_user, token):
    response = client.get(
        '/users/',
        params={'order_by': 'id'},
        headers=token['headers'],
    )
    users = response.json()
    assert response.status_code == HTTPStatus.OK, users
    assert len(users) > 1
    assert users[0]['id'] == unknown_user.id, [
        users[0]['id'], users[1]['id']
    ]


def test_order_by_desc_filter(client, unknown_user, token):
    response = client.get(
        '/users/',
        params={'order_by': 'username', 'order': 'desc'},
        headers=token['headers'],
    )
    users = response.json()
    assert response.status_code == HTTPStatus.OK, users
    assert len(users) > 1
    assert users[0]['username'] == unknown_user.username, [
        users[0]['username'], users[1]['username']
    ]


def test_get_user_by_username(client, user, token):
    response = client.get(
        f'/users/{user.username}',
        headers=token['headers'],
    )
    response_user = response.json()

    assert response.status_code == HTTPStatus.OK, response_user

    assert response_user['id'] == user.id
    assert response_user['username'] == user.username
    assert response_user['email'] == user.email


def test_get_user_username_not_found(client, user, token):
    response = client.get(
        f'/users/{"not" + user.username}',
        headers=token['headers'],
    )
    data = response.json()

    assert response.status_code == HTTPStatus.NOT_FOUND, data
    assert 'detail' in data
    assert data['detail'] == UserNotFoundException.detail


def test_post_user(client, token, unknown_user_schema):
    response = client.post(
        '/users/',
        headers=token['headers'],
        json=unknown_user_schema.model_dump(),
    )
    users = response.json()

    assert response.status_code == HTTPStatus.OK, users
    assert len(users) > 1


def test_post_existing_user(client, user, token):
    response = client.post(
        '/users/',
        headers=token['headers'],
        json={
            'username': user.username,
            'email': 'not' + user.email,
            'password': user.plain_password,
        },
    )
    data = response.json()
    assert response.status_code == HTTPStatus.BAD_REQUEST, data
    assert 'detail' in data
    assert data['detail'] == UsernameAlreadyRegisteredException.detail


def test_post_existing_email(client, user, token):
    response = client.post(
        '/users/',
        headers=token['headers'],
        json={
            'username': 'not' + user.username,
            'email': user.email,
            'password': user.plain_password,
        },
    )
    data = response.json()
    assert response.status_code == HTTPStatus.BAD_REQUEST, data
    assert 'detail' in data
    assert data['detail'] == EmailAlreadyRegisteredException.detail


def test_patch_user(client, user, token):
    new_username = 'testUpdate'
    response = client.patch(
        f'/users/{user.username}',
        headers=token['headers'],
        json={
            'username': new_username,
            'password': user.password + '2',
        },
    )
    users = response.json()

    assert response.status_code == HTTPStatus.OK, users

    assert len(users) == 1
    assert users[0]['id'] == user.id
    assert users[0]['username'] == new_username
    assert 'x-new-token' in response.headers
    assert 'x-new-token-expires-in' in response.headers


def test_patch_user_not_owner(client, unknown_user, token):
    response = client.patch(
        f'/users/{unknown_user.username}',
        headers=token['headers'],
        json={
            'username': unknown_user.username,
            'email': 'not' + unknown_user.email,
        },
    )
    data = response.json()

    assert response.status_code == HTTPStatus.FORBIDDEN, data
    assert 'detail' in data
    assert data['detail'] == OnlyOwnerException.detail


def test_patch_user_to_a_existing_username(client, user, unknown_user, token):
    response = client.patch(
        f'/users/{user.username}',
        headers=token['headers'],
        json={
            'username': unknown_user.username,
        },
    )
    data = response.json()

    assert response.status_code == HTTPStatus.BAD_REQUEST, data
    assert 'detail' in data
    assert data['detail'] == UsernameAlreadyRegisteredException.detail


def test_patch_user_to_a_existing_email(client, user, unknown_user, token):
    response = client.patch(
        f'/users/{user.username}',
        headers=token['headers'],
        json={
            'email': unknown_user.email,
        },
    )
    data = response.json()

    assert response.status_code == HTTPStatus.BAD_REQUEST, data
    assert 'detail' in data
    assert data['detail'] == EmailAlreadyRegisteredException.detail


def test_delete_user(client, user, token):
    response = client.delete(
        f'/users/{user.username}',
        headers=token['headers'],
    )
    users = response.json()

    assert response.status_code == HTTPStatus.OK, users
    assert users == []


def test_delete_another_user(client, unknown_user, token):
    response = client.delete(
        f'/users/{unknown_user.username}',
        headers=token['headers'],
    )
    data = response.json()

    assert response.status_code == HTTPStatus.FORBIDDEN, data
    assert 'detail' in data
    assert data['detail'] == OnlyOwnerException.detail
