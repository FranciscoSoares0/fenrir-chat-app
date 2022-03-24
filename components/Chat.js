import React,{useState,useEffect} from 'react';
import styled from"styled-components";
import {Avatar} from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail"
import {useAuthState} from "react-firebase-hooks/auth"
import {auth,db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import{useRouter} from "next/router";
import moment from "moment"

function Chat({id,users}) {
    const router=useRouter();
    const[user]=useAuthState(auth);
    const userChatRef=db.collection('chats').where('users','array-contains',user.email)
    
    const[chatsSnapshot]=useCollection(userChatRef)
    const [recipientSnapshot]=useCollection(
        db.collection("users").where("email","==",getRecipientEmail(users,user))
        );

    const enterChat = () =>{
        router.push(`/chat/${id}`)
    }
    const recipient=recipientSnapshot?.docs?.[0]?.data();
    const lastMessageRef=db.collection("chats").doc(id).collection("messages").orderBy("timestamp","asc")
    
    const [lastMessageSnapshot]=useCollection(lastMessageRef)
    
    const recipientEmail=getRecipientEmail(users,user);
   const lastMessageId=lastMessageSnapshot?.docs?.[(lastMessageSnapshot?.docs?.length)-1]?.id
   
   
   
  return (
      <Container onClick={enterChat}>
          {recipient ? (
             <UserAvatar src={recipient?.photoURL}/> 
          ):(
            <UserAvatar>{recipientEmail[0]}</UserAvatar> 
          )}
          <EmailMessageContainer>
             <p style={{"fontFamily":"Roboto"}}>{recipientEmail}</p>
          {lastMessageSnapshot?.docs.map((message)=>{
              if(message.id==lastMessageId){
                  return(
                      <LTcontainer key={message.id}>
                          <LastMessage style={{"fontFamily":"Roboto"}}>{message.data().message}</LastMessage>
                          <LastMessage style={{"fontFamily":"Roboto"}}>{message.data().timestamp?.toDate().toLocaleTimeString('en-US')}</LastMessage>
                      </LTcontainer>
                      
                  )
              }
              
               
            
          }
              
          )}
         
          </EmailMessageContainer>
          
          
      </Container>
  
  );
        }

export default Chat;
const LTcontainer=styled.div`
display:flex;

align-items:flex-end;
`;

const Container=styled.div`
display:flex;
align-items:center;
cursor:pointer;
padding:15px;
word-break:break-word;
:hover{
    background-color:whitesmoke;
}
`;

const UserAvatar = styled(Avatar)`
margin:1px;
margin-right:15px;
`;

const EmailMessageContainer=styled.div`
display:flex;
flex-direction:column;

`;

const LastMessage = styled.p`
font-size:calc(1px + 0.7vw);
margin-right:5px;
color:purple;

`;