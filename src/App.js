import './App.css';
import React, { useRef, useState } from 'react';

//FireBase imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

// SignIn
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

//importing inbuild firebase-hook -> that will be used fir getting user from Google/ Sign-in
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Firebase App Initialization
firebase.initializeApp({
  apiKey: "AIzaSyAPfBigNZhSHDgBmu7wkTJsy5mZ4B_34Kc",
  authDomain: "chat-app-highthackers.firebaseapp.com",
  projectId: "chat-app-highthackers",
  storageBucket: "chat-app-highthackers.appspot.com",
  messagingSenderId: "316159968996",
  appId: "1:316159968996:web:066c493d3843dedc978ef1",
  measurementId: "G-W18G9SF1WT",
  databaseURL: "https:/chat-app-minorp.firebaseio.com",
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  // What this Component will do
  // We write here javaScript { varibales and functions }

  const [user] = useAuthState(auth);    // This parth will give information about the users sign-in's i.e, This will inform that whether somebody has signed it or not

  // Defining a Hook - React Hooks

  return (
    // Design Part
    <div className="App">
      <header>
        <h1> Aao baatein karein 😶‍🌫️👻 </h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const SignInWithGoogle = () => {
    const Provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(Provider);
  }

  return (
    <div>
      <button className="sign-in" onClick={SignInWithGoogle}>
        Sign In With Google
      </button>
      <p>
        {`Let's Connect -> talk and grow Together. #WeWill Rock`}
      </p>
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <div>
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    </div>
  );
}

function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setFormValue('');
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(event) => setFormValue(event.target.value)} />
        <button type="submit" disabled={!formValue}>
          Bhej de
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // I will be defininf the class.. sent or received
  // And the According to sent or received .. I can use the CSS to align the Chats in the Right or LEft Side of the ChatRoom or the Final Chatting Aplication

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img alt="user" src={photoURL}></img>
      <p>{text}</p>
    </div>
  );
}

export default App;