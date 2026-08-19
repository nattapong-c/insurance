import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { useAuthenDispatch, useAuthenState } from '../../hook/useAuthen';
import Loading from '../../component/loading/Loading';
import { Modal } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { getToken } from '../../utils/authen';
import {
  LoginContainer,
  LoginCard,
  BrandIcon,
  AppTitle,
  AppSubtitle,
  GoogleLoginButton
} from './styled-component';

const Login = () => {
  const navigate = useNavigate();
  const { dispatchLogin } = useAuthenDispatch();
  const { authenLogin } = useAuthenState();

  useEffect(() => {
    const token = getToken();
    if (token) navigate('/home');
  }, [navigate]);

  useEffect(() => {
    const token = authenLogin?.info?.token;
    if (token && authenLogin.is_login) {
      localStorage.setItem('_token', token);
      navigate('/home');
    }
  }, [authenLogin.is_login, authenLogin.info, navigate]);

  useEffect(() => {
    if (authenLogin.done && authenLogin.error) {
      Modal.error({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        content: authenLogin.error || 'โปรดตรวจสอบสิทธิ์การเข้าใช้งานของบัญชีนี้'
      });
    }
  }, [authenLogin.done, authenLogin.error]);

  const loginWithGoogle = async () => {
    const provider = new auth.GoogleAuthProvider();
    auth
      .signInWithPopup(auth.getAuth(), provider)
      .then((result) => {
        const email = result.user.email;
        dispatchLogin({ email });
      })
      .catch((error) => {
        Modal.error({
          title: 'เข้าสู่ระบบผิดพลาด',
          content: error?.message || 'ไม่สามารถเชื่อมต่อกับ Google ได้'
        });
      });
  };

  return (
    <Loading show={authenLogin?.loading} tip="กำลังเข้าสู่ระบบ...">
      <LoginContainer>
        <LoginCard>
          <BrandIcon>
            <SafetyCertificateOutlined />
          </BrandIcon>
          <AppTitle>Insurance Hub</AppTitle>
          <AppSubtitle>ระบบบริหารจัดการใบเสนอราคาและใบวางบิล</AppSubtitle>

          <GoogleLoginButton onClick={loginWithGoogle}>
            <img
              src={require('../../assets/google-48.png')}
              width={20}
              height={20}
              alt="Google"
            />
            <span>เข้าสู่ระบบด้วย Google</span>
          </GoogleLoginButton>
        </LoginCard>
      </LoginContainer>
    </Loading>
  );
};

export default Login;
