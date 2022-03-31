import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js'
import { bounceInUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const myjsonData = require('./messages')

const styles = {
  bounceInUp: {
    animation: 'x 1s',
    animationName: Radium.keyframes(bounceInUp, 'bounceInUp')
  }
}

function App() {

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [clientInput, setClientInput] = useState("")


  const process_message = (msg_text) => {
    const understanding = {
      "gm texts": ["gm", "good morning", "gud morning", "god morning", "goodmorning", "gumorning", "morning", "morning luv", "good morning luv", "good morning mi amor", "morning mi amor", "hi mi amor"],
      "gn texts": ["gn", "good night", "gud night", "gud nite", "good nite", "good night mi amor", "gn mi amor", "gn luv", "goonight bb", "good night bb", "goodnight luv"],
      "i miss you": ["i miss you", "i miss u", "missing u", "missing you", "miss you", "i really miss you", ">.>", "miss miss you", "miss u"],
      "facts": ["tell me a fact", "fact check", "fact", "i wanna hear fact", "fact time"],
      "i love you": ['i wub u','i wub you', 'i lub u', 'i lub you', 'i lube u', 'i lube you a lot', 'i wub you a lot', 'i luv you', "i love you", "i really love you", "i love you to the stars and back", "i reaallly love you", "i lovee you more", "i love you like no other", "i love love you", "i love you so much", "ily", "i love you mi amor"],
      "horny": ["i'm horny", "i horny", "i am horny", "i need you", "i need it", "i want sex", "i want to fuck", " i wanna fuck", "im horny", 'i is horny', 'horny', 'honry', 'i is horny', 'fuck me', 'sex now', 'sex naow', 'must have seggs', 'me horny']
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const fuse = new Fuse()
    const keys = Object.keys(understanding)
    const grabbedUnderstandings = keys.map(key => {
      fuse.setCollection(understanding[key])
      const arr_data = fuse.search(msg_text.toLowerCase())
      return arr_data.length
    })

    const index_best_key = keys[grabbedUnderstandings.findIndex(val => val === Math.max(...grabbedUnderstandings))]

    console.log(index_best_key)


    return myjsonData[index_best_key][getRandomInt(myjsonData[index_best_key].length)]
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  const respond = async () => {
    if (messages.length > 0) {
      const last_msg = messages[messages.length-1]
      if (last_msg['id'] === 1) {
        setIsTyping(true)

        const response = await process_message(last_msg['text'])
        const messageObject = {
          id: 0,
          text: response
        }

        await timeout(3000);

        setIsTyping(false)
        setMessages([...messages, messageObject])
      }
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    respond()
  }, [messages]);

  useEffect(() => {
  }, [isTyping]);

  const addMessage = (e) => {
    e.preventDefault()

    const messageObject = {
      id: 1,
      text: clientInput
    }

    setClientInput("")
    setMessages([...messages, messageObject])
  }

  const mapConvo = () => {
    return messages.map((msg_obj, index) => {
      if (msg_obj['id'] === 0) {
        return (
          <StyleRoot key = {index}>
            <div className='owner_container' style={styles.bounceInUp}>
              <img src={"muizz.jpg"} className="avatarContainer_small"></img>
              <div className='message_bubble_owner'>
                <p className='message_text'>{msg_obj['text']}</p>
              </div>
           </div>
          </StyleRoot>
          )
      }
      return (
        <StyleRoot key = {index}>
          <div className='other_container' style={styles.bounceInUp}>
            <div className='message_bubble_other'>
              <p className='message_text'>{msg_obj['text']}</p>
            </div>
          </div>
        </StyleRoot>
      
      )
    })
  }

  return (
    <div className='mainContainer'>
      <div className='chatHeader'>
        <img src={"muizz.jpg"} className="avatarContainer"></img>
        <h2>Muizz</h2>
      </div>
      <div className='chatFeed'>
        {mapConvo()}
        {isTyping && (<div className='owner_container'><div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
</div></div>)}
      </div>
      <div className='input_container'>
        <input className = 'inputBox' type="text" value={clientInput} onChange={e => setClientInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMessage(e)}></input>
        <button className = 'inputButton' type="submit" onClick={e => addMessage(e)}>
          <img className="avatarContainer_tiny" src={'send.png'}></img>
        </button>
      </div>
    </div>
  );
}

export default App;
