var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.secretPassword;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({ // si le user ne possede pas le token pour un admin voici les actions qu'ils peut seulement faire
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] }, // anyboby can see the imges
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/auth/signup`,
            `${api}/auth/login`,
        ]
    })
}

async function isRevoked(req, payload, cb) {

    console.log('voici le payload', payload.payload.isAdmin);
    if(!payload.payload.isAdmin) {
      return true;
    }

    return false;
}



module.exports = authJwt