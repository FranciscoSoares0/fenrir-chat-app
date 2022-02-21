import React from 'react';
import styled from "styled-components";
import Head from "next/head";
import {Avatar,Button, IconButton} from "@material-ui/core";
import { auth,provider } from '../firebase';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {

  const signIn= () =>{
    auth.signInWithPopup(provider).catch(alert)
  };

  return (
    <Container>
        <Head>
            <title>Fenrir</title>
            <link rel="icon" href="/icon.png" />
        </Head>
        <LoginContainer>
          <Logo src="/wolf.png"></Logo>
          <Button startIcon={<GoogleIcon color="info" />} onClick={signIn} variant="outline">CONTINUAR COM A GOOGLE</Button>
        </LoginContainer>
    </Container>
  )
}

export default Login;

const Container=styled.div`
display:grid;
place-items: center;
height:100vh;
background: #2980B9;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #FFFFFF, #6DD5FA, #2980B9);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #FFFFFF, #6DD5FA, #2980B9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`;

const LoginContainer=styled.div`
display:flex;
flex-direction:column;
padding:100px;
align-items:center;
background-color:white;
border-radius:5px; `;

const Logo=styled.img`
height: 200px;
width:200px;
margin-bottom: 50px;
`;
