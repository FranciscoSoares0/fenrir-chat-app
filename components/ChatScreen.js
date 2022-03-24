import React from 'react'
import styled from "styled-components"
import {db,auth,firestore} from "../firebase";
import {Avatar,Button, IconButton} from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import {useAuthState} from "react-firebase-hooks/auth";
import{useRouter} from "next/router";
import {useCollection} from "react-firebase-hooks/firestore";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
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
import DeleteIcon from '@mui/icons-material/Delete';
import{collection,getDocs,deleteDoc,doc} from "firebase/firestore"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";




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
        const [chatsSnapshot]=useCollection(
            db.collection("chats")
            );
    
    const test=messagesSnapshot?.docs?.[(messagesSnapshot?.docs?.length)-1]?.id?.message
    
    console.log(test)
    const notify = () => toast.error('Conversa Removida!', {
    position: "top-center",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });

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
        read:false
        
        
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
const recipient2=chatsSnapshot?.docs?.[0]?.id;

const recipientEmail=getRecipientEmail(chat.users,user);

const deleteUserById=async(id)=>{
    const input=prompt('Tem a certeza que pretende eliminar esta conversa?Isto irá eliminar todas as mensagens!Insira(Sim/Não)');
    if (input==="Sim"|| input==="sim"){
        const docRef=doc(db,"chats",id);
        await deleteDoc(docRef);
        notify();
        setTimeout(function(){
            location.href = "https://fenrir-chat-app.herokuapp.com/";  
        },1000);
    }
    
    
    
    
}

const ScrollDown=()=>{
    
    var objDiv = document.getElementById('container');
    var mesDiv=document.getElementById("message-container");
    console.log(objDiv);
    
    objDiv.scrollIntoView(true);
    var myDiv = document.getElementById("message-container");
    myDiv.scrollTop = myDiv.scrollHeight;
    
    
      
}
  return (
    <Container>
        <Head>
            <title>Fenrir</title>
            <link rel="icon" href="/icon.png" />
        </Head>
        <Header>
            {recipient ? (
                <Avatar src={recipient?.photoURL}/>
            ):(

                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            
            <HeaderInformation>
                <h3 style={{"fontFamily":"Roboto"}}>{recipientEmail}</h3>
                {recipientSnapshot ? (
                    <p>Última sessão: {' '}
                     {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo style={{"fontFamily":"Roboto"}} datetime={recipient?.lastSeen?.toDate()}/>
                    ):"Indisponível"}
                    </p>
                ):(
                    <p>A carregar última sessão...</p>
                )}
                
            </HeaderInformation>
            <HeaderIcons>
                <IconButton>
                    <DeleteIcon onClick={()=>deleteUserById(recipient2)} color="secondary" />
                </IconButton>
                  
                
            </HeaderIcons>
        </Header>

        <MessageContainer id="message-container">
            {showMessages()}
            <EndofMessage ref={endOfMessagesRef}/>
            
        </MessageContainer>
                    
        
           
        <EmoticonContainer >
                
            {showEmojis && (<Picker  style={{width: '100%'}} onSelect={addEmoji}/>)}
                
        </EmoticonContainer>
        <InputContainer id="container"  >
            <IconButton>
                <EmojiEmotionsIcon color="secondary" fontSize='inherit' onClick={() => {setShowEmojis(!showEmojis);ScrollDown()}}/>
            </IconButton>
        <Input onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} value={input} onChange={e=> setInput(e.target.value)}/>
        <IconButton>
            <SendIcon  color="secondary" disabled={!input} type="submit" onClick={sendMessage}></SendIcon>
        </IconButton>
            
            
        </InputContainer> 
       
        
        <ToastContainer
            theme="dark"
            type="default"
            position='top-center'
            
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
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
min-width:10vh;
font-family: 'Roboto';

`;

const InputContainer=styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
min-width:15vh;
width:100%;
font-family: 'Roboto';


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
min-width:8vh;

`;

const HeaderInformation=styled.div`
min-width:240px;
margin-left:15px;
flex:1;
min-width:10vh;

>h3{
    margin-bottom:3px;
    font-size:calc(6px + 0.8vw);
}

>p{
    font-size:calc(6px + 0.3vw);
    color:gray;
}
`;

const HeaderIcons=styled.div`
`;

const EndofMessage=styled.div`
margin-bottom:50px;
`;

const MessageContainer=styled.div`
padding:30px;
background-color:#e2e9ee;
min-height: 100vh;
min-width:10vh;
`;

