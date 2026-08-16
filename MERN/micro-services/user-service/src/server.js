import { createApp } from "./app.js";

const PORT = process.env.PORT || 4002;
const app = createApp();

app.listen(PORT, () => {
  console.log(`user-service listening on http://localhost:${PORT}`);
});
