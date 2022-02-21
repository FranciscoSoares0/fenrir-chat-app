import React from 'react'
import styled from "styled-components"
import {db,auth} from "../firebase";
import {Avatar,Button, IconButton} from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import {useAuthState} from "react-firebase-hooks/auth";
import{useRouter} from "next/router";
import {useCollection} from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { useEffect, useState,useRef } from "react";
import Message from "./Message"
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from "timeago-react"
import {Picker} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import SendIcon from '@mui/icons-material/Send';




function ChatScreen({chat,messages}) {
    const[showEmojis,setShowEmojis]=useState(false);
    const[user]=useAuthState(auth);
    const[input,setInput]=useState("");
    const endOfMessagesRef=useRef(null);
    const router=useRouter();
    const [messagesSnapshot]=useCollection(
        db.collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy("timestamp","asc"));
    const [recipientSnapshot]=useCollection(
        db.collection("users").where("email","==",getRecipientEmail(chat.users,user))
        );
    
    
    const showMessages=()=>{
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message=>(
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp:message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message=>(
                <Message key={message.id} user={message.user} message={message}/>
            ));
        }
        
    }

    const scrollToBottom=()=>{
        endOfMessagesRef.current.scrollIntoView({
            behavior:"smooth",
            block:"start",
        });
    }
    const sendMessage=(e) =>{
        e.preventDefault();
        db.collection("users").doc(user.uid).set({
            lastSeen:firebase.firestore.FieldValue.serverTimestamp(),

        },
        {merge:true});
        db.collection('chats').doc(router.query.id).collection('messages').add({
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        message:input,
        user:user.email,
        photoURL:user.photoURL,
        
        
    });
        console.log(input);
        setInput("");
        scrollToBottom();
    };
 

    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
        setShowEmojis(!showEmojis)
       
      
      };

    const recipient=recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail=getRecipientEmail(chat.users,user);
  return (
    <Container>
        <Header>
            {recipient ? (
                <Avatar src={recipient?.photoURL}/>
            ):(

                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            
            <HeaderInformation>
                <h3>{recipientEmail}</h3>
                {recipientSnapshot ? (
                    <p>Última sessão: {' '}
                     {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                    ):"Indisponível"}
                    </p>
                ):(
                    <p>A carregar última sessão...</p>
                )}
                
            </HeaderInformation>
            <HeaderIcons>
                <input  onSubmit={sendMessage}  id="icon-button-file"
                    type="file" style={{ display: 'none' }} />
                <label htmlFor="icon-button-file">
                <IconButton  color="secondary" aria-label="upload picture"
                    component="span">
                    <AttachFileIcon />
                </IconButton>
                </label>  
                
            </HeaderIcons>
        </Header>

        <MessageContainer>
            {showMessages()}
            <EndofMessage ref={endOfMessagesRef}/>
        </MessageContainer>

        <EmoticonContainer>
                {showEmojis && (<Picker style={{width: '100%'}} onSelect={addEmoji}/>)}
                
            </EmoticonContainer>
        <InputContainer>
            
            <IconButton>
                    <InsertEmoticonIcon color="secondary" fontSize='inherit' onClick={() => {setShowEmojis(!showEmojis)}}/>
                </IconButton>
            <Input value={input} onChange={e=> setInput(e.target.value)}/>
            <IconButton>
                <SendIcon  color="secondary" disabled={!input} type="submit" onClick={sendMessage}></SendIcon>
            </IconButton>
            
            
        </InputContainer>
    </Container>
  );
}

export default ChatScreen
const EmoticonContainer=styled.div`
display:flex;
flex-direction:column;
`;

const Container=styled.div`

`;

const Input=styled.input`
flex:1;
outline:0;
border:none;
border-radius:10px;
padding:20px;
margin-left: 15px;
margin-right:15px;
background-color:whitesmoke;

`;

const InputContainer=styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
`;

const Header=styled.div`
position:sticky;
background-color:white;
z-index:100;
top:0;
display:flex;
padding:11px;
height:80px;
align-items:center;
border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation=styled.div`
margin-left:15px;
flex:1;

>h3{
    margin-bottom:3px;
}

>p{
    font-size:14px;
    color:gray;
}
`;

const HeaderIcons=styled.div``;

const EndofMessage=styled.div`
margin-bottom:50px;
`;

const MessageContainer=styled.div`
padding:30px;
background-color:#e2e9ee;
min-height: 80vh;
`;