import { getAuthUser, setAuthUser } from "../utility/utility";

export class AuthController {

    public static async signInHandler(formData: { userEmail: string; password: string; }) {
        const result = await fetch("http://localhost:3002/api/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "userEmail": formData.userEmail, "password": formData.password })
        })

        // Store the response.
        const data = await result.json();

        console.log(data);

        if (result.ok) {
            // get the token from the response
            const token = data.token;

            // Set the token in sessionStorage
            setAuthUser(token);
            return true;
        } else {
            alert(data.message);
        }
    }

    public static async getCurrentUser() {
        // Retrieve the authentication token from sessionStorage or localStorage
        const token = getAuthUser();

        if (!token) {
            // Handle case where token is not available
            return;
        }

        try {
            const response = await fetch("http://localhost:3002/api/currentUser", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // Set the token in the Authorization header
                }
            });

            if (response.ok) {
                // Response is okay (status code 200)
                return true;
            } else {
                // Handle case where response is not okay
                return false;
            }

        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    public static async signOutHandler() {
        setAuthUser(null);

        // Reload the current page
        window.location.reload();
    }
}