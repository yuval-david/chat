import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room, userColor }) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    //Check time function (add 0 if it's 1 digit)
    const checkTime = (timeVariable) => {
        if (timeVariable.toString().length < 2) {
            timeVariable = "0" + timeVariable;
        }
        return timeVariable;
    }

    // Wait message to be sent in order to move forward
    const sendMessage = async () => {
        if (currentMessage !== "") {
            let hours = new Date(Date.now()).getHours();
            let mins = new Date(Date.now()).getMinutes();
            mins = checkTime(mins);
            hours = checkTime(hours);

            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: hours + ":" + mins,
                color: userColor
            }

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }


    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    // Leave Room Function
    const leaveRoom = async () => {
        const messageData = {
            room: room,
            author: "",
            message: `${username} leave room ${room}`,
            time: "",
            color: userColor
        }

        await socket.emit("send_message", messageData);
        await setMessageList((list) => [...list, messageData]);
        socket.disconnect(room);
        console.log(socket);
        console.log("leave room");
        window.location.reload();
    }

    // Clear Chat History Function
    const clearHistory = () => {
        setMessageList([]);
        console.log("Clear history");
    }

    return (
        <div>
            <div className='header-chat'>
                <div className='user-circle'>{username}</div>
                <div id="hamburgerBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className='menu' id="menu">
                    <div className='items-container'>
                        <button onClick={clearHistory} className='menu-item'>Clear chat history</button>
                        <button onClick={leaveRoom} className='menu-item'>Leave room</button>
                    </div>
                    <div className='menu-item view-mode'>
                        <div className='toggle-switch'>
                            <label>
                                <input type='checkbox' id="modeSwitcher" />
                                <span className='slider'></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='chat-component'>
                <div className='chat-header'>
                    <p>Live Chat | Room ID: {room}</p>
                </div>
                <div className='chat-body'>
                    <ScrollToBottom className='messages-window'>
                        {messageList.map((messageContent, index) => {
                            return (
                                <div key={index} className={username === messageContent.author ? "you" : "other"}>
                                    <p className='author'>{messageContent.author}</p>
                                    <div className={"message " + userColor}>
                                        <div>
                                            <div className='message-content' style={{ "backgroundColor": userColor }}>
                                                <p>{messageContent.message}</p>
                                            </div>
                                            <div className='message-time'>
                                                <p className='time'>{messageContent.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })}
                    </ScrollToBottom>
                </div>
                <div className='chat-footer'>
                    <input
                        type="text"
                        placeholder='Hey...'
                        value={currentMessage}
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>›</button>
                </div>
            </div>

        </div>
    )
}

export default Chat