import jwt_decode from 'jwt-decode';

export default function (token) {
    if (undefined === token || token.length === 0)
        return false;

    let decoded = jwt_decode(token);
    let current = Date.now();

    if (undefined !== decoded.exp && null != decoded.exp) {
        if (decoded.exp > current)
            return decoded;
    }

    return false;
}
