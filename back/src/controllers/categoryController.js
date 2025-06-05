import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import userModel from "../models/userModel.js";

/*export const listCategory = async (req, res) => {
  try {
    const allCategories = await categoryModel
      .find()
      .select("_id category subCategoryId");

    if (allCategories.length < 1) {
      return res.status(400).json({ error: "Não existe nenhuma categoria." });
    }

    for (const category of allCategories) {
      const validSubCategoryIds = [];

      for (const subId of category.subCategoryId) {
        const exists = await subCategoryModel.exists({ _id: subId });

        if (exists) {
          validSubCategoryIds.push(subId);
        } else {
          // Remove subcategoria inválida do usuário
          await userModel.updateMany(
            { subCategoryId: subId },
            { $pull: { subCategoryId: subId } }
          );
        }
      }

      // Se houver subcategorias inválidas, atualiza o documento da categoria
      if (validSubCategoryIds.length !== category.subCategoryId.length) {
        await categoryModel.updateOne(
          { _id: category._id },
          { $set: { subCategoryId: validSubCategoryIds } }
        );
        category.subCategoryId = validSubCategoryIds;
      }
    }

    return res
      .status(200)
      .json({ msg: "Aqui está todas categorias.", list: allCategories });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível mostrar as categorias.",
      details: error.message,
    });
  }
};*/

export const listCategory = async (req, res) => {
  try {
    const allCategorys = await categoryModel
      .find()
      .select("_id category subCategoryId");
    if (allCategorys.length < 1) {
      return res.status(400).json({ error: "Não existe nenhuma categoria." });
    }

    return res
      .status(200)
      .json({ msg: "Aqui está todas categorias.", list: allCategorys });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível mostrar as categorias.",
      details: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  const { adminId, productId, categoryId } = req.body;
  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }

    const [checkProduct, searchCategory] = await Promise.all([
      productModel.findById(productId),
      categoryModel.findById(categoryId),
    ]);

    if (!checkProduct) {
      return res.status(400).json({ error: "Produto não encontrado." });
    }
    if (!searchCategory) {
      return res.status(400).json({ error: "Categoria não encontrada." });
    }

    if (checkProduct.categoryId.includes(categoryId)) {
      return res
        .status(409)
        .json({ error: "Categoria já vinculada ao produto." });
    }

    if (checkProduct.categoryId.length >= 5) {
      return res
        .status(403)
        .json({ error: "Limite de 5 categorias por produto." });
    }

    await productModel.findByIdAndUpdate(
      productId,
      { $push: { categoryId: categoryId } },
      { new: true }
    );

    return res.status(201).json({ msg: "Categoria adicionada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao adicionar categoria.",
      details: error.message,
    });
  }
};

// Novo endpoint: Remover categoria do produto
export const removeCategory = async (req, res) => {
  const { adminId, productId, categoryId } = req.body;
  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Acesso não autorizado." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    if (!product.categoryId.includes(categoryId)) {
      return res
        .status(400)
        .json({ error: "Categoria não está vinculada ao produto." });
    }

    await productModel.findByIdAndUpdate(
      productId,
      { $pull: { categoryId: categoryId } },
      { new: true }
    );

    return res.status(200).json({ msg: "Categoria removida com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao remover categoria.",
      details: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  const { adminId, category, subCategoryIds } = req.body;
  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }
    const categoryDuplicate = await categoryModel.findOne({ category });
    if (categoryDuplicate) {
      return res
        .status(403)
        .json({ error: "Já tem uma categoria com esse nome." });
    }

    const subCategoriesExist = await subCategoryModel.find({
      _id: { $in: subCategoryIds },
    });
    if (subCategoriesExist.length !== subCategoryIds.length) {
      return res.status(400).json({
        error: "Não foi possível encontrar uma ou mais subCategorias",
      });
    }
    const newCategory = await categoryModel.create({
      adminId,
      category,
      subCategoryId: subCategoryIds,
    });

    await userModel.findByIdAndUpdate(
      adminId,
      {
        $push: { categoryId: newCategory._id },
      },
      { new: true }
    );

    return res.status(201).json({ msg: "Categoria criada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível criar uma categoria.",
      details: error.message,
    });
  }
};

export const addSubCategoryToCategory = async (req, res) => {
  const { adminId, categoryId, subCategoryId } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Apenas admins podem fazer isso." });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    if (category.subCategoryId.includes(subCategoryId)) {
      return res.status(409).json({ error: "Subcategoria já adicionada." });
    }

    category.subCategoryId.push(subCategoryId);
    await category.save();

    return res
      .status(200)
      .json({ msg: "Subcategoria adicionada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao adicionar subcategoria.",
      details: error.message,
    });
  }
};

export const removeSubCategoryFromCategory = async (req, res) => {
  const { adminId, categoryId, subCategoryId } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Apenas admins podem fazer isso." });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    category.subCategoryId = category.subCategoryId.filter(
      (id) => id.toString() !== subCategoryId
    );
    await category.save();

    return res.status(200).json({ msg: "Subcategoria removida com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao remover subcategoria.", details: error.message });
  }
};

export const renameCategory = async (req, res) => {
  try {
    const { adminId, categoryId, newName } = req.body;

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }

    if (!categoryId || !newName) {
      return res
        .status(400)
        .json({ error: "categoryId e newName são obrigatórios." });
    }

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    // Atualiza o nome da categoria
    category.category = newName;
    await category.save();

    return res.status(200).json({
      msg: "Categoria renomeada com sucesso.",
      updatedCategory: category,
    });
  } catch (error) {
    console.error("Erro ao renomear categoria:", error);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor.", details: error.message });
  }
};

export const removeCategorieFieldFromAllProducts = async (req, res) => {
  const { adminId } = req.body;

  try {
    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado. Apenas admins." });
    }

    const result = await productModel.updateMany(
      {},
      { $unset: { categorie: "" } }
    );

    console.log("Resultado do updateMany com $unset:", result);

    return res.status(200).json({
      msg: "O campo 'categorie' foi removido de todos os produtos.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Erro ao remover campo 'categorie':", error);
    return res.status(500).json({
      error: "Erro interno do servidor.",
      details: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { adminId, categoryId } = req.body;

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível continuar" });
    }
    // Verifica se a categoria existe
    const searchCategory = await categoryModel.findById(categoryId);
    if (!searchCategory) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar a categoria." });
    }

    // Remove a categoria de todos os produtos que a contenham
    await productModel.updateMany(
      { categoryId: categoryId },
      { $pull: { categoryId: categoryId } }
    );

    await userModel.findByIdAndUpdate(
      searchCategory._id,
      {
        $pull: { categoryId: categoryId },
      },
      { new: true }
    );

    // Deleta a categoria
    await categoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json({ msg: "Categoria deletada com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar categoria:", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor.", details: error.message });
  }
};
