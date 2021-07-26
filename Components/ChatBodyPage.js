/** @format */

import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFileRounded,
  CloseRounded,
  MoodRounded,
} from "@material-ui/icons";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import firebase from "firebase";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../firebase";
import { getRecipient } from "../getReciepient";
import logoImage from "../logo.png";
import styles from "../styles/Home.module.css";
import Message from "./Message";

function ChatBodyPage({ chat, messages }) {
  const [file, setFile] = useState(null);
  const endOfComp = useRef(null);
  const [recipientData, setRecipientData] = useState("");
  const [recipient, setRecipient] = useState([]);
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const [AllUsers, setAllUsers] = useState([]);
  const [pickerState, setPickerState] = useState(false);
  const router = useRouter();
  const onEmojiClick = (emojiObject) => {
    setInput(input.concat(emojiObject.native));
  };
  const scrollToBottom = () => {
    if (endOfComp.current) {
      endOfComp.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // const [recipientSnapshot] = useCollection(
  //   db
  //     .collection("Users")
  //     .where("email", "==", getRecipient(chat?.people, user.email))
  // );
  // console.log(recipientSnapshot?.docs);
  // {
  //   recipient && console.log(recipient);
  // }
  useEffect(() => {
    db.collection("Users").onSnapshot((snapshot) =>
      setAllUsers(snapshot.docs.map((doc) => doc.data()))
    );
    db.collection("Chats")
      .doc(router.query.id)
      .get()
      .then((doc) => {
        setRecipientData(getRecipient(doc.data().people, user.email));
        setRecipient(AllUsers.filter((user) => user.email === recipientData));
      });
  }, [router.query.id, user, AllUsers, recipientData]);

  useEffect(() => scrollToBottom(), []);
  const [messagesSnapshot] = useCollection(
    db
      .collection("Chats")
      .doc(router.query.id)
      .collection("Messages")
      .orderBy("timestamp"),
    "desc"
  );
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.length > 0) {
      db.collection("Users").doc(user.uid).set(
        {
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      db.collection("Chats").doc(router.query.id).collection("Messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoPic: user.photoURL,
      });
      setInput("");
      scrollToBottom();
    } else {
      alert("Enter a message first");
    }
  };
  function buildPhotoSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", "image/jpg");
    return fileSelector;
  }

  const SelectFile = (e) => {
    e.preventDefault();
    const fileSelector = buildPhotoSelector();
    fileSelector.click();
    fileSelector.addEventListener("change", (event) => {
      const file = event.target.files[0];
      setFile(file);

      if (file) {
        const uploadTask = storage.ref(`media/${file.name}`).put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is " + progress + "% done");

            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log("Upload is running");
                break;
              default:
                console.log("..");
            }
          },
          (error) => {
            alert(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              db.collection("Users").doc(user.uid).set(
                {
                  lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
              db.collection("Chats")
                .doc(router.query.id)
                .collection("Messages")
                .add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  message: downloadURL,
                  user: user.email,
                  photoPic: user.photoURL,
                });
              setInput("");
              scrollToBottom();
            });
            setFile(null);
          }
        );
      }
    });
  };
  if (chat && messages && recipient.length > 0) {
    return (
      <div className={styles.ChatBodyPage}>
        <div className={styles.ChatBodyPageHeader}>
          <Avatar src={recipient[0]?.photo}></Avatar>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <h3 className={styles.chatRecipientName}>{recipient[0]?.name}</h3>
            <p className={styles.chatRecipientName}>
              <small>{recipient[0]?.email}</small>
            </p>
          </div>
        </div>
        <div className={styles.ChatBodyPageBody}>
          {messagesSnapshot
            ? messagesSnapshot.docs.map((message) => {
                return (
                  <Message
                    key={message.id}
                    id={message.id}
                    user={message.data().user}
                    message={{
                      ...message.data(),
                      timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                  />
                );
              })
            : JSON.parse(messages).map((message) => {
                return (
                  <Message
                    id={message.id}
                    key={message.id}
                    user={message.user}
                    message={message}
                  />
                );
              })}
          <div ref={endOfComp} />
        </div>
        <div className={styles.ChatBodyPageFooter}>
          <IconButton
            onClick={() => {
              setPickerState(true);
            }}>
            <MoodRounded />
          </IconButton>
          {pickerState && (
            <div className={styles.picker}>
              <Picker
                onClick={(e) => {
                  onEmojiClick(e);
                }}
              />
              <CloseRounded
                className={styles.pickerCancel}
                onClick={() => {
                  setPickerState(false);
                }}
              />
            </div>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your message"
          />
          <div className={styles.ChatBodyPageFooterOptions}>
            <IconButton onClick={SelectFile} style={{ marginRight: "0.8vw" }}>
              <AttachFileRounded />
            </IconButton>
            <button onClick={sendMessage} className={styles.sendMessageButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.ChatBodyPage}>
        <center style={{ marginTop: "15vh" }}>
          <Image src={logoImage} alt="" />
        </center>
      </div>
    );
  }
}

export default ChatBodyPage;
