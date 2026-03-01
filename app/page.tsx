"use client";

import { useState } from "react";
import { kaomojis_list } from "./const";
import { Instagram, Music2, Youtube } from "lucide-react";
import { downloadVideo } from "./actions";

export default function Home() {
  const [selected, setSelected] = useState<"youtube" | "tiktok" | "instagram">("youtube");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para trocar de tab e limpar o input conforme pedido
  const handleTabChange = (tab: "youtube" | "tiktok" | "instagram") => {
    setSelected(tab);
    setUrl("");
  };

  const handleDownload = async () => {
    if (!url) return alert("Insira uma URL válida!");

    setLoading(true);
    try {
      const response = await downloadVideo(url, selected);

      if (response.success && response.downloadUrl) {
        window.open(response.downloadUrl, "_blank");
      } else {
        alert("Erro: " + (response.error || "Não foi possível obter o link."));
      }
    } catch (error) {
      console.error("Erro ao baixar:", error);
      alert("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const placeholders = {
    youtube: "https://www.youtube.com/watch?v=...",
    tiktok: "https://www.tiktok.com/@user/video/...",
    instagram: "https://www.instagram.com/reels/..."
  };

  const rows = [kaomojis_list.slice(0, 30), kaomojis_list.slice(30, 60), kaomojis_list.slice(40, 70), kaomojis_list.slice(60, 90), kaomojis_list.slice(90, 120), kaomojis_list.slice(120, 150), kaomojis_list.slice(0, 30), kaomojis_list.slice(30, 60), kaomojis_list.slice(60, 90), kaomojis_list.slice(90, 120), kaomojis_list.slice(120, 150), kaomojis_list.slice(0, 30)];

  return (
    <div className="flex flex-col h-screen py-8 items-center bg-zinc-50 font-sans overflow-x-hidden">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 90s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee 80s linear infinite reverse;
        }
      `}</style>

      {/* Background Animado */}
      <div className="absolute flex cursor-default z-0 text-3xl text-gray-300 gap-4 inset-0 flex-col justify-around py-10 overflow-hidden pointer-events-none">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={rowIndex % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"}>
            <div className="flex gap-4 px-4">
              {row.map((emoji, i) => (
                <p key={i}>{emoji}</p>
              ))}
              {row.map((emoji, i) => (
                <p key={`dup-${i}`}>{emoji}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <main className="  mx-auto mb-8">
        <img
          className="absolute"
          src="https://media.tenor.com/VmOouMXHqTsAAAAi/pom-pom-purin-pompompurin.gif"
        />
        <div className="flex items-center text-pink-300 p-4 rounded-lg h-70 backdrop-blur-xs z-50 relative bg-pink-300/10  font-semibold justify-center flex-col gap-2">
          <div className="border-2 flex items-center justify-center flex-col p-6 gap-2 rounded-lg border-pink-300 h-full">
            <p className="text-4xl">
              (˶˃ ᵕ ˂˶)
            </p>
            <h1 className="text-4xl font-[cursive]">
              Conversor de arquivos
            </h1>
          </div>
        </div>
      </main>

      <div className="rounded-xl flex z-50 mx-auto max-md:w-[90%] w-3xl">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholders[selected]}
          className="focus:ring-pink-100 w-full text-[#A59389] rounded-l-lg px-4 border border-[#A59389] ring-pink-200 bg-white py-4 text-xl"
        />
        <button
          onClick={handleDownload}
          className="h-full bg-pink-300 md:w-40 w-32 text-xl cursor-pointer rounded-r-lg"
        >
          {loading ? "..." : "Baixar"}
        </button>
      </div>

      <nav className="flex max-md:flex-col gap-8 items-center mt-12 justify-around w-[90%]">

        {/* YouTube */}

        <div

          onClick={() => handleTabChange("youtube")}

          className={`text-pink-300 border text-lg w-full p-6 rounded-lg backdrop-blur-xs z-50 relative text-center cursor-pointer flex flex-col items-center gap-2 transition-all ${selected === "youtube"

              ? "bg-pink-100 border-pink-400 scale-105 shadow-md"

              : "bg-white border-gray-300 hover:bg-pink-50"

            }`}

        >

          <Youtube size={32} />

          <div>

            <h3 className="font-bold">YouTube</h3>

            <p className="text-[#A59389] text-sm">Download de alta qualidade</p>

          </div>

        </div>



        {/* TikTok */}

        <div

          onClick={() => handleTabChange("tiktok")}

          className={`text-pink-300 border text-lg w-full p-6 rounded-lg backdrop-blur-xs z-50 relative text-center cursor-pointer flex flex-col items-center gap-2 transition-all ${selected === "tiktok"

              ? "bg-pink-100 border-pink-400 scale-105 shadow-md"

              : "bg-white border-gray-300 hover:bg-pink-50"

            }`}

        >

          <Music2 size={32} />

          <div>

            <h3 className="font-bold">TikTok</h3>

            <p className="text-[#A59389] text-sm">Vídeos sem marca d'água</p>

          </div>

        </div>



        {/* Instagram */}

        <div

          onClick={() => handleTabChange("instagram")}

          className={`text-pink-300 border text-lg w-full p-6 rounded-lg backdrop-blur-xs z-50 relative text-center cursor-pointer flex flex-col items-center gap-2 transition-all ${selected === "instagram"

              ? "bg-pink-100 border-pink-400 scale-105 shadow-md"

              : "bg-white border-gray-300 hover:bg-pink-50"

            }`}

        >

          <Instagram size={32} />

          <div>

            <h3 className="font-bold">Instagram</h3>

            <p className="text-[#A59389] text-sm">Reels e Stories</p>

          </div>

        </div>

      </nav>
    </div>
  );
}