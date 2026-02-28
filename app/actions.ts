"use server";

// Importa a lib
const btch = require('btch-downloader');

export async function downloadVideo(url: string, type: "youtube" | "tiktok" | "instagram") {
  try {
    // LOG DE INSPEÇÃO: Isso vai aparecer no seu terminal do VS Code/Prompt
    // Serve para vermos exatamente quais nomes a lib está usando
    console.log("Conteúdo da lib btch:", Object.keys(btch));

    let result;

    if (type === "youtube") {
      // Tenta .youtube ou .yt
      const ytFunc = btch.youtube || btch.yt;
      result = await ytFunc(url);
    } 
    else if (type === "tiktok") {
      // Tenta .tiktok, .tt ou .ttdl
      const ttFunc = btch.tiktok || btch.tt || btch.ttdl;
      if (!ttFunc) throw new Error("A lib não exportou a função TikTok. Verifique o console.");
      result = await ttFunc(url);
    } 
    else if (type === "instagram") {
      // Tenta .instagram ou .ig
      const igFunc = btch.instagram || btch.ig;
      if (!igFunc) throw new Error("A lib não exportou a função Instagram.");
      result = await igFunc(url);
    }

    console.log(`Resultado bruto do ${type}:`, result);

    // Extração do link (cada plataforma retorna de um jeito)
    let downloadUrl = "";

    if (type === "youtube") {
      downloadUrl = result.mp4 || result.url || (result.result ? result.result.url : "");
    } else if (type === "tiktok") {
      // O TikTok da btch costuma retornar dentro de 'result' ou direto no objeto
      downloadUrl = result.video || result.nowm || (result.result ? result.result.video : "");
    } else if (type === "instagram") {
      // Instagram pode vir como array de links
      downloadUrl = Array.isArray(result) ? result[0] : (result.url || result.video || (result.result ? result.result[0] : ""));
    }

    if (!downloadUrl) {
      throw new Error("Link de download não encontrado na resposta da API.");
    }

    return { success: true, downloadUrl };

  } catch (error: any) {
    console.error("Erro na Server Action:", error);
    return { success: false, error: error.message };
  }
}