import axios from "axios";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Link, useLocation } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const [alterPassword, setAlterPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    setEmail(emailParam || "");
  }, [location]);

  function enviarNovaSenha(e) {
    e.preventDefault();

    const formData = {
      email: email,
      newPassword: senha,
    };

    axios
      .post(
        "hhttps://reino-animal.onrender.com/api/user/alter/password",
        formData
      )
      .then((res) => {
        enqueueSnackbar("Senha alterada com sucesso!", { variant: "success" });
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/acessar";
        }, 2000);
      })
      .catch((error) => {
        console.error("Erro ao alterar senha:", error.response?.data?.error);
        enqueueSnackbar(
          `${error.response?.data?.error || "Erro ao alterar senha"}`,
          {
            variant: "error",
          }
        );
      });
  }

  return (
    <section className="flex items-center justify-center flex-col gap-3 flex-grow bg-zinc-800 md:px-3 md:py-5 p-2">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-xl rounded-xl p-6 space-y-6 border border-zinc-200 dark:border-zinc-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-zinc-800 dark:text-white">
            🔒 Redefinir Senha
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Digite sua nova senha abaixo
          </p>
        </div>

        <form className="space-y-4" onSubmit={enviarNovaSenha}>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Seu Email:
            </label>
            <input
              type="email"
              required
              placeholder="Email cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-none rounded-lg shadow-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nova Senha:
            </label>
            <div className="flex items-center bg-zinc-700 pr-3 rounded-lg border border-zinc-600 ">
              <input
                type={`${alterPassword ? "text" : "password"}`}
                required
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border-none rounded-lg shadow-sm bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {alterPassword ? (
                <FaEye
                  className="text-zinc-100 hover:cursor-pointer ml-2"
                  onClick={() => setAlterPassword(!alterPassword)}
                />
              ) : (
                <FaEyeSlash
                  className="text-zinc-300 hover:cursor-pointer ml-2"
                  onClick={() => setAlterPassword(!alterPassword)}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Salvar Nova Senha
          </button>
        </form>
      </div>
      <div className="flex justify-center items-center">
        <Link
          className="font-medium text-base hover:underline flex justify-center items-center gap-1 text-zinc-300"
          to="/"
        >
          <IoIosHome />
          Voltar ao site
        </Link>
      </div>
    </section>
  );
}
