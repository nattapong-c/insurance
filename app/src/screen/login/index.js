import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { useAuthenDispatch, useAuthenState } from '../../hook/useAuthen';

const Login = () => {
    const navigate = useNavigate();
    const { dispatchLogin } = useAuthenDispatch();
    const { authenLogin } = useAuthenState();

    useEffect(() => {
        const token = authenLogin?.info?.token;
        if (token && authenLogin.is_login) {
            localStorage.setItem('_token', token);
            navigate('/home');
        }
    }, [authenLogin.is_login]);

    const loginWithGoogle = async () => {
        const provider = new auth.GoogleAuthProvider();
        auth.signInWithPopup(auth.getAuth(), provider)
            .then((result) => {
                const email = result.user.email;
                dispatchLogin({ email });
            })
            .catch((error) => {
                // TODO modal error
                console.log(error);
            });
    };
    return (
        <>
            <h1>Login</h1>
            <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </>
    );
};
export default Login;
