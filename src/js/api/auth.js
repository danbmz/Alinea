export async function registerUser(dataForm) {
    const URL = '/api/register';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function verifyAccount(token) {
    const URL = 'http://localhost:3000/api/verify-account';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    const data = await response.json(); 

    return {
        ok: response.ok,
        status: response.status,
        data
    }
}

export async function forgotPassword(email) {
    const URL = 'http://localhost:3000/api/forgot';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function resetPassword(token, dataForm) {
    const URL = 'http://localhost:3000/api/reset';

    dataForm.token = token; 

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function login(dataForm) {
    const URL = 'http://localhost:3000/api/login';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    });

    const data = await response.json();
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

export async function logout() {
    const URL = '/api/logout';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data
    }
}

// Funcion auxiliar para validar tokens
export async function validateToken(token) {
    const URL = 'http://localhost:3000/api/validate-token';

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    const data = await response.json();
    
    return {
        ok: response.ok,
        status: response.status,
        data
    };
}