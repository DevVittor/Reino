import Logo from "../assets/logo.svg"; // se o SVG estiver correto

export default function Test() {
  return (
    <div className="flex gap-3  bg-[#3F2305]">
      <div className="fixed w-[350px] min-h-screen">
        <div className="flex flex-col justify-between items-center gap-10 p-5 min-h-screen bg-[#361500]">
          <div className="flex justify-center items-center flex-col gap-1 h-1/5 w-full text-center">
            <img src={Logo} alt="Logo" className="w-24 h-auto" />
            <h1 className="font-bold text-4xl text-[#FFE99A]">Reino Animal</h1>
          </div>
          <div className=" overflow-y-auto flex-grow w-full flex flex-col gap-3 justify-center items-center">
            <div className="w-full">
              <input
                className="px-3 py-2 rounded-xl w-full bg-[#3F2305] text-[#FFE99A] outline-none border-none font-medium"
                type="search"
                name=""
                id=""
                placeholder="Buscar produtos..."
              />
            </div>
            <div className="w-full overflow-y-auto">
              <ol className="flex flex-col gap-2 w-full">
                {Array.from({ length: 12 }).map((_, index) => (
                  <li
                    key={index}
                    className="text-[#FFE99A] bg-[#3F2305] flex-grow w-full px-3 py-1 rounded-full text-center"
                  >
                    Categoria {index + 1}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="py-2 px-5 bg-[#3F2305] max-h-[100px] rounded-xl w-auto flex justify-center items-center gap-2">
            <div className="">
              <img
                className="w-14 h-14 object-cover rounded-full border-2 border-[#361500]"
                src="https://images.pexels.com/photos/28206842/pexels-photo-28206842/free-photo-of-moda-tendencia-pessoa-mulher.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-zinc-100">
                Adriane Freitas
              </span>
              <span className="font-light text-xs text-zinc-300">Admin</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow  ml-[350px] grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            className="bg-[#361500] h-[250px] w-auto rounded-xl"
            key={index}
          ></div>
        ))}
      </div>
    </div>
  );
}
