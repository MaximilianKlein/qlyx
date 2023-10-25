import * as elements from "typed-html";
import { MainMenu } from "./menu/MainMenu";
import { Cart } from "./menu/Cart";

export const Header = () => {
  return (
    <div class="w-full bg-amber-300 flex flex-row justify-between items-center pl-6 pr-6">
        <MainMenu />
        <div><img src="/public/shop.png" width="56" style="mix-blend-mode: multiply;" /></div>
        <div hx-get="/cart" hx-trigger="load" />
    </div>
  );
}
