from argparse import ArgumentParser
from secrets import token_hex


def generate_secret(length: int | None = None):
    secret_line = f'SECRET_KEY="{token_hex(length)}"'
    content = ''
    exists = False
    with open('.env', 'r', encoding='utf-8') as file:
        for line in file:
            if not line.startswith('SECRET_KEY'):
                content += line
            else:
                exists = True

    if exists:
        replace = input('Replace current secret? (y/n): ').lower().strip()
        if not replace == 'y':
            return
        content += secret_line

        with open('.env', 'w', encoding='utf-8') as file:
            file.write(content)
            return

    with open('.env', 'a', encoding='utf-8') as file:
        file.write('\n' + secret_line)


if __name__ == '__main__':
    parser = ArgumentParser(description='Generate a secret key')
    parser.add_argument(
        '-l', '--Length', type=int, help='Length of the secret key'
    )
    arguments = parser.parse_args()
    if arguments.Length:
        generate_secret(length=arguments.Length)
    else:
        generate_secret()
