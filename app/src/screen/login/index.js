import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { useAuthenDispatch, useAuthenState } from '../../hook/useAuthen';
import Loading from '../../component/loading/Loading';
import { Modal } from 'antd';
import { getToken } from '../../utils/authen';
import { LoginContainer, GoogleLoginButton } from './styled-component';

const Login = () => {
    const navigate = useNavigate();
    const { dispatchLogin } = useAuthenDispatch();
    const { authenLogin } = useAuthenState();

    useEffect(() => {
        const token = getToken();
        if (token) navigate('/home');
    }, []);

    useEffect(() => {
        const token = authenLogin?.info?.token;
        if (token && authenLogin.is_login) {
            localStorage.setItem('_token', token);
            navigate('/home');
        }
    }, [authenLogin.is_login]);

    useEffect(() => {
        if (authenLogin.done && authenLogin.error) {
            Modal.error({
                title: 'Login error',
                content: authenLogin.error
            });
        }
    }, [authenLogin.done]);

    const loginWithGoogle = async () => {
        const provider = new auth.GoogleAuthProvider();
        auth.signInWithPopup(auth.getAuth(), provider)
            .then((result) => {
                const email = result.user.email;
                dispatchLogin({ email });
            })
            .catch((error) => {
                Modal.error({
                    title: 'Login error',
                    content: error
                });
            });
    };
    return (
        <>
            <Loading show={authenLogin?.loading}>
                <LoginContainer>
                    <div>
                        <h1>Login</h1>
                        <GoogleLoginButton onClick={() => loginWithGoogle()}>
                            <div className='left'>
                                <img src={require('../../assets/google-48.png')} width={20}/>
                            </div>
                            <div className='right'>Sign in with Google</div>
                        </GoogleLoginButton>
                    </div>
                </LoginContainer>
            </Loading>
        </>
    );
};
export default Login;
