import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando sembrado de datos para ONLY BLACK...');

  // 1. Crear usuario Administrador por defecto
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@onlyblack.com' },
    update: {},
    create: {
      email: 'admin@onlyblack.com',
      password: adminPassword,
      fullName: 'Studio Admin OB',
      role: 'ADMIN',
    },
  });

  // 2. Crear Categorías
  const catOversized = await prisma.category.upsert({
    where: { name: 'Oversized' },
    update: {},
    create: { name: 'Oversized' },
  });

  const catRegular = await prisma.category.upsert({
    where: { name: 'Regular Fit' },
    update: {},
    create: { name: 'Regular Fit' },
  });

  const catBuzos = await prisma.category.upsert({
    where: { name: 'Buzos 350g' },
    update: {},
    create: { name: 'Buzos 350g' },
  });

  // 3. Crear Prendas de ONLY BLACK
  const products = [
    {
      title: 'Camiseta Oversized Deus 250g',
      description: 'Algodon Peruano reactivo de 250g. Corte boxy fit con estampado en alta densidad. El color negro no mancha.',
      price: 38.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      categoryId: catOversized.id,
    },
    {
      title: 'Hoodie Heavyweight Buzo 350g',
      description: 'Buzo con capucha confeccionado en franela pesada de 350g. Negro profundo lavado tras lavado.',
      price: 65.00,
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      categoryId: catBuzos.id,
    },
    {
      title: 'Camiseta Tony Montana Drop',
      description: 'Edicion limitada en algodon de 230g. Fit relajado con grafico frontal vintage.',
      price: 42.00,
      stock: 4,
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      categoryId: catOversized.id,
    },
    {
      title: 'Camiseta Basica Sharp 200g',
      description: 'Corte regular esencial de 200g. Cuello acanalado reforzado y tejido suave al tacto.',
      price: 29.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      categoryId: catRegular.id,
    },
    {
      title: 'Camiseta Yourself Streetwear 250g',
      description: 'Silueta oversized urbana con caida estructurada y acabado antipilling.',
      price: 40.00,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
      categoryId: catOversized.id,
    },
    {
      title: 'Crewneck Minimal Black 350g',
      description: 'Sudadera sin capucha de alto gramaje (350g) con logo bordado tono sobre tono.',
      price: 58.00,
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800',
      categoryId: catBuzos.id,
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findFirst({
      where: { title: product.title },
    });
    if (!exists) {
      await prisma.product.create({ data: product });
    }
  }

  console.log('Catalogo de ONLY BLACK cargado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });