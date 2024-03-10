const AUTH_TOKEN = "AUTH_TOKEN";

export function setAuthUser(token: string | null) {
    if (token) {
        sessionStorage.setItem(AUTH_TOKEN, token);
    }
    else {
        sessionStorage.removeItem(AUTH_TOKEN);
    }
}

export function getAuthUser() {
    // Retrieve the authentication token from sessionStorage or localStorage
    const token = sessionStorage.getItem(AUTH_TOKEN);
    return token;
};


