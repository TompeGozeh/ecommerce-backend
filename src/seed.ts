import { prisma } from './config/prisma';

async function main() {
  console.log('Insertando datos de prueba...');

  // 1. Crear Categorías
  const catSoftware = await prisma.category.upsert({
    where: { name: 'SaaS Software' },
    update: {},
    create: { name: 'SaaS Software' },
  });

  const catDesign = await prisma.category.upsert({
    where: { name: 'Plantillas & Diseño' },
    update: {},
    create: { name: 'Plantillas & Diseño' },
  });

  // 2. Crear Productos
  await prisma.product.createMany({
    data: [
      {
        title: 'CRM SaaS Dashboard PRO',
        description: 'Licencia anual de CRM avanzado para gestión de leads y ventas con soporte multiusuario.',
        price: 199.99,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        categoryId: catSoftware.id,
      },
      {
        title: 'Kit UI Glassmorphism Figma',
        description: 'Más de 500 componentes UI para diseñadores web en formato Figma y React Tailwind.',
        price: 49.50,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600',
        categoryId: catDesign.id,
      },
      {
        title: 'API Gateway Security Suite',
        description: 'Módulo de microservicios para autenticación OAuth2 y rate-limiting de alto rendimiento.',
        price: 299.00,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        categoryId: catSoftware.id,
      },
    ],
  });

  console.log('¡Productos iniciales creados exitosamente!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
