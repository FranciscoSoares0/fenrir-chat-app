import React from 'react';
import styled from "styled-components";
import {Circle} from "better-react-spinkit"
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
  
  return (
    <center style={{display:"grid",placeItems:"center",height:"100vh"}}>
        <LoadingContainer>
        <Logo src="/wolf.png" height={200}
        style={{marginBottom:10}}></Logo>
        <CircularProgress size={100} color="secondary" />
        </LoadingContainer>
    </center>
  )
}

export default Loading;

const Logo=styled.img`
height: 200px;
width:200px;
margin-bottom: 50px;
`;

const LoadingContainer=styled.div`
display:flex;
flex-direction: column;
justify-content: center;
align-items: center;`;