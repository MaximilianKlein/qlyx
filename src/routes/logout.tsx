export default (app: any) =>
  app.post("/", async ({ set }: any) => {
    set.headers["Set-Cookie"] = `userId=; HttpOnly;`;
    set.redirect = "/";
  });
