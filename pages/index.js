
import Head from 'next/head'
import Sidebar from '../components/Sidebar'


export default function Home() {
  return (
    <div>
      <Head>
        <title>Fenrir</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <Sidebar />
    </div>
  );
}
