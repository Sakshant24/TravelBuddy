import { useGoogleLogin } from "@react-oauth/google"
//here we will use access token as jwt token for auth purpose
//using axios we can get that access token axios is http client that will give information about the log logged in user
//usegoogleAuth hook
export const usegoogleAuth = ({onSuccess})=>{
    return useGoogleLogin({
        onSuccess:(codeResponse) => console.log(codeResponse),   
        onError:console.log
    });
};
