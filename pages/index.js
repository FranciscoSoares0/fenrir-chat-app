
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import styled from "styled-components"
import AddCommentIcon from '@mui/icons-material/AddComment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


export default function Home() {
  return (
    <div>
      
      <Head>
        <title>Fenrir</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <StartContainer>
        <Sidebar />
        <TitleLogo>
          <Title>Fenrir</Title>
          <Logo src="./../wolf.png" height={200}
          style={{marginBottom:10}}></Logo>
          <Line/>
          <Instructions>
            <AddCommentIcon style={{ color: 'purple' }}/>
            <Description style={{"fontFamily":"Roboto"}}>Clique para começar uma nova conversa</Description>
          </Instructions>
          <Instructions>
            <ExitToAppIcon style={{ color: 'purple' }}/>
            <Description style={{"fontFamily":"Roboto"}}>Clique para sair da conta</Description>
          </Instructions>
          
        </TitleLogo>
        
      </StartContainer>
      
    </div>
  );
}

const Instructions=styled.div`
display:flex;
align-items:center;
justify-content:center;

`;
const StartContainer = styled.div`
display:flex;
align-items:center;



`;
const TitleLogo=styled.div`
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
align-content:center ;
width: 70%;
min-width:10vh;
@media (min-width: 300px) {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  align-content:center ;
  min-width:10vh;
  }

`;
const Logo=styled.img`
min-height: 40px;
min-width:40px;
`;
const Title=styled.h1`
font-family:'Sansita Swashed' ;
font-size:calc(80px + 0.3vw);


`;

const Line=styled.hr`
  border: 0;
  clear:both;
  display:block;
  width: 50%;               
  background-color:#e0dcdc;
  height: 1px;
`;

const Description=styled.h3`
margin-left:10px;
font-size: 16px;
`;