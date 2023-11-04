import * as elements from "typed-html";

export const Logout = () => (
  <form action="/logout" method="post">
    <button
      style="background-color: #aaa; color: #ffffff; font-weight: bold; padding: 8px 16px; border-radius: 9999px; cursor: pointer; border: none; outline: none; transition: background-color 300ms ease-in-out;"
      onmouseover="this.style.backgroundColor='#bbb';"
      onmouseout="this.style.backgroundColor='#aaa';"
      type="submit"
      class="inline-block rounded bg-secondary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-secondary-600"
    >
      Logout
    </button>
  </form>
);
