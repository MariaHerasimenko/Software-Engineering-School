jest.mock("../src/utils/mailer", () => ({
  sendConfirmationEmail: jest.fn(() => Promise.resolve()),
}));
const { PrismaClient } = require("@prisma/client");
const {
  subscribe,
  confirm,
  unsubscribe,
} = require("../src/services/subscription.service");

const prisma = new PrismaClient();

describe("Subscription Service", () => {
  beforeEach(async () => {
    await prisma.subscription.deleteMany(); 
  });

  afterAll(async () => {
    await prisma.$disconnect(); 
  });

  describe("subscribe()", () => {
    it("should subscribe new user successfully", async () => {
      const email = `test${Date.now()}@example.com`;
      const result = await subscribe(email, "Kyiv", "daily");

      expect(result.status).toBe(200);
      expect(result.message).toMatch(/successful/i);

      const record = await prisma.subscription.findUnique({ where: { email } });
      expect(record).not.toBeNull();
      expect(record.confirmed).toBe(false);
    });

    it("should return 409 if email already subscribed", async () => {
      const email = `dupe${Date.now()}@example.com`;
      await subscribe(email, "Lviv", "hourly");

      const result = await subscribe(email, "Lviv", "hourly");
      expect(result.status).toBe(409);
      expect(result.message).toMatch(/already subscribed/i);
    });
  });

  describe("confirm()", () => {
    let token;

    beforeEach(async () => {
      const entry = await prisma.subscription.create({
        data: {
          email: `confirm${Date.now()}@example.com`,
          city: "Kharkiv",
          frequency: "daily",
          token: "jest-confirm-token",
          confirmed: false,
        },
      });
      token = entry.token;
    });

    it("should confirm subscription successfully", async () => {
      const result = await confirm(token);
      expect(result.status).toBe(200);

      const updated = await prisma.subscription.findUnique({ where: { token } });
      expect(updated.confirmed).toBe(true);
    });

    it("should return 400 if already confirmed", async () => {
      await confirm(token);
      const again = await confirm(token);
      expect(again.status).toBe(400);
    });

    it("should return 404 for unknown token", async () => {
      const result = await confirm("nonexistent-token");
      expect(result.status).toBe(404);
    });
  });

  describe("unsubscribe()", () => {
    let token;

    beforeEach(async () => {
      const entry = await prisma.subscription.create({
        data: {
          email: `unsub${Date.now()}@example.com`,
          city: "Odesa",
          frequency: "daily",
          token: "jest-unsub-token",
          confirmed: true,
        },
      });
      token = entry.token;
    });

    it("should delete subscription successfully", async () => {
      const result = await unsubscribe(token);
      expect(result.status).toBe(200);

      const deleted = await prisma.subscription.findUnique({ where: { token } });
      expect(deleted).toBeNull();
    });

    it("should return 404 for invalid token", async () => {
      const result = await unsubscribe("wrong-token");
      expect(result.status).toBe(404);
    });
  });
});
