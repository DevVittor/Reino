import "dotenv/config";
import { z } from "zod";
import cloudinary from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { Types } from "mongoose";

const DEFAULT_IMAGE_URL =
  "http://res.cloudinary.com/dxkewdzsj/image/upload/v1741741382/products/jto1naum1sfvtwdppaut.webp";

// Configuração do Cloudinary (pode ser movida para um arquivo separado, se preferir)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Esquema de validação com Zod
const productSchema = z.object({
  adminId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Id inválido",
  }),
  product: z.string(),
  price: z.coerce.number(),
  store: z.string(),
  link: z.string(),
  categorie: z.array(z.string()),
});

export const allProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    if (products.length <= 0) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar nenhum produto" });
    }
    return res.status(200).json({
      msg: "Aqui estão os produtos encontrados",
      list: products,
    });
  } catch (error) {
    console.error(`Erro ao listar produtos: ${error.message}`);
    return res.status(500).json({
      error: "Não foi possível listar os produtos. Tente novamente mais tarde.",
      details: error.message,
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    const { search, store, categories, subcategories } = req.query;

    // Filtro inicial: produtos não bloqueados
    const filter = { blocked: false };

    // Filtro por nome do produto (busca textual, case insensitive)
    if (search) {
      filter.product = { $regex: search, $options: "i" };
    }

    // Filtro por loja
    if (store) {
      filter.store = store;
    }

    // Filtro por categoria (pode ser array ou string separada por vírgula)
    if (categories) {
      const categoryArray = Array.isArray(categories)
        ? categories
        : categories.split(",").filter(Boolean);
      if (categoryArray.length > 0) {
        filter.categoryId = { $in: categoryArray };
      }
    }

    // Filtro por subcategoria
    if (subcategories) {
      const subcategoryArray = Array.isArray(subcategories)
        ? subcategories
        : subcategories.split(",").filter(Boolean);
      if (subcategoryArray.length > 0) {
        filter.subCategoryId = { $in: subcategoryArray };
      }
    }

    // Log do filtro atual em modo dev (útil para depurar)
    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 Filtro aplicado:", JSON.stringify(filter, null, 2));
    }

    // Busca no banco com populates
    const products = await productModel
      .find(filter)
      .populate("categoryId", "category")
      .populate("subCategoryId", "subCategory")
      .lean(); // opcional: melhora performance se você não precisa de métodos mongoose

    // Retorno
    return res.status(200).json({
      msg:
        products.length > 0
          ? "Produtos encontrados"
          : "Nenhum produto encontrado com os filtros aplicados",
      list: products,
    });
  } catch (error) {
    console.error(`❌ Erro ao listar produtos: ${error.message}`);
    return res.status(500).json({
      error: "Erro interno ao buscar produtos",
      details: error.message,
    });
  }
};

export const myProductsUnlocks = async (req, res) => {
  const products = await productModel.find({ blocked: false });
  if (products.length <= 0) {
    return res
      .status(400)
      .json({ error: "Não foi possível mostrar localizar nenhum produto." });
  }

  return res
    .status(200)
    .json({ msg: "Aqui está todos os produtos", list: products });
};

export const featuredProducts = async (req, res) => {
  try {
    // Extrai o ID do produto da query
    const { adminId, productId } = req.query;
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Não foi possível prosseguir" });
    }
    // Busca o produto pelo ID
    const product = await productModel.findById(productId);

    // Verifica se o produto existe
    if (!product) {
      return res.status(404).json({
        error: "Produto não encontrado no banco de dados",
      });
    }

    // Verifica se o produto está bloqueado
    if (product.blocked) {
      return res.status(400).json({
        error: "Não é possível destacar um produto bloqueado",
      });
    }

    // Alterna o valor de featured (true -> false ou false -> true)
    const newFeaturedValue = !product.featured;
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { featured: newFeaturedValue } },
      { new: true } // Retorna o documento atualizado
    );

    // Retorna a mensagem de sucesso
    return res.status(200).json({
      msg: `O produto "${updatedProduct.product || "produto"}" agora está ${
        newFeaturedValue ? "destacado" : "não destacado"
      }`,
    });
  } catch (error) {
    console.error(`Erro ao marcar produtos como destacados: ${error.message}`);
    return res.status(500).json({
      error: "Não foi possível atualizar o status de destaque no momento",
      details: error.message,
    });
  }
};

export const listFeaturedProducts = async (req, res) => {
  try {
    const { search, store, categories } = req.query;

    let filter = { blocked: false, featured: true }; // Apenas produtos destacados

    if (search) {
      filter.product = { $regex: search, $options: "i" };
    }

    if (store) {
      filter.store = store;
    }

    if (categories) {
      const categoryArray = categories.split(",").filter(Boolean);
      if (categoryArray.length > 0) {
        filter.categorie = { $in: categoryArray };
      }
    }

    const products = await productModel.find(filter).limit(8); // Limite fixo de 8

    if (products.length <= 0) {
      return res
        .status(400)
        .json({ error: "Nenhum produto destacado encontrado" });
    }

    return res.status(200).json({
      msg: "Aqui estão os produtos destacados encontrados",
      list: products,
    });
  } catch (error) {
    console.error(`Erro ao listar produtos destacados: ${error.message}`);
    return res.status(500).json({
      error:
        "Não foi possível listar os produtos destacados. Tente novamente mais tarde.",
      details: error.message,
    });
  }
};

