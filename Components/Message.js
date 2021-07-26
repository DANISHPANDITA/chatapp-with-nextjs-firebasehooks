/** @format */
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactTimeago from "react-timeago";
import { auth, db } from "../firebase";
import styles from "../styles/Home.module.css";

function Message({ id, user, message }) {
  const router = useRouter();

  const [userLoggedIn] = useAuthState(auth);
  if (userLoggedIn.email === message.user) {
    return (
      <div className={styles.senderMessage}>
        <div className={styles.messageDetsSender}>
          <div className={styles.messageDetsSenderDets}>
            {message.message.includes(".jpg") ? (
              <img
                className={styles.MessageImage}
                src={message.message}
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <p className={styles.MessageSender}>{message.message}</p>
            )}

            <p className={styles.MessageTimestampSender}>
              <small>
                {message.timestamp ? (
                  <ReactTimeago date={message.timestamp} />
                ) : (
                  "..."
                )}
              </small>
            </p>
          </div>
          <IconButton
            className={styles.DeleteIcon}
            onClick={() => {
              db.collection("Chats")
                .doc(router.query.id)
                .collection("Messages")
                .doc(id)
                .delete()
                .then(() => {
                  alert("Document successfully deleted!");
                })
                .catch((error) => {
                  alert("Some error occurred");
                });
            }}>
            <Delete className={styles.DeleteIconButton} />
          </IconButton>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.recieverMessage}>
        <div className={styles.messageDetsReciever}>
          <div className={styles.messageDetsRecieverDets}>
            {message.message.includes(".jpg") ? (
              <img
                className={styles.MessageImage}
                src={message.message}
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <p className={styles.MessageReciever}>{message.message}</p>
            )}
            <p className={styles.MessageTimestampReciever}>
              <small>
                {message.timestamp ? (
                  <ReactTimeago date={message.timestamp} />
                ) : (
                  "..."
                )}
              </small>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
