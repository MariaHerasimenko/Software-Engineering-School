const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const { sendConfirmationEmail } = require("../utils/mailer");

const prisma = new PrismaClient();

exports.subscribe = async (email, city, frequency) => {
  const exists = await prisma.subscription.findUnique({ where: { email } });
  if (exists) {
    return { status: 409, message: "Email already subscribed" };
  }

  const token = uuidv4();

  await prisma.subscription.create({
    data: {
      email,
      city,
      frequency,
      token,
      confirmed: false,
    },
  });

  try {
    await sendConfirmationEmail(email, token); 
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return { status: 500, message: "Subscription saved, but failed to send email" };
  }

  return { status: 200, message: "Subscription successful. Confirmation email sent." };
};

exports.confirm = async (token) => {
    const sub = await prisma.subscription.findUnique({ where: { token } });
  
    if (!sub) {
      return { status: 404, message: "Token not found" };
    }
  
    if (sub.confirmed) {
      return { status: 400, message: "Subscription already confirmed" };
    }
  
    await prisma.subscription.update({
      where: { token },
      data: { confirmed: true },
    });
  
    return { status: 200, message: "Subscription confirmed successfully" };
  };
  
  exports.unsubscribe = async (token) => {
    const sub = await prisma.subscription.findUnique({ where: { token } });
  
    if (!sub) {
      return { status: 404, message: "Token not found" };
    }
  
    await prisma.subscription.delete({ where: { token } });
  
    return { status: 200, message: "Unsubscribed successfully" };
  };
  