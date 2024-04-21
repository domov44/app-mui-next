const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'ronanscotet467@gmail.com',
    pass: 'dubl fpze yuxh wbto'
  }
});

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: 'ronanscotet467@gmail.com',
      to: email,
      subject: 'Réinitialisation de mot de passe',
      text: `Bonjour,\n\nVous avez demandé une réinitialisation de mot de passe.\n Vous avez 15 minutes pour le faire via ce lien :\n\n${resetLink}\n\nCordialement, miamalo.com`
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe :", error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
