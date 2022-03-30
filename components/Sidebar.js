import {Avatar,Button, IconButton} from "@material-ui/core";
import styled from "styled-components";
import AddCommentIcon from '@mui/icons-material/AddComment';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import {auth, db} from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import Chat from "./Chat"
import  {useState} from "react";
import getRecipientEmail from '../utils/getRecipientEmail'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Sidebar() {
const [searchTerm,setSearchTerm]=useState("");
const [user]=useAuthState(auth)
const userChatRef=db.collection('chats').where('users','array-contains',user.email)
const[chatsSnapshot]=useCollection(userChatRef)

const notify = () => toast('🐺 Conversa Adicionada!', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
const createChat= () =>{
    const input=prompt('Insira um email do utilizador com o qual quer conversar');
    if(!input) return null


    if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input!==user.email){
        db.collection('chats').add({
            users:[user.email,input],
        });
        notify();
    }
};

const chatAlreadyExists=(recipientEmail)=>
    !!chatsSnapshot?.docs.find(chat=> chat.data().users.find(user=>user===recipientEmail)?.length>0)
const SignOut=()=>{
    location.href = "https://fenrir-chat-app.herokuapp.com/";
    auth.signOut()
    
}

    return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL}/>

            <IconsContainer>
                <IconButton>
                    <AddCommentIcon style={{ color: 'purple' }} onClick={createChat}/>
                </IconButton>
                <IconButton>
                    <LogoutIcon style={{ color: 'purple' }} onClick={() =>SignOut()}/>
                </IconButton>
            </IconsContainer>
        </Header>
        <Search>
            <SearchIcon/>
            <SearchInput
            style={{"fontFamily":"Roboto"}}
            type="text"
            placeholder="Pesquise uma conversa"
            onChange={(event) => {
                setSearchTerm(event.target.value);
            }}
        />
        </Search>
        {chatsSnapshot?.docs.filter((user)=>{
            if(searchTerm==""){
                return user
            } else if (user.data().users[1].toLowerCase().includes(searchTerm.toLowerCase())){
                console.log(user.data().users[1])
                return user
                
            }
        }).map((chat)=>(
            <Contact key={chat.id}>
               <Chat  id={chat.id} users={chat.data().users}></Chat>
               <Line/>
            </Contact>
            
            
        ))}
        
        <ToastContainer
            theme="dark"
            type="default"
            position='top-center'
            autoClose={5000}
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

export default Sidebar;
const Line=styled.hr`
  border: 0;
  clear:both;
  display:block;
  width: 80%;               
  background-color:#e6e3e3;
  height: 1px;
`;

const Contact=styled.div`
display: flex;
flex-direction:column;
font-size:calc(3px + 0.7vw);


`;
const Search=styled.div`
display: flex;

align-items: center;
padding:5px;
border-radius:2px;
height:60px;
background-color:#f1f2f6;
border-radius:5px;

`;

const SearchInput= styled.input`
outline-width:0;
border:none;
flex:1;
font-size:15px ;
margin-left:10px;
background-color:#f1f2f6;
min-width:10vh;
font-size:calc(3px + 0.5vw);
font-family: 'Roboto';

`;
const Id=styled.div`
font-size: 9px;
align-items:center;
justify-content:center;


`;
const Container = styled.div`
flex:0.45;
border-right: 1px solid whitesmoke;
height:100vh;
min-width: 130px;
max-width: 290px;
overflow-y: scroll;

::-webkit-scrollbar{
    display: none;
}
`;





const Header = styled.div`
display:flex;
position:sticky;
top:0;
background-color:white;
z-index: 1;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom: 1px solid whitesmoke;
`;

const UserAvatar= styled(Avatar)`
cursor:pointer;

:hover{
    opacity:0.8;
}
`;

const IconsContainer=styled.div``;

