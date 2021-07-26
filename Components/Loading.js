/** @format */
import Circle from "better-react-spinkit/dist/Circle";
import Image from "next/image";
import logoImage from "../logo.png";
import styles from "../styles/Home.module.css";
function Loading() {
  return (
    <center className={styles.Loading}>
      <Image src={logoImage} alt="" />
      <h2>Loading your Chats...</h2>
      <Circle size={150} color="rgb(114, 153, 158)" />
    </center>
  );
}

export default Loading;
