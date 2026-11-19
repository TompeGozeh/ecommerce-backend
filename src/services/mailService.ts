import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
    await transporter.sendMail({
      from: '"ONLY BLACK" <no-reply@onlyblack.studio>',
      to,
      subject: '¡Bienvenido a ONLY BLACK!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #222;">
          <h2>Hola ${name}, bienvenido/a a ONLY BLACK</h2>
          <p>Tu cuenta ha sido creada exitosamente. Ya puedes explorar el catálogo y realizar tus pedidos.</p>
        </div>
      `,
    });
  } catch (error) {
    console.log('Aviso al enviar correo de bienvenida:', error);
  }
};

export const sendOrderConfirmationEmail = async (to: string, orderId: string, total: number) => {
  try {
    if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) return;
    await transporter.sendMail({
      from: '"ONLY BLACK" <no-reply@onlyblack.studio>',
      to,
      subject: 'Confirmación de Pedido - ONLY BLACK',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #222;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Hemos registrado tu pedido <strong>#${orderId}</strong> por un total de <strong>$${Number(total).toFixed(2)}</strong>.</p>
          <p>Puedes consultar el estado de tu orden en la sección "Mis Pedidos".</p>
        </div>
      `,
    });
  } catch (error) {
    console.log('Aviso al enviar correo de confirmación de orden:', error);
  }
};
