import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4040",
    withCredentials: true
})

/**
 * 
 * @param {Object} param0 
 * @param {String} param0.username - the username of user
 * @param {String} param0.email - the email of user
 * @param {String} param0.password - the password of user
 * @returns {Promise<Object>} - Return API Response Data
 */
export async function register({ username, email, password }){

    try{
        const response = api.post("/api/auth/register",
            {
                username,
                email,
                password
            }
        );

        return response.data
    }
    catch(err){
        console.log(err)
    }
}


/**
 * 
 * @param {Object} param0 
 * @param {String} param0.email - the email of user
 * @param {String} param0.password - the password of user
 * @returns {Promise<Object>} - Return API Response Data
 */
export async function login({ email, password}){

    try{

        const response = await api.post("/api/auth/login",{
            email,password
        })

        return response.data;
    }
    catch(err){
        console.log(err)
    }

}

/**
 * Logs out the currently authenticated user.
 * Sends a request to the backend to clear the authentication cookie/session.
 * 
 * @returns {Promise<Object>} Returns the response data from the API after logout
 */
export async function logout(){

    try{
        const response = await api.get("/api/auth/logout");

        return response.data;
    }
    catch(err){
        console.log(err)
    }
}

/**
 * Fetches the currently logged-in user's information.
 * This endpoint usually reads the authentication token/cookie
 * and returns the user's profile details.
 * 
 * @returns {Promise<Object>} Returns the authenticated user's data
 */
export async function getMe() {
    
    try{
        const response = await api.get("/api/auth/get-me")
        return response.data;
    }
    catch(err){
        console.log(err)
    }
}