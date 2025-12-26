
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Você é um consultor jurídico e imobiliário sênior especializado na Lei do Inquilinato (Lei 8.245/91).
Seu objetivo é ajudar o usuário (LOCADOR) a criar contratos perfeitos para aluguel de quartos em casas compartilhadas.
Você deve:
1. Analisar cláusulas e sugerir melhorias.
2. Explicar como calcular multas proporcionais.
3. Dar dicas de como fazer vistorias que protejam o patrimônio.
4. Responder dúvidas sobre despejo, falta de pagamento e conflitos entre moradores.
Sempre seja profissional, objetivo e foque na segurança jurídica do locador.`;

export async function askAI(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, tive um erro ao processar sua solicitação. Verifique sua conexão ou tente novamente.";
  }
}

export async function validateFormData(stepName: string, data: any) {
  const prompt = `Como consultor imobiliário, analise os seguintes dados do passo "${stepName}" e identifique possíveis erros, inconsistências ou sugestões de melhoria para o contrato de locação:
  
  Dados: ${JSON.stringify(data)}
  
  Retorne uma lista curta e direta de pontos de atenção e correções sugeridas.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "Seja breve, direto e foque em erros reais ou omissões importantes. Se os dados parecerem corretos, diga que está tudo ok.",
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    return "Não foi possível validar os dados agora.";
  }
}

export async function analyzeContract(contractData: any) {
  const prompt = `Analise os dados deste contrato e aponte riscos ou pontos de melhoria: ${JSON.stringify(contractData)}`;
  return askAI(prompt);
}
