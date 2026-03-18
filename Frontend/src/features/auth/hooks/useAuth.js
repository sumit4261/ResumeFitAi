import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api"

export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({email , password}) =>{
        setLoading(true)
        try{
            await login({email,password})
            const currentUser = await getMe()
            if (!currentUser?.user) {
                throw new Error("Authentication failed. Please try again.")
            }
            setUser(currentUser.user)
            return true
        }
        catch(err){
            console.error("Login failed", err)
            setUser(null)
            return false
        }finally{
            setLoading(false)
        }
    }

     const handleRegister = async ({username, email , password}) =>{
        setLoading(true)
        try{
            await register({username, email,password})
            const currentUser = await getMe()
            if (!currentUser?.user) {
                throw new Error("Registration succeeded but session could not be created.")
            }
            setUser(currentUser.user)
            return true
        }catch(err){
            console.error("Registration failed", err)
            setUser(null)
            return false
        }
        finally{
            setLoading(false)
        }
    }

     const handlelogout = async () =>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
            return true
        }
        catch(err){
            console.error("Logout failed", err)
            return false
        }
        finally{
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handlelogout}
}
