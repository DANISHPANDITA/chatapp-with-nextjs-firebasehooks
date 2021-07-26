/** @format */
import ChatBodyPage from "../../Components/ChatBodyPage";
import SideBar from "../../Components/SideBar";
import { db } from "../../firebase";
import styles from "../../styles/Home.module.css";
function Chat({ chat, messages }) {
  return (
    <div className={styles.container}>
      <SideBar />
      <ChatBodyPage chat={chat} messages={messages} />
    </div>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("Chats").doc(context.query.id);
  const Messages = await ref
    .collection("Messages")
    .orderBy("timestamp", "asc")
    .get();
  const messages = Messages.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  const chatsResponse = await ref.get();
  const chat = {
    id: chatsResponse.id,
    ...chatsResponse.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
