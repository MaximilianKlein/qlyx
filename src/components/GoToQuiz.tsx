import * as elements from "typed-html";

export const GoToQuiz = ({userName}:{userName:string}) => {
  return (
    <div>you are logged in as {userName} go to <a href="/quiz">the quiz</a></div>
  );
}
