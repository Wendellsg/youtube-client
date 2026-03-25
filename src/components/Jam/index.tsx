import { useState } from "react";
import { useRouter } from "next/router";
import { useJam } from "@/hooks/useJam";
import { useColor } from "@/hooks/useColor";
import { MdArrowForward } from "react-icons/md";

export const Jam = () => {
  const router = useRouter();
  const { createRoom, joinRoom } = useJam();
  const { color } = useColor();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const roomId = await createRoom();
      router.push(`/room/${roomId}`);
    } catch {
      setError("Erro ao criar sala");
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinRoom(code);
      router.push(`/room/${code.trim().toUpperCase()}`);
    } catch {
      setError("Sala não encontrada");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/90 h-screen w-64 overflow-y-auto">
      <h2 className="text-white font-bold text-lg">Jam Session</h2>
      <p className="text-gray-400 text-sm">
        Crie uma sala e compartilhe o código para montar uma playlist junto com seus amigos.
      </p>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="py-2 px-4 rounded-md font-semibold text-sm text-white transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: `rgb(${color})` }}
      >
        {loading ? "Criando..." : "Criar sala"}
        {!loading && <MdArrowForward size={16} />}
      </button>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-600" />
        <span className="text-gray-500 text-xs">ou</span>
        <div className="h-px flex-1 bg-slate-600" />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          placeholder="Código da sala"
          maxLength={6}
          className="bg-slate-700 text-white rounded-md px-3 py-2 text-sm font-mono tracking-widest placeholder:text-gray-500 outline-none focus:ring-1"
          style={{ caretColor: `rgb(${color})` }}
        />
        <button
          onClick={handleJoin}
          disabled={loading || !code.trim()}
          className="py-2 px-4 rounded-md font-semibold text-sm transition-opacity disabled:opacity-50 text-white bg-slate-600 hover:bg-slate-500"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};
