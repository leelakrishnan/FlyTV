import Head from 'next/head';
import Nav from '../components/Nav';
import type { NextPage } from 'next';
import Profile from "../components/Profile";
import {useMoralis} from "react-moralis";

const MyProfile: NextPage = () => {
    const {user} = useMoralis();
    return (
        <>
            <Head>
                <title>Fly TV</title>
                <meta
                    name="description"
                    content="Home for hackathon"
                />
            </Head>
            <main>
                <Nav/>
                {user &&
                    <Profile/>
                }
                {/* <Footer /> */}
            </main>
        </>
    );
}
export default MyProfile;
