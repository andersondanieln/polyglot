import http from 'http';
import https from 'https';
import { URL } from 'url';
import { AppSettings } from './types';

function makeHttpRequest<T>(
  urlStr: string, 
  options: http.RequestOptions | https.RequestOptions = {}, 
  postData: string | null = null
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(urlStr);
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const reqOptions = {
        ...options,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
      };

      const req = protocol.request(reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } else {

              try {
                 const errData = JSON.parse(data);
                 reject(new Error(`API Error: ${errData.error?.message || errData.message || res.statusCode}`));
              } catch {
                 reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
              }
            }
          } catch (e) {
            reject(new Error('Failed to parse JSON response.'));
          }
        });
      });
      req.on('error', (e) => reject(e));
      if (postData) {
        req.write(postData);
      }
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

interface OllamaGenerateResponse {
  response: string;
}

interface OpenAICompletionResponse {
  choices: {
    message: {
      content: string;
    }
  }[];
}

interface OllamaTagsResponse {
  models: { name: string }[];
}

interface OpenAIModelsResponse {
  data: { id: string }[];
}

export async function generateResponse(
  settings: AppSettings, 
  prompt: string
): Promise<string> {
  const isOpenAI = settings.apiType === 'openai';
  const baseUrl = settings.apiUrl.replace(/\/$/, '');

  if (isOpenAI) {

    const url = `${baseUrl}/v1/chat/completions`;
    const payload = {
      model: settings.selectedModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    };
    const postData = JSON.stringify(payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    try {
      const result = await makeHttpRequest<OpenAICompletionResponse>(url, options, postData);
      return result.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      throw new Error(`Failed to get response from OpenAI API: ${(error as Error).message}`);
    }

  } else {

    const url = `${baseUrl}/api/generate`;
    const payload = { 
      model: settings.selectedModel, 
      prompt, 
      stream: false,
      keep_alive: 0 
    };
    const postData = JSON.stringify(payload);

    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
    };

    try {
      const result = await makeHttpRequest<OllamaGenerateResponse>(url, options, postData);
      return result.response.trim();
    } catch (error) {
      throw new Error(`Failed to get response from Ollama: ${(error as Error).message}`);
    }
  }
}

export async function getApiModels(settings: AppSettings) {
  const isOpenAI = settings.apiType === 'openai';
  const baseUrl = settings.apiUrl.replace(/\/$/, '');

  try {
    if (isOpenAI) {
      const url = `${baseUrl}/v1/models`;
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`
        }
      };
      const data = await makeHttpRequest<OpenAIModelsResponse>(url, options);

      const models = data.data.map(m => ({ name: m.id }));
      return { success: true, models };
    } else {
      const url = `${baseUrl}/api/tags`;
      const data = await makeHttpRequest<OllamaTagsResponse>(url);
      return { success: true, models: data.models || [] };
    }
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}


export async function checkOllamaStatus(settings: AppSettings) {
  const isOpenAI = settings.apiType === 'openai';
  const baseUrl = settings.apiUrl.replace(/\/$/, '');

  try {
    if (isOpenAI) {

      const url = `${baseUrl}/v1/models`;
      const options = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${settings.apiKey}` }
      };
      await makeHttpRequest(url, options);
    } else {
      await makeHttpRequest(`${baseUrl}/api/tags`);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}