const AUTH_TOKEN = "AUTH_TOKEN";

export function setAuthUser(token: string | null) {
    if (token) {
        // Set the token in cookies with an expiration time of 1 hour
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour in milliseconds
        const expires = expirationDate.toUTCString();
        document.cookie = `${AUTH_TOKEN}=${token}; expires=${expires}; path=/;`;
    } else {
        // Remove the token from cookies by setting an expiration date in the past
        document.cookie = `${AUTH_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}


export function getAuthUser(): string | null {
    // Retrieve the authentication token from cookies
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === AUTH_TOKEN) {
            return value;
        }
    }
    return null;
}

export function getAppBaseUrl() {
    if (process.env.ENVIRONMENT == "PRODUCTION"){
        return process.env.APP_BASE_URL
    } else {
        return process.env.APP_BASE_URL
    }
}


