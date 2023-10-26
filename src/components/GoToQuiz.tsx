import * as elements from "typed-html";

export const GoToQuiz = ({userName}:{userName:string}) => {
  return (
    <div style="font-size: 1.2em; padding: 10px; border-radius: 5px;">
        You are logged in as <strong>{userName}</strong> 🎉. Ready for some fun? 
        <a href="/quiz" style="color: #2D9CDB; text-decoration: underline; font-weight: bold;">Take the quiz now!</a> 🧠
    </div>

  );
}
