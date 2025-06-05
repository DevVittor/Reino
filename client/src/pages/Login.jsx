import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { FaLongArrowAltRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [alterPassword, setAlterPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const sendData = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://reino.onrender.com/api/user/login",
        formData,
        {
          withCredentials: true,
        }
      );
      const token = response.data.token;
      if (token) {
        enqueueSnackbar(`${response.data.msg}`, {
          variant: "success",
        });
        localStorage.setItem("token", token);
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
        <h1 className="font-bold text-4xl text-white">Acessar Conta</h1>
        <p className="text-pretty text-center font-light md:w-3/4 leading-5 text-zinc-100">
          Coloque o seu email e senha e acessar ao painel de controle.
        </p>
      </div>
      <div className="border-none rounded-md p-3 bg-zinc-800">
        <form className="flex flex-col gap-2" action="" onSubmit={sendData}>
          <label className="flex flex-col gap-1.5" htmlFor="">
            <span className="font-medium text-zinc-100">Email:</span>
            <input
              className="px-3 py-1 bg-zinc-900 rounded-md border-none font-medium text-zinc-100 outline-none placeholder:text-zinc-500"
              type="email"
              name="email"
              required
              value={formData.email}
              placeholder="Seu Email"
              onChange={handleData}
            />
          </label>
          <label className="flex flex-col gap-1.5" htmlFor="">
            <span className="font-medium text-zinc-100">Senha:</span>
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
          <div className="">
            <Link
              className="text-red-500 hover:underline text-sm font-light"
              to="/esqueceu-a-senha"
            >
              Esquece a senha ?
            </Link>
          </div>
          <input
            className="font-bold bg-laranja px-3 py-1 rounded-md hover:cursor-pointer"
            type="submit"
            value="Acessar"
          />
        </form>
      </div>
      <div className="flex justify-center items-center flex-col md:gap-3 gap-1">
        <Link
          className="font-medium text-sm hover:underline flex justify-center items-center gap-1 text-zinc-300"
          to="/cadastrar"
        >
          <FaLongArrowAltRight />
          Ainda não tenho uma conta
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
