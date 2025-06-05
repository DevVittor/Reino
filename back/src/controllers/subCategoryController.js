import { Types } from "mongoose";
import subCategoryModel from "../models/subCategoryModel.js";
import userModel from "../models/userModel.js";
import { z } from "zod";
import productModel from "../models/productModel.js";

export const listSubCategory = async (req, res) => {
  try {
    const searchSubCategory = await subCategoryModel
      .find()
      .select("_id subCategory categoryId");
    if (!searchSubCategory) {
      return res
        .status(400)
        .json({ error: "Não tem nenhuma subCategoria cadastrada" });
    }
    return res
      .status(200)
      .json({ msg: "Lista das subCategorias", list: searchSubCategory });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível localizar as subCategorias",
      details: error.message,
    });
  }
};

export const createSubCategory = async (req, res) => {
  const { adminId, subCategory } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }

    const subCategoryDuplicate = await subCategoryModel.findOne({
      subCategory,
    });
    if (subCategoryDuplicate) {
      return res
        .status(403)
        .json({ error: "Já tem uma categoria com esse nome" });
    }

    const newSubCategory = await subCategoryModel.create({
      adminId,
      subCategory,
    });
    await userModel.findByIdAndUpdate(
      adminId,
      {
        $push: { subCategoryId: newSubCategory._id },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "SubCategoria criada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível criar a subCategoria.",
      details: error.message,
    });
  }
};
// Novo endpoint: Adicionar subcategoria ao produto
export const addSubcategory = async (req, res) => {
  const { adminId, productId, subCategoryId } = req.body;

  try {
    // 1. Verificar se o usuário é admin
    const admin = await userModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        error:
          "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }

    // 2. Verificar se o produto existe
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: "Produto não encontrado.",
        productId,
      });
    }

    // 3. Verificar se a subcategoria existe
    const subcategory = await subCategoryModel.findById(subCategoryId);
    if (!subcategory) {
      return res.status(404).json({
        error: "Subcategoria não encontrada.",
        subCategoryId,
      });
    }

    // 4. Verificar se já está vinculada
    if (product.subCategoryId.includes(subCategoryId)) {
      return res.status(409).json({
        error: "Esta subcategoria já está vinculada ao produto.",
      });
    }

    // 5. Adicionar a subcategoria
    product.subCategoryId.push(subCategoryId);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Subcategoria adicionada com sucesso!",
      product: {
        id: product._id,
        name: product.product,
        subCategories: product.subCategoryId,
      },
    });
  } catch (error) {
    console.error("Erro ao adicionar subcategoria:", error);
    return res.status(500).json({
      error: "Erro interno ao processar a solicitação",
      details: error.message,
    });
  }
};

// Novo endpoint: Remover subcategoria do produto
export const removeSubcategory = async (req, res) => {
  const { adminId, productId, subCategoryId } = req.body;
  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Acesso não autorizado." });
    }

    const subCategoryExist = await subCategoryModel.findById(subCategoryId);
    if (!subCategoryExist) {
      return res
        .status(404)
        .json({ error: "Não localizamos essa subcategoria." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    if (!product.subCategoryId.includes(subCategoryId)) {
      return res
        .status(400)
        .json({ error: "Subcategoria não está vinculada ao produto." });
    }

    await productModel.findByIdAndUpdate(
      productId,
      { $pull: { subCategoryId: subCategoryId } },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      subCategoryExist.adminId,
      {
        $pull: { subCategoryId: subCategoryId },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "Subcategoria removida com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao remover subcategoria.",
      details: error.message,
    });
  }
};

export const alterSubCategory = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    subCategoryId: z.coerce
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Id inválido",
      }),
    newSubCategory: z.coerce.string(),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;

  try {
    const isAdmin = await userModel.findById(data.adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }
    const subCategoryExist = await subCategoryModel.findById(
      data.subCategoryId
    );
    if (!subCategoryExist) {
      return res.status(400).json({ error: "Essa subCategoria não existe." });
    }
    const subCategoryDuplicate = await subCategoryModel.findOne({
      subCategory: data.newSubCategory,
    });
    if (subCategoryDuplicate) {
      return res.status(400).json({ error: "Essa subCategoria já existe" });
    }
    const alterSubcategory = await subCategoryModel.findByIdAndUpdate(
      data.subCategoryId,
      {
        $set: { subCategory: data.newSubCategory },
      },
      { new: true }
    );
    return res.status(201).json({
      msg: "SubCategoria alterada com sucesso!",
      result: alterSubcategory,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível alterar a subCategoria.",
      details: error.message,
    });
  }
};
export const deleteSubCategory = async (req, res) => {
  const { adminId, subCategoryId } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }
    const subCategoryExist = await subCategoryModel.findById(subCategoryId);
    if (!subCategoryExist) {
      return res.status(400).json({ error: "Essa subCategoria não existe." });
    }
    await userModel.findByIdAndUpdate(
      subCategoryExist.adminId,
      {
        $pull: { subCategoryId: subCategoryId },
      },
      { new: true }
    );
    await subCategoryModel.findByIdAndDelete(subCategoryId);
    return res.status(200).json({ msg: "Sub Categoria deletada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível alterar a subCategoria.",
      details: error.message,
    });
  }
};
