import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");

function App() {

  //State for username and room
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    //Hamburger icon
    const hamburgerIcon = document.querySelector("#hamburgerBtn");
    const menu = document.querySelector("#menu");
    const modeSwitcher = document.querySelector("#modeSwitcher");
    const slider = document.querySelector(".slider");

    //Open Side Menu
    if (hamburgerIcon) {
      hamburgerIcon.addEventListener('click', () => {
        hamburgerIcon.classList.toggle('open');
        menu.classList.toggle('open');
      });
    }

    // Switch mode (Dark/Light)
    if (modeSwitcher && slider) {
      slider.addEventListener('click', () => {
        if (modeSwitcher.checked == false) {
          document.body.classList.add('light');
        } else {
          document.body.classList.remove('light');
        }
      });
    };

  });

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    };
  };


  return (
    <div className="App">
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join Chat</h3>
          <input type="text" placeholder="Name" onChange={(event) => { setUsername(event.target.value) }} />
          <input type="text" placeholder="Room ID" onChange={(event) => { setRoom(event.target.value) }} />
          <button onClick={joinRoom}>Join a Room</button>

          <div className="waveWrapper waveAnimation">
            <div className="waveWrapperInner bgTop">
              <div className="wave waveTop"></div>
            </div>
            <div className="waveWrapperInner bgMiddle">
              <div className="wave waveMiddle"></div>
            </div>
            <div className="waveWrapperInner bgBottom">
              <div className="wave waveBottom"></div>
            </div>
          </div>

        </div>

      )
        :
        (
          <div className='chatContainer'>
            <Chat socket={socket} username={username} room={room} />
          </div>
        )

      }

    </div>
  );
}

export default App;
