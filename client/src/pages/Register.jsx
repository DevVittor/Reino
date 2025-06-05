import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { IoIosHome } from "react-icons/io";
import { FaLongArrowAltRight, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const [alterPassword, setAlterPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const sendData = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://reino.onrender.com/api/user/register",
        formData,
        {
          withCredentials: true,
        }
      );
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        enqueueSnackbar(`${response.data.msg}`, {
          variant: "success",
        });
        setTimeout(() => {
          window.location.href = "/painel";
        }, 3000);
      }
    } catch (error) {
      enqueueSnackbar(`${error.response.data.error}`, {
        variant: "error",
      });
      console.error(error.message);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleData = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-1 justify-center items-center flex-col md:gap-5 gap-3 bg-escuro p-3">
      <div className="flex justify-center items-center flex-col gap-1">
        <h1 className="font-bold text-4xl text-zinc-100">Criar Conta</h1>
        <p className="text-pretty text-center text-zinc-300 font-light md:w-3/4 leading-5">
          Crie um email válido e uma senha forte.
        </p>
      </div>
      <div className="border-none rounded-md p-3 bg-zinc-800">
        <form className="flex flex-col gap-2" action="" onSubmit={sendData}>
          <label className="flex flex-col gap-1.5" htmlFor="">
            <span className="font-medium text-zinc-100">
              Nome: <b className="text-red-500">*</b>
            </span>
            <input
              className="px-3 py-1 bg-zinc-900 rounded-sm border-none font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
              type="text"
              name="username"
              required
              value={formData.username}
              placeholder="Seu Nome"
              onChange={handleData}
            />
          </label>
          <label className="flex flex-col gap-1.5" htmlFor="">
            <span className="font-medium text-zinc-100">
              Email: <b className="text-red-500">*</b>
            </span>
            <input
              className="px-3 py-1 bg-zinc-900 rounded-sm border-none font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
              type="email"
              name="email"
              required
              value={formData.email}
              placeholder="Seu Email"
              onChange={handleData}
            />
          </label>
          <label className="flex flex-col gap-1.5" htmlFor="">
            <span className="font-medium text-zinc-100">
              Senha: <b className="text-red-500">*</b>
            </span>
            <div className="flex items-center bg-zinc-900 pr-3 rounded-md">
              <input
                className="px-3 py-1 bg-zinc-900 rounded-sm border-none font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
                type={`${alterPassword ? "text" : "password"}`}
                name="password"
                required
                value={formData.password}
                placeholder="*****"
                onChange={handleData}
              />
              {alterPassword ? (
                <FaEye
                  className="text-zinc-300 hover:cursor-pointer"
                  onClick={() => setAlterPassword(!alterPassword)}
                />
              ) : (
                <FaEyeSlash
                  className="text-zinc-500 hover:cursor-pointer"
                  onClick={() => setAlterPassword(!alterPassword)}
                />
              )}
            </div>
          </label>
          <input
            className="font-bold bg-laranja px-3 py-1 rounded-md hover:cursor-pointer mt-1"
            type="submit"
            value="Cadastrar"
          />
        </form>
      </div>
      <div className="flex justify-center items-center flex-col md:gap-3 gap-1">
        <Link
          className=" font-medium text-sm hover:underline flex justify-center text-zinc-300 items-center gap-1"
          to="/acessar"
        >
          <FaLongArrowAltRight />
          Já tenho uma conta
        </Link>
        <Link
          className="font-medium text-sm hover:underline flex justify-center items-center gap-1 text-zinc-300"
          to="/"
        >
          <IoIosHome />
          voltar ao site
        </Link>
      </div>
    </div>
  );
}
