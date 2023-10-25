import * as elements from "typed-html";

export const NameForm = () => {
  return (
    <form
        hx-post="/">
        <h3>Please enter your name</h3>
        <input type="text" name="name" />
        <button type="submit"
            >Continue</button>
    </form>
  );
}
