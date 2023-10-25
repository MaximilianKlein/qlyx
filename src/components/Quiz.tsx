import * as elements from "typed-html";
import { Timer } from "./Timer";
import { Question } from "../db/schema";

export const Quiz = ({question, questionIndex, remainingTimer, active, selectedAnswer, oob = true}:{question:Question, questionIndex:number, remainingTimer: number, active: boolean, selectedAnswer?: number, oob?: boolean}) => {
    return (
      <div id="quiz-container" hx-swap-oob={oob} class="max-w-2xl mx-auto bg-white p-6 rounded shadow-md" >
          <h2 class="text-xl font-bold mb-4">{question.question}</h2>

          <Timer remainingTimer={remainingTimer} oob={false} />

          <ul class="w-full space-y-4">
              {[question.answer1, question.answer2, question.answer3, question.answer4].map((option, index) => {
                  const isCorrect = question.correctAnswer - 1 === index;
                  const isSelected = selectedAnswer === index;
                  const isExpired = remainingTimer <= 0;
                  let labelClass = "block p-3 text-center rounded cursor-pointer border border-gray-300 hover:bg-blue-100";

                  if (isExpired) {
                      if (isCorrect) {
                          labelClass += " bg-green-200";
                      }
                      if (isSelected && !isCorrect) {
                          labelClass += " bg-red-200";
                      }
                      return (
                        <li>
                            <input 
                                  disabled={!active} 
                                  type="radio" 
                                  id={`option${index}`} 
                                  name="answer" 
                                  value={index.toString()} 
                                  hx-post="/quiz-content" 
                                  hx-vals={`{"questionIndex": "${questionIndex}"}`}
                                  class="hidden peer"
                                  checked={isSelected}
                              />
                            <label for={`option${index}`} class={labelClass}>
                                {option}
                            </label>
                        </li>
                    );
                  } else {
                      labelClass += " peer-checked:border-blue-600 peer-checked:bg-blue-100";
                      return <li>
                                <input 
                                        disabled={!active} 
                                        type="radio" 
                                        id={`option${index}`} 
                                        name="answer" 
                                        value={index.toString()} 
                                        hx-post="/quiz-content" 
                                        hx-vals={`{"questionIndex": "${questionIndex}"}`}
                                        class="hidden peer" 
                                    />
                                <label for={`option${index}`} class="block p-3 text-center rounded cursor-pointer border border-gray-300 hover:bg-blue-100 peer-checked:border-blue-600 peer-checked:bg-blue-100">
                                    {option}
                                </label>
                            </li>;
                  }

                  
              })}
          </ul>
      </div>
    );
}

//   export const Quiz = ({question, questionIndex, remainingTimer, active, oob = true}:{question:Question, questionIndex:number, remainingTimer: number, active: boolean, oob?: boolean}) => {
//     return (
//       <div id="quiz-container" hx-swap-oob={oob} class="max-w-2xl mx-auto bg-white p-6 rounded shadow-md" >
//           <h2 class="text-xl font-bold mb-4">{question.question}</h2>

//           <Timer remainingTimer={remainingTimer} oob={false} />

//           <ul class="w-full space-y-4">
//               {[question.answer1, question.answer2, question.answer3, question.answer4].map((option, index) => (
//                   <li>
//                       <input 
//                             disabled={!active} 
//                             type="radio" 
//                             id={`option${index}`} 
//                             name="answer" 
//                             value={index.toString()} 
//                             hx-post="/quiz-content" 
//                             hx-vals={`{"questionIndex": "${questionIndex}"}`}
//                             class="hidden peer" 
//                         />
//                       <label for={`option${index}`} class="block p-3 text-center rounded cursor-pointer border border-gray-300 hover:bg-blue-100 peer-checked:border-blue-600 peer-checked:bg-blue-100">
//                           {option}
//                       </label>
//                   </li>
//               ))}
//           </ul>
//       </div>
//     );
//   }
