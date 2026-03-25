import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usernameAtom } from "@/hooks/states";
import { SiDiscogs } from "react-icons/si";

const STORAGE_KEY = "msf_username";

export const UsernameGuard = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsername(saved);
    }
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    const name = input.trim();
    if (!name) return;
    localStorage.setItem(STORAGE_KEY, name);
    setUsername(name);
  };

  // Prevent flash before hydration
  if (!ready) return null;

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
          <SiDiscogs size={64} color="#ee82ee" />

          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold text-white">
              Musica Sem Firula
            </h1>
            <p className="text-gray-400 text-sm">
              Como devemos te chamar?
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Seu nome..."
              maxLength={30}
              autoFocus
              className="bg-slate-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-500 text-center text-lg font-semibold tracking-wide"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="py-3 rounded-lg font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
