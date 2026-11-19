import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma';

async function createAdmin() {
  const email = 'admin@saasmarket.com';
  const password = 'admin123password';
  const fullName = 'Administrador Principal';

  const passwordHash = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      fullName,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('--------------------------------------------------');
  console.log('?Cuenta Administradora Creada / Actualizada!');
  console.log('Correo: ' + adminUser.email);
  console.log('Contrase?a: ' + password);
  console.log('Rol: ' + adminUser.role);
  console.log('--------------------------------------------------');
}

createAdmin()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
