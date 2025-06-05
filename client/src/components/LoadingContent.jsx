export default function LoadingContent() {
  return (
    <div className="flex justify-center items-center flex-col flex-1 gap-3">
      <div className="flex justify-center items-center">
        <h1 className="font-bold text-6xl">Carregando</h1>
      </div>
      <div className="flex justify-evenly w-[60px] mt-3">
        <div className="w-[12px] h-[12px] bg-zinc-800 rounded-full animate-bounce delay-0"></div>
        <div className="w-[12px] h-[12px] bg-zinc-800 rounded-full animate-bounce delay-[0.3s]"></div>
        <div className="w-[12px] h-[12px] bg-zinc-800 rounded-full animate-bounce delay-[0.6s]"></div>
      </div>
    </div>
  );
}
