import React from 'react';
import styled from "styled-components";
import Head from "next/head";
import {Avatar,IconButton} from "@material-ui/core";
import { auth,provider } from '../firebase';
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';


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
          <Title>Fenrir</Title>
          <Logo src="/wolf.png"></Logo>
          <Button  startIcon={<GoogleIcon color="white" />} onClick={signIn} variant="contained" color="secondary">CONTINUAR COM A GOOGLE</Button>
        </LoginContainer>
    </Container>
  )
}

export default Login;

const Title=styled.h1`
font-family:'Sansita Swashed' ;
font-size:calc(80px + 0.3vw);


`;
const Container=styled.div`
display:grid;
place-items: center;

background: #4568DC;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #B06AB3, #4568DC);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #B06AB3, #4568DC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
width: 100%;
height: 100vh;

`;

const LoginContainer=styled.div`
display:flex;
flex-direction:column;
padding:70px;
align-items:center;
background-color:white;
border-radius:18% 82% 9% 91% / 85% 21% 79% 15%     ;

min-height: 250px;
`;

const Logo=styled.img`
height: 200px;
width:200px;
margin-bottom: 50px;
`;
