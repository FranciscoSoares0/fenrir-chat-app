import React from 'react';
import styled from "styled-components";
import {Circle} from "better-react-spinkit"

function Loading() {
  
  return (
    <center style={{display:"grid",placeItems:"center",height:"100vh"}}>
        <div>
        <Logo src="/wolf.png" height={200}
        style={{marginBottom:10}}></Logo>
        <Circle color="#a7bdcd" size={70}></Circle>
        </div>
    </center>
  )
}

export default Loading;

const Logo=styled.img`
height: 200px;
width:200px;
margin-bottom: 50px;
`;