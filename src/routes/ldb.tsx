import * as elements from "typed-html";
import { BaseHtml } from "../html";
import { getUserHash, getUserLocation, getUserName } from "../user";
import { adminPassword, protectLeaderboard } from "../config";
import { getLeaderboard } from "../db/dbClient";

const getTrophies = (place:number) => {
    if (place === 1) {
        return '🏆';
    } else if (place === 2) {
        return '🥈';
    } else if (place === 3) {
        return '🥉';
    }
    return '';
}

const getFlag = (country:string) => {
    if (country === 'DE') {
        return '🇩🇪';
    } else if (country === 'PT') {
        return '🇵🇹';
    }
    return '🌎';
}

const LeaderboardEntry = (entry:{userId: string, correctAnswers: number, place:number, answers: number}) => <div class="min-w-lg max-w-2xl mx-auto bg-white p-6 rounded shadow-md flex justify-between items-center">
        <span><b><span style="display: inline-block; min-width: 15px">{getTrophies(entry.place)}</span> {entry.place}. {getUserName(entry.userId)}</b> ({getFlag(getUserLocation(entry.userId))}) <small><i class="color-gray"> – {getUserHash(entry.userId)}</i></small></span><span>{entry.correctAnswers ?? 0}/{entry.answers ?? 0}&nbsp; ☑️</span>
    </div>

export default (app: any) => app
  .get('/', async ({ cookie, set }:any) => {
    if (protectLeaderboard() && cookie.admpwd !== adminPassword()) {
        set.status = 401;
        return <div>You are not allowed here, go away!</div>
    }
    const leaderboard = await getLeaderboard();
    
    return (
      <BaseHtml>
        <body>
          <div class="pb-20">
              <div class="h-40">
              </div>
              <div class="w-full flex justify-center flex-col">
                <div class="min-w-lg max-w-2xl mx-auto bg-white p-6 rounded flex justify-between items-center">
                    <span class="text-xl font-bold">Leaderboard</span>
                </div>
              {leaderboard.map((entry, idx) => (
                    <LeaderboardEntry userId={entry.userId} correctAnswers={entry.correctAnswers} answers={entry.answers} place={idx + 1} />
                ))}
              </div>
          </div>
        </body>
      </BaseHtml>
    );
  });
