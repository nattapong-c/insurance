import styled from 'styled-components';

export const LoginContainer = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
`;

export const GoogleLoginButton = styled.div`
    height: 50px;
    width: 240px;
    display: flex;
    border: 1px solid #4285f4;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
    transition: background-color .218s,border-color .218s,box-shadow .218s;
    cursor: pointer;

    &:hover {
        box-shadow: 0 0 3px 3px rgb(66 133 244 / 30%);
    }

    & .left {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        width: 60px;
    }

    & .right {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background-color: #4285f4;
        font-size: 16px;
        font-family: Roboto,arial,sans-serif;
        letter-spacing: .21px;
    }
`;
