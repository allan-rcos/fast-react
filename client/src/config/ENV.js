const ENV = {
    'API_DOMAIN': process.env.API_DOMAIN || '127.0.0.1',
    'API_PORT': process.env.API_PORT || '5000',
    'API_HOME': process.env.API_HOME || '',
    'API_PROTOCOL': process.env.API_PROTOCOL || 'http',
    'API_URL': (path, query) => {
        return ENV['API_PROTOCOL'] + '://' +
            ENV['API_DOMAIN'] + ':' +
            ENV['API_PORT'] + '/' +
            ENV['API_HOME'] + (ENV['API_HOME'] ? '/' : '') +
            (path ?? '') +
            (query?.trim() ? '?'.concat(query) : '')
            ;
    }
}

export default ENV;