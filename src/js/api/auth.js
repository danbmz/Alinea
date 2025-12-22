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
    // console.log(data);

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}