// Criar produto
export const createProduct = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    product: z.coerce.string(),
    price: z.coerce.number(),
    store: z.coerce.string(),
    link: z.coerce.string(),
    featured: z.coerce.boolean().optional().default(false),
    categoryId: z.array(
      z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Id de categoria inválido",
      })
    ),
  });

  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { adminId, product, price, store, link, categoryId, featured } =
      bodyValidation.data;
    const photos = req.files || [];

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Não foi possível prosseguir" });
    }

    const duplicateProduct = await productModel.findOne({
      product,
      store,
    });
    if (duplicateProduct) {
      return res.status(200).json({ msg: "Produto já existe" });
    }

    let photoUrls = [];
    if (photos.length > 0) {
      for (const photo of photos) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              { resource_type: "image", folder: "products" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(photo.buffer);
        });
        photoUrls.push(result.secure_url);
      }
    } else {
      photoUrls = [DEFAULT_IMAGE_URL];
    }

    const newProduct = await productModel.create({
      adminId,
      product,
      price,
      store,
      link,
      categoryId,
      featured,
      photos: photoUrls,
    });

    await userModel.updateOne(
      { _id: adminId },
      { $push: { productId: newProduct._id } }
    );

    return res.status(201).json({ msg: "Produto criado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar produto",
      details: error.message,
    });
  }
};

// Esquema de validação com Zod
const productUpdateSchema = z.object({
  adminId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Id do administrador inválido",
  }),
  productId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Id do produto inválido",
  }),
  product: z.string().min(1, "Nome do produto é obrigatório").optional(),
  price: z.coerce.number().positive("Preço deve ser positivo").optional(),
  store: z.string().min(1, "Nome da loja é obrigatório").optional(),
  link: z.string().url("Link inválido").optional(),
  photos: z.array(z.string().url("URL de foto inválida")).optional(),
  categoryId: z
    .array(
      z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "ID de categoria inválido",
      })
    )
    .max(5, "Máximo de 5 categorias")
    .optional(),
  subCategoryId: z
    .array(
      z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "ID de categoria inválido",
      })
    )
    .optional(),
});

export const updateProduct = async (req, res) => {
  const validation = productUpdateSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: validation.error.errors,
    });
  }

  try {
    const {
      adminId,
      productId,
      product,
      price,
      store,
      link,
      categoryId,
      subCategoryId,
    } = validation.data;

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const updatedData = {};
    if (product) updatedData.product = product;
    if (price) updatedData.price = price;
    if (store) updatedData.store = store;
    if (link) updatedData.link = link;
    if (categoryId) updatedData.categoryId = categoryId;
    if (subCategoryId) updatedData.subCategoryId = subCategoryId;

    // Se tem novas fotos enviadas:
    if (req.files && req.files.length > 0) {
      // Deletar as fotos antigas, exceto a foto padrão
      for (const oldPhotoUrl of existingProduct.photos) {
        if (
          oldPhotoUrl !==
          "http://res.cloudinary.com/dxkewdzsj/image/upload/v1741741382/products/jto1naum1sfvtwdppaut.webp"
        ) {
          const url = new URL(oldPhotoUrl);
          const path = url.pathname; // /dxkewdzsj/image/upload/v1741741382/products/abcdefg.jpg
          const parts = path.split("/");

          // Encontrar onde começa a pasta "products"
          const productsIndex = parts.findIndex((p) => p === "products");
          const publicIdParts = parts.slice(productsIndex);
          let publicId = publicIdParts.join("/");

          // Remove extensão .jpg, .png, .webp, etc.
          publicId = publicId.replace(/\.[^/.]+$/, "");

          // Deletar a imagem do Cloudinary
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload novas fotos para a pasta "products"
      const uploadedPhotos = [];
      for (const file of req.files) {
        const base64String = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64String}`;

        // Enviar a foto para o Cloudinary na pasta "products"
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "products",
          resource_type: "image",
          overwrite: true, // Garante que sobrescreve se necessário
        });

        uploadedPhotos.push(result.secure_url);
      }

      updatedData.photos = uploadedPhotos;
    }

    // Atualizar o produto no banco de dados
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json({
      msg: `Produto "${updatedProduct.product}" atualizado com sucesso!`,
      updatedProduct,
    });
  } catch (error) {
    console.error(`Erro ao atualizar produto: ${error.message}`);
    return res.status(500).json({
      error: "Erro ao atualizar o produto",
      details: error.message,
    });
  }
};

export const countProduct = async (req, res) => {
  try {
    //Buscando a quantidade de produtos Desbloqueados
    const countDocuments = await productModel.countDocuments({
      blocked: false,
    });
    //Retornando mensagem status ok e a quantidade de produtos desbloqueados
    return res.status(200).json({
      msg: "A quantidade de produtos",
      count: countDocuments,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível mostrar a quantidade de produtos",
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId, adminId } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Não foi possível prosseguir" });
    }

    const productExist = await productModel.findById(productId);
    if (!productExist) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o produto." });
    }
    // Remover imagens do Cloudinary
    for (const photoUrl of productExist.photos) {
      if (photoUrl === DEFAULT_IMAGE_URL) continue;

      try {
        const urlParts = photoUrl.split("/"); // separa a URL
        const fileName = urlParts[urlParts.length - 1]; // pega "mahnfhtz0ewemhbq2ftj.png"
        const publicId = "products/" + fileName.split(".")[0]; // remove a extensão

        await cloudinary.uploader.destroy(publicId);
        console.log(`Imagem ${publicId} removida com sucesso do Cloudinary.`);
      } catch (err) {
        console.error("Erro ao remover imagem do Cloudinary:", err.message);
      }
    }

    await userModel.findByIdAndUpdate(
      productExist.adminId,
      {
        $pull: { productId: productId },
      },
      { new: true }
    );
    await productModel.findByIdAndDelete(productId, { new: true });
    return res.status(200).json({ msg: "Produto deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível deletar esse produto.",
      details: error.message,
    });
  }
};
