import { API_BASE_URL } from "../constants";
import { APIResponse, User } from "../types";

export async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
) {
    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        }),
    });
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result as APIResponse<User>;
}

export async function signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result as APIResponse<User>;
}
