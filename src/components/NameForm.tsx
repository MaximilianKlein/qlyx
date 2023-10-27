import * as elements from "typed-html";

export const NameForm = () => {
  return (
    <form hx-post="/">
        <h3>Please enter your name</h3>
        <div class="relative mb-6" data-te-input-wrapper-init>
            <input type="text" name="name" class="peer block min-h-[auto] bg-[#EDEBE7] w-full rounded-lg border px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear" placeholder="Name" />
        </div>

        <div class="relative mb-6">
            <label for="country">Please choose your location</label>
            <select name="country" class="block w-full rounded-lg border bg-[#EDEBE7] px-3 py-2 leading-[2.15] outline-none transition-all duration-200 ease-linear">
                <option value="PT">🇵🇹 Lisbon</option>
                <option value="DE">🇩🇪 Hamburg</option>
                <option value="INT">🌍 International</option>
            </select>
        </div>

        <button style="background-color: #3b82f6; color: #ffffff; font-weight: bold; padding: 8px 16px; border-radius: 9999px; cursor: pointer; border: none; outline: none; transition: background-color 300ms ease-in-out;"
onmouseover="this.style.backgroundColor='#2b6cb0';" 
onmouseout="this.style.backgroundColor='#3b82f6';" type="submit" class="inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600">Continue</button>
    </form>
  );
}
