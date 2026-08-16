import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios";
//here we will use access token as jwt token for auth purpose
//using axios we can get that access token axios is http client that will give information about the log logged in user
//usegoogleAuth hook

export const fetchUserProfile = (accessToken)=>{
    return axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
        }
    })
}


export const useGoogleAuth = ({onSuccess})=>{
    return useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const res = await fetchUserProfile(codeResponse.access_token)
            localStorage.setItem("user",JSON.stringify(res.data))
            onSuccess?.(res.data)
        },   
        onError:console.log
    });
};