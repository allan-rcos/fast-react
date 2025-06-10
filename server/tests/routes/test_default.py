from http import HTTPStatus


def test_info_route(client):
    response = client.get('/info')
    data = response.json()

    assert response.status_code == HTTPStatus.OK, data
    assert 'app_name' in data
    assert 'password_min_length' in data
    assert 'password_min_digits' in data
    assert 'password_min_special' in data
    assert 'password_min_uppercase' in data
    assert 'password_min_lowercase' in data
    assert 'token_expire_minutes' in data


def test_root_returning_hello_world(client):
    response = client.get('/')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'Hello world!'}
