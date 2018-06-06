import jwt_decode from 'jwt-decode';

export default function (token) {
    console.log("Token: ", token);
    console.log(jwt_decode(token));
};