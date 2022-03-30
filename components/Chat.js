import React,{useState,useEffect} from 'react';
import styled from"styled-components";
import {Avatar} from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail"
import {useAuthState} from "react-firebase-hooks/auth"
import {auth,db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import{useRouter} from "next/router";
import moment from "moment"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Head from 'next/head'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';

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
   const [notification,SetNotification]=useState(0)
   const ReadLastMessage=()=>{
    lastMessageSnapshot?.docs.map((message)=>{
        if(user.email!==message.data().user){
           if(message.data().read==false){
            db.collection('chats').doc(id).collection('messages').doc(message.id).update({
                read:true
            }
                
            )
        } 
        }
        
    })
}
    
   
  return (
      <Container onClick={()=>{enterChat();ReadLastMessage()}}>

          {recipient ? (
             <UserAvatar src={recipient?.photoURL}/> 
          ):(
            <UserAvatar>{recipientEmail[0]}</UserAvatar> 
          )}
          <EmailMessageContainer>
             <Email >{recipientEmail}</Email>
          
          {lastMessageSnapshot?.docs.map((message)=>{
                if(message.id==lastMessageId && message.data().user!=user.email && message.data().read===false){
                    
                    return(
                        
                        <LTcontainer key={message.id}>
                            <NotificationsActiveIcon fontSize="small" color="secondary"/>
                        </LTcontainer>
                        
                        
                    )
                    
                    }
                })}
          
          
          {lastMessageSnapshot?.docs.map((message)=>{
              if(message.id==lastMessageId){

                  return(
                      <LTcontainer key={message.id}>
                          {message.data().user===user.email?(
                            <div>
                                <LastMessage style={{"fontFamily":"Roboto"}}>{message.data().message}</LastMessage>
                                <ReadTimeContainer >
                                    {message.data().read ===false?(
                                        <MarkChatUnreadIcon fontSize="small" style={{ color: 'grey' }}></MarkChatUnreadIcon>
                                    ):
                                        <MarkChatReadIcon fontSize="small" color="info"></MarkChatReadIcon>}
                                    <LastMessage style={{"fontFamily":"Roboto","marginLeft":"20px"}}>{message.data().timestamp?.toDate().toLocaleTimeString('en-US')}</LastMessage>
                                </ReadTimeContainer>
                                
                            </div>
                            
                          ):(
                            <div>
                                <LastMessage>{message.data().user}:</LastMessage>
                                <LastMessage style={{"fontFamily":"Roboto"}}>{message.data().message}</LastMessage>
                                <LastMessage style={{"fontFamily":"Roboto"}}>{message.data().timestamp?.toDate().toLocaleTimeString('en-US')}</LastMessage>
                            </div>
                          )}
                          
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
const Email=styled.p`
font-family:'Roboto';
font-size:calc(8px + 0.3vw);
`;

const ReadTimeContainer=styled.div`
display:flex;
align-items:center;
justify-content:flex-end;
width:100%;
flex-wrap: wrap;


`;

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
margin-right:5px;
color:purple;

`;