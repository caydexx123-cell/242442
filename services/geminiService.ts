import { GoogleGenAI } from "@google/genai";
import { IPAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeIPContext = async (data: IPAnalysis): Promise<string> => {
  if (!apiKey) return "Ошибка: API ключ не найден.";

  const prompt = `
    Проанализируй эти реальные сетевые данные пользователя и дай отчет по кибербезопасности на РУССКОМ языке.

    Данные сканирования:
    - IP: ${data.ip}
    - Локация: ${data.city}, ${data.region}, ${data.country}
    - Провайдер (ISP): ${data.isp}
    - Организация: ${data.org}
    - ASN: ${data.asn}
    - Тип соединения: ${data.type}

    Твоя роль: Элитный ИИ-ассистент кибербезопасности "Aegis".
    
    Задачи:
    1. **Вердикт**: Насколько этот IP "светится"? Видно ли реальное местоположение? (Если это домашний провайдер — уровень риска выше, так как он привязан к физическому адресу).
    2. **Анализ Провайдера**: Если это хостинг (DigitalOcean, AWS и т.д.) — отметь, что похоже на VPN. Если это Ростелеком/Beeline/Comcast и т.д. — предупреди, что сайты видят реального провайдера.
    3. **Советы (Больше конкретики)**: Дай 3-4 мощных совета по защите (VPN, DNS-шифрование, WebRTC leak, Browser Fingerprinting).
    
    Стиль: Технологичный, строгий, экспертный. Используй форматирование (жирный шрифт, списки).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Анализ прерван.";
  } catch (error) {
    console.error(error);
    return "Сбой нейросети. Не удалось сгенерировать отчет.";
  }
};