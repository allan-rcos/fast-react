from fastapi import HTTPException
from jwt import decode

from server.helpers import Settings, create_access_token, password_validate


def test_jwt(settings: Settings):
    data = {'test': 'test'}
    test_token, exp = create_access_token(data)

    decoded = decode(
        test_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
    )

    assert decoded['test'] == data['test']
    assert decoded['exp'] == int(exp.timestamp())


def test_password_validation_with_defaults():
    assert password_validate(
        'T3$tT$$t',
        False,
        min_length=8,
        min_digits=1,
        min_special=1,
        min_lower=1,
        min_upper=1,
    )


def test_password_validation():
    assert password_validate('T3$tT$$t')


def test_too_short_password_validation(settings: Settings):
    password = 's'
    assert not password_validate(password, False)
    try:
        password_validate(password)
        assert settings.PASSWORD_MIN_LENGTH <= 1, 'Exception should be raised'
    except HTTPException:
        assert settings.PASSWORD_MIN_LENGTH > 1


def test_password_without_digits_validation(settings: Settings):
    password = 'Password-Without-Digits'
    assert not password_validate(password, False)
    try:
        password_validate(password)
        assert settings.PASSWORD_MIN_DIGITS == 0, 'Exception should be raised'
    except HTTPException:
        assert settings.PASSWORD_MIN_DIGITS != 0


def test_password_without_lowercase_validation(settings: Settings):
    password = 'P4SSW0RD-W1TH0UT-L0W3R'
    assert not password_validate(password, False)
    try:
        password_validate(password)
        assert settings.PASSWORD_MIN_LOWER == 0, 'Exception should be raised'
    except HTTPException:
        assert settings.PASSWORD_MIN_LOWER != 0


def test_password_without_uppercase_validation(settings: Settings):
    password = 'p4ssw0rd-w1th0ut-upp3r'
    assert not password_validate(password, False)
    try:
        password_validate(password)
        assert settings.PASSWORD_MIN_UPPER == 0, 'Exception should be raised'
    except HTTPException:
        assert settings.PASSWORD_MIN_UPPER != 0


def test_password_without_special_characters_validation(settings: Settings):
    password = 'P4ssw0rdW1th0utSp3c14l'
    assert not password_validate(password, False)
    try:
        password_validate(password)
        assert settings.PASSWORD_MIN_SPECIAL == 0, 'Exception should be raised'
    except HTTPException:
        assert settings.PASSWORD_MIN_SPECIAL != 0
