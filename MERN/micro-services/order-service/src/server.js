import { createApp } from "./app.js";

const PORT = process.env.PORT || 4003;
const app = createApp();

app.listen(PORT, () => {
  console.log(`order-service listening on http://localhost:${PORT}`);
  console.log(`  -> user-service:    ${process.env.USER_SERVICE_URL || "http://localhost:4002"}`);
  console.log(`  -> product-service: ${process.env.PRODUCT_SERVICE_URL || "http://localhost:4001"}`);
});
