export async function registerProject(dataForm) {
    const URL = 'http://localhost:3000/api/projects/create';

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

export async function getUserProjects() {
    const URL = '/api/projects';

    const response = await fetch(URL, {method: 'GET'});

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}