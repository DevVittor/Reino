import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { z } from "zod";
import { Types } from "mongoose";
const secret = process.env.JWT_SECRET;

export const listAdmin = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });

  const bodyValidation = bodySchema.safeParse(req.query);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { adminId } = bodyValidation.data;

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o usuário" });
    }

    const users = await userModel
      .find({ _id: { $ne: adminId } })
      .select(" _id username email role blocked ");

    if (users.length <= 0) {
      return res
        .status(400)
        .json({ error: "Não tem nenhum usuário no momento" });
    }

    return res
      .status(200)
      .json({ msg: "Aqui está todos os usuários", list: users });
  } catch (error) {
    console.error(
      `Não foi possível mostrar os usuários no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error:
        "Não foi possível mostrar os usuários no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  const bodySchema = z.object({
    username: z.coerce.string(),
    email: z.coerce.string().email(),
    password: z.coerce.string(),
  });

  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { username, email, password } = bodyValidation.data;

    console.log("Body: ", req.body);

    const emailDuplicate = await userModel.findOne({ email });
    if (emailDuplicate) {
      return res
        .status(403)
        .json({ error: "Não foi possível cadastrar o usuário" });
    }

    const limitUser = await userModel.countDocuments();
    if (limitUser > 2) {
      return res.status(409).json({ error: "Limite de usuários cadastrados" });
    }

    const createPasswordWithHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: createPasswordWithHash,
      role: "admin",
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });

    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: sevenDays,
      path: "/",
    };

    return res
      .status(201)
      .cookie("access_token", `Bearer ${token}`, cookieOptions)
      .json({ msg: "Usuário criado com sucesso!", token });
  } catch (error) {
    console.error(
      `Não foi possível cadastrar o usuário no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error:
        "Não foi possível cadastrar o usuário no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const bodySchema = z.object({
    email: z.coerce.string().email(),
    password: z.coerce.string(),
  });

  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { email, password } = bodyValidation.data;

    console.log("Body: ", req.body);

    const checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res.status(400).json({ error: "Não foi possível fazer login" });
    }

    const comparePasswordWithHash = await bcrypt.compare(
      password,
      checkEmail.password
    );
    if (!comparePasswordWithHash) {
      return res.status(403).json({ error: "Não foi possível fazer login" });
    }

    const payload = {
      _id: checkEmail._id,
      email: checkEmail.email,
      role: checkEmail.role,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });

    const sevenDays = 1000 * 60 * 60 * 24 * 7;

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: sevenDays,
      path: "/",
    };

    return res
      .status(201)
      .cookie("access_token", `Bearer ${token}`, cookieOptions)
      .json({ msg: "Acesso permitido", token });
  } catch (error) {
    console.error(
      `Não foi possível autentificar o usuário no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error:
        "Não foi possível autentificar o usuário no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};

export const alterEmail = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    newEmail: z.coerce.string().email(),
  });

  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { adminId, newEmail } = bodyValidation.data;

    const user = await userModel.findById(adminId);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o usuário" });
    }

    const emailExist = await userModel.findOne({ email: newEmail });

    if (emailExist) {
      return res
        .status(403)
        .json({ error: "Não foi possível alterar o email" });
    }

    await userModel.findByIdAndUpdate(adminId, { $set: { email: newEmail } });
    return res.status(200).json({ msg: "Email alterado" });
  } catch (error) {
    console.error(
      `Não foi possível alterar o email do usuário no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error:
        "Não foi possível alterar o email do usuário no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};

export const alterPassword = async (req, res) => {
  const bodySchema = z.object({
    email: z.coerce.string().email(),
    newPassword: z.coerce.string(),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  try {
    const { email, newPassword } = bodyValidation.data;
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o usuário" });
    }

    const equalPassword = await bcrypt.compare(newPassword, userExist.password);
    if (equalPassword) {
      return res.status(403).json({ error: "Você digitou a mesma senha." });
    }

    const createPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(userExist._id, {
      $set: { password: createPassword },
    });
    return res.status(200).json({ msg: "Senha alterada" });
  } catch (error) {
    console.error(
      `Não foi possível alterar a senha do usuário no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error:
        "Não foi possível alterar a senha do usuário no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });

  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  try {
    const { adminId } = bodyValidation.data;

    const isAdmin = await userModel.findById(adminId);
    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o usuário" });
    }

    await userModel.findByIdAndDelete(adminId);
    return res.status(200).json({ msg: "Usuário deletado" });
  } catch (error) {
    console.error(
      `Não foi possível deletar o usuário no momento. Tente mais tarde. \nError: ${error.message}`
    );
    return res.status(500).json({
      error: "Não foi possível deletar o usuário no momento. Tente mais tarde.",
      details: error.message,
    });
  }
};
