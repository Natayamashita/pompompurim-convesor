"use server";

// Importando as exportações nomeadas exatas conforme os usages CJS
const { igdl, ttdl, youtube } = require('btch-downloader');

export async function downloadVideo(url, type) {
  try {
    let result;

    // Execução baseada no tipo, chamando a função correta da lib
    if (type === "instagram") {
      if (!igdl) throw new Error("Exportação 'igdl' não encontrada.");
      result = await igdl(url);
    } 
    else if (type === "tiktok") {
      if (!ttdl) throw new Error("Exportação 'ttdl' não encontrada.");
      result = await ttdl(url);
    } 
    else if (type === "youtube") {
      if (!youtube) throw new Error("Exportação 'youtube' não encontrada.");
      result = await youtube(url);
    }

    console.log(`[DEBUG] Resposta Bruta ${type}:`, result);

    let downloadUrl = "";

    // Extração baseada no formato de retorno de cada função
    if (type === "instagram") {
      // igdl geralmente retorna Array de strings ou objetos
      if (Array.isArray(result)) {
        const item = result[0];
        downloadUrl = typeof item === 'string' ? item : (item.url || item.link);
      } else {
        downloadUrl = result.url || result.link || result.result?.[0]?.url || "";
      }
    } 
    else if (type === "tiktok") {
      // ttdl costuma retornar links com e sem marca d'água
      downloadUrl = result.video || result.nowm || result.url || (result.result ? result.result.video : "");
    } 
    else if (type === "youtube") {
      // youtube retorna as qualidades disponíveis
      downloadUrl = result.mp4 || result.url || (result.result ? result.result.url : "");
    }

    if (!downloadUrl || typeof downloadUrl !== 'string' || !downloadUrl.startsWith('http')) {
      throw new Error(`Não foi possível extrair o link de download válido para ${type}.`);
    }

    return { success: true, downloadUrl };

  } catch (error) {
    console.error("Erro na Server Action:", error);
    return { success: false, error: error.message };
  }
}