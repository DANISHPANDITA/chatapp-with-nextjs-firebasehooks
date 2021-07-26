/** @format */

import Circle from "better-react-spinkit/dist/Circle";
import Image from "next/image";
import { auth, provider } from "../firebase";
import logoImage from "../logo.png";
import styles from "../styles/Home.module.css";

function Login() {
  const onLoginClick = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  if (Object.keys(logoImage).length > 0) {
    return (
      <center className={styles.loginContainer}>
        <h2>Sign in with your google account</h2>
        <Image src={logoImage} alt="" />
        <button onClick={onLoginClick} className={styles.loginButton}>
          Sign in
        </button>
      </center>
    );
  } else {
    return (
      <center>
        <Circle size={150} />
      </center>
    );
  }
}

export default Login;
