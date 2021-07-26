/** @format */
import { Avatar, IconButton, TextField, Tooltip } from "@material-ui/core";
import { Chat } from "@material-ui/icons";
import * as EmailValidator from "email-validator";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import styles from "../styles/Home.module.css";
import Chats from "./Chats";
function SideBar() {
  const route = useRouter();
  const [user] = useAuthState(auth);
  const [search, setSearch] = useState("");

  const userChatRef = db
    .collection("Chats")
    .where("people", "array-contains", user.email);
  const [chatSnapshot, loadingChats] = useCollection(userChatRef);
  const onSignOut = (e) => {
    var x = window.confirm("Do you want to sign out?");
    if (x) {
      auth.signOut();
      route.push("/");
    }
  };

  const startNewChat = () => {
    const input = window.prompt(
      "Enter the email of person you want to chat with.."
    );
    if (!input) return null;
    if (EmailValidator.validate(input)) {
      if (input !== user.email) {
        if (chatAlreadyExists(input)) {
          alert("Chat already exists!!");
        } else {
          db.collection("Chats").add({
            people: [user.email, input],
          });
        }
      } else {
        alert("You cannot chat with yourself");
      }
    } else {
      alert("Email not valid");
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().people.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <Tooltip title={`Sign out as ${user.email}`} arrow>
          <Avatar
            className={styles.sidebarIcon}
            onClick={onSignOut}
            src={user.photoURL}
            alt=""
          />
        </Tooltip>
        <div className={styles.sidebarIcon}>
          <Tooltip title="Start a new Chat" arrow>
            <IconButton onClick={startNewChat}>
              <Chat />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={styles.sidebarInput}>
        <TextField
          className={styles.sidebarInputBlock}
          label="Search for Chat"
          placeholder="Enter Name"
          multiline
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </div>
      <div className={styles.sidebarChats}>
        {!loadingChats &&
          chatSnapshot?.docs
            .filter((data) => {
              if (search == null) return data;
              else if (data.data().people[1].toLowerCase().includes(search)) {
                return data;
              }
            })
            .map((chat) => (
              <Chats
                key={chat.id}
                id={chat.id}
                people={chat.data().people}
                user={user}
              />
            ))}
      </div>
    </div>
  );
}

export default SideBar;
