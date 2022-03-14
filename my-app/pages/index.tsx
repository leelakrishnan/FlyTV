import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
// import { CenteredFooter } from "../components/footer/CenteredFooter";
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
