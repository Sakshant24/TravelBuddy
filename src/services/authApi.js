import { useGoogleLogin } from "@react-oauth/google"

//usegoogleAuth hook
export const usegoogleAuth = ({onSuccess})=>{
    return useGoogleLogin({
        onSuccess:(codeResponse) => console.log(codeResponse),
        flow:'auth-code',
        onError:console.log
    });
}