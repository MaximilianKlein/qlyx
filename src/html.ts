import * as elements from "typed-html";

export const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qlyx</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css">
</head>
${children}
`;
