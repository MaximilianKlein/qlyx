import * as elements from "typed-html";

export const Timer = ({ remainingTimer, oob=true }: { remainingTimer: number, oob?: boolean }) => {
  return (
    <div id="timer-container" hx-swap-oob={oob} class="mb-4 text-right">
      { remainingTimer > 0
        ?   <span class="bg-blue-500 text-white p-2 rounded-full">
                Time left: <span id="countdown">{remainingTimer}s</span>
            </span>
        :   <span class="bg-red-500 text-white p-2 rounded-full">
                Time is over
            </span>}
    </div>
  );
};
