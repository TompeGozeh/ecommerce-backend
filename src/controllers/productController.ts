import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// 1. Obtener todos los productos con filtros, búsqueda y paginación
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, minPrice, maxPrice, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      products,
      meta: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener productos.' });
  }
};

// 2. Obtener un producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

// 3. Crear Producto (Solo ADMIN)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, stock, imageUrl, categoryId } = req.body;

    if (!title || !description || price === undefined || stock === undefined || !imageUrl || !categoryId) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        categoryId,
      },
      include: { category: true },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el producto.' });
  }
};

// 4. Actualizar Producto (Solo ADMIN)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, imageUrl, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl,
        categoryId,
      },
      include: { category: true },
    });

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el producto.' });
  }
};

// 5. Eliminar Producto (Solo ADMIN)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({
      message: error?.message || 'Error al eliminar el producto.',
    });
  }
};

// 6. Crear Categoría
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });

    const category = await prisma.category.create({ data: { name } });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la categoría.' });
  }
};

// 7. Listar Categorías
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener categorías.' });
  }
};

// 8. Eliminar Categoría (Solo ADMIN)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar esta categoría porque tiene productos asociados. Elimina o reasigna los productos primero.',
      });
    }

    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Categoría eliminada correctamente.' });
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({
      message: error?.message || 'Error al eliminar la categoría.',
    });
  }
};
