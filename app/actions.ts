"use server";

import { igdl, youtube } from 'btch-downloader';
const btch = require('btch-downloader');

export async function downloadVideo(url: string, type: "youtube" | "tiktok" | "instagram") {
  try {
    let result: any;

    // Chamadas de API
    if (type === "youtube") {
      result = await youtube(url);
    }
    else if (type === "tiktok") {
      // Voltando para o modelo original do tiktok que funcionava
      const ttFunc = btch.tiktok || btch.tt || btch.ttdl;
      result = await ttFunc(url);
    }
    else if (type === "instagram") {
      result = await igdl(url);
    }

    console.log(`[DEBUG] Resultado bruto do ${type}:`, result);

    let downloadUrl = "";

    // EXTRAÇÃO DE DADOS BASEADA NOS SEUS LOGS
    if (type === "instagram") {
      // De acordo com seu log, o link está em: result.result[0].url
      if (result.result && Array.isArray(result.result) && result.result.length > 0) {
        downloadUrl = result.result[0].url;
      }
      // Fallback para o formato antigo caso a lib mude
      else if (Array.isArray(result)) {
        downloadUrl = typeof result[0] === 'string' ? result[0] : result[0].url;
      } else {
        downloadUrl = result.url || "";
      }
    }

    else if (type === "tiktok") {
      // Verificamos se há mais de um link no array
      if (result.video && Array.isArray(result.video)) {
        // Priorizamos o link 'nowm' (no watermark) se a lib oferecer em outro campo, 
        // ou tentamos o segundo link do array caso exista (pode ser o formato compatível)
        downloadUrl = result.nowm || result.video[0];

        // Se o primeiro link falhar ou você quiser dar a opção de maior compatibilidade:
        // downloadUrl = result.video[1] || result.video[0]; 
      } else {
        downloadUrl = result.nowm || result.video || (result.result ? result.result.video : "");
      }
    }

    else if (type === "youtube") {
      // Mantendo o que você confirmou que já funciona
      downloadUrl = result.mp4 || result.url || (result.result ? result.result.url : "");
    }

    // Validação final
    if (!downloadUrl || typeof downloadUrl !== 'string' || !downloadUrl.startsWith('http')) {
      throw new Error(`Link de download .mp4 não encontrado para ${type}.`);
    }

    return { success: true, downloadUrl };

  } catch (error: any) {
    console.error(`Erro na Server Action (${type}):`, error);
    return { success: false, error: error.message };
  }
}