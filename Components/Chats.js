/** @format */
import { Avatar } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import ReactTimeago from "react-timeago";
import { db } from "../firebase";
import { getRecipient } from "../getReciepient";
import styles from "../styles/Home.module.css";

function Chats({ id, people, user }) {
  const router = useRouter();
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(Math.floor(Math.random() * 16777215).toString(16));
  }, []);
  const [recipientSnapshot] = useCollection(
    db
      .collection("Users")
      .where("email", "==", getRecipient(people, user.email))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const goToChatByID = () => {
    router.push(`/chat/${id}`);
  };
  return (
    <div className={styles.chat} onClick={goToChatByID}>
      <div className={styles.chatHeader}>
        {recipient ? (
          <Avatar
            className={styles.chatHeaderAvatar}
            src={recipient.photo}
            alt=""
          />
        ) : (
          <Avatar
            style={{ backgroundColor: `#${color}` }}
            className={styles.chatHeaderAvatar}>
            {getRecipient(people, user.email).slice(0, 1)}
          </Avatar>
        )}

        <p className={styles.chatRecipientName}>
          {getRecipient(people, user.email).slice(
            0,
            getRecipient(people, user.email).indexOf("@")
          )}
        </p>
      </div>
      <p>
        <b>
          <small>Last seen - </small>
        </b>
        <small>
          {recipient ? (
            <ReactTimeago
              date={new Date(recipient.lastSeen.toDate()).toUTCString()}
            />
          ) : (
            <span>Unavailable</span>
          )}
        </small>
      </p>
    </div>
  );
}

export default Chats;
