const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const app = require("../src/app");
const User = require("../src/models/User");

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const run = async () => {
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();

  await mongoose.connect(mongoUri);

  try {
    console.log("1) Health check");
    const healthRes = await request(app).get("/api/health");
    assert(healthRes.status === 200, "Health endpoint should return 200");

    console.log("2) Register user");
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "secret123",
    });
    assert(registerRes.status === 201, "Register should return 201");
    assert(registerRes.body.token, "Register should return token");

    const dbUser = await User.findOne({ email: "alice@example.com" });
    assert(dbUser, "User should exist in DB");
    assert(dbUser.passwordHash && dbUser.passwordHash !== "secret123", "Password must be hashed");

    console.log("3) Login user");
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "secret123",
    });
    assert(loginRes.status === 200, "Login should return 200");
    assert(loginRes.body.token, "Login should return token");
    const token = loginRes.body.token;

    console.log("4) Access /api/auth/me with token");
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    assert(meRes.status === 200, "/me should return 200 with token");
    assert(meRes.body.user.email === "alice@example.com", "/me should return current user");

    console.log("5) Protected route blocks without token");
    const noTokenRes = await request(app).get("/api/events");
    assert(noTokenRes.status === 401, "/api/events should return 401 without token");

    console.log("6) Create event with token");
    const createEventRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Team Meeting",
        eventDate: new Date().toISOString(),
        category: "Meeting",
        mode: "offline",
        venueAddress: "Smoke Test Venue",
      });
    assert(createEventRes.status === 201, "Create event should return 201");
    assert(createEventRes.body.event.owner, "Event should have owner");

    console.log("7) Ownership check between users");
    const registerBobRes = await request(app).post("/api/auth/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "secret123",
    });
    const bobToken = registerBobRes.body.token;
    const eventId = createEventRes.body.event._id;

    const bobGetEventRes = await request(app)
      .get(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${bobToken}`);
    assert(bobGetEventRes.status === 403, "Non-owner should not access another user's event");

    console.log("All API smoke tests passed.");
  } finally {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

run().catch((error) => {
  console.error("API smoke tests failed:", error.message);
  process.exit(1);
});
