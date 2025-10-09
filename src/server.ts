
import express, { Request, Response } from "express";
const PORT = 3000;
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + Yarn!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
