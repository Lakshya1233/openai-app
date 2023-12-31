import { ClassNames } from '@emotion/react'
import { useState,useEffect } from 'react'
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";
import axios from "axios";

 /* let arr=[
    {type:"user",post:"fasdds"},
    {type:"bot", post:"fhjshsh"}
  ]
*/
function App() {
  const [input,setInput]=useState("");
  const[posts,setPosts]=useState([]);

  useEffect(()=>{
    document.querySelector(".layout").scrollTop=document.querySelector(".layout").scrollHeight
  },[posts])
  const fetchBotResponse=async()=>{
    const{data}=await axios.post("https://chatgpt-openai-app.onrender.com",{
      input:input},
      {headers:{
        "Content-Type":"application/json",
      },
    });
    return data;
  }
  const onSubmit=()=>{
    if(input.trim()==="") return;
    updatePosts(input);
    updatePosts("loading...",false,true);
    setInput("");
    
    fetchBotResponse().then((res)=>{
      console.log(res);
      updatePosts(res.bot.trim(),true);
    });


  }
  const autoTypingBotResponse = (text)=>{
    let index=0;
    let interval=setInterval(()=>{
if(index < text.length){
  setPosts((prevState)=>{
    let lastItem=prevState.pop();
    if(lastItem.type !== "bot"){
        prevState.push({
          type:"bot",
          post:text.charAt(index-1)
        
      }  );
    }
    else{
      prevState.push({
        type:"bot",
        post: lastItem.post + text.charAt(index-1)
      
    });

    }
    return [...prevState];
  });
  index++;
}
else{
  clearInterval(interval);
}
    },20);

  };
  const updatePosts=(post,isBot,isLoading)=>{
    if(isBot){
      autoTypingBotResponse(post);

    }
    else{
    setPosts(prevState=>{
      return [
        ...prevState,
        {type:isLoading ? "loading":"user",post:post}
      ]
    })
  }
  }
  const onKeyup=(e)=>{
    if(e.key==="Enter" || e.which===13){
      onSubmit();
    }

    
  }
  return <main className="chatGpt-app">
    <section className="chat-container">
        <div className="layout">

          {posts.map((post,index)=>(
          <div 
          key={index}
          className={`chat-bubble ${post.type==="bot" || post.type==="loading" ? "bot":""}`} >
            <div className="avatar">
              <img src={post.type==="bot" || post.type==="loading" ? bot:user } />
            </div>
            {post.type==="loading" ? (<div className="loader">
              <img src={loadingIcon}></img>
            </div>):(
               <div className="post">{post.post}</div>
              
            )
            }
            
           </div>
          ))}
          
        </div>
        
    </section>
    <footer>
      <input 
      value={input}
      className="composebar"
      autoFocus
      type="text"
      placeholder="Ask anything"
      onChange={(e)=>setInput(e.target.value)}
      onKeyUp={onKeyup}
      />

      <div className="send-button" onClick={onSubmit}>
        <img src={send}></img>
      </div>
    </footer>
  </main>
   


  
    
    
}  
      
  


export default App
