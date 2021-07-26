/** @format */

import ChatBodyPage from "../Components/ChatBodyPage";
import SideBar from "../Components/SideBar";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <SideBar />
      <ChatBodyPage />
    </div>
  );
}
