// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiChatService {
  private openAiApiKey = 'c3ad767941f84bf0938ec7d44e9380a0';
  private openAiApiUrl = 'https://cog-e5djdwk6kfklc.openai.azure.com/openai/deployments/chat/chat/completions?api-version=2024-04-01-preview';
  private searchApiKey = 'MyZDrDoaS5avQIuN3Atcio5DomPV6nWQFqrkvwBLBhAzSeBpZWmK';
  private searchApiUrl = 'https://gptkb-het5qkitjshd4.search.windows.net/indexes/gptkbindex/docs/search?api-version=2024-05-01-preview';
  private embeddingApiUrl = 'https://cog-e5djdwk6kfklc.openai.azure.com/openai/deployments/embedding/embeddings?api-version=2023-05-15';

  async generateSearchQuery(history: string[], lastQuestion: string): Promise<string> {
    if (!history || !lastQuestion) {
        throw new Error('Invalid input: history and lastQuestion must be provided');
    }

    const messages = [
        {
            content: `You are an Azure Search Query Assistant designed to process conversation histories between users and virtual assistants. Your role is to parse through the content, excluding any messages labeled with the role 'system'. You must identify specific keywords from the latest user message that could relate to associated services or contextually relevant topics discussed earlier in the conversation. Focus on precision to generate effective search queries, specifically tailored for Azure Search Service. Extract and consolidate key phrases or words that would optimize search functionality, helping to locate documents or entries that match the user's query intent. the output should just include keywords seperated by AND`,
            role: 'system',
        },
        ...history
            .map((content, idx) => ({
                content: content || '',
                role: idx % 2 === 0 ? 'user' : 'assistant',
            }))
            .filter(message => message.role === 'user'),
        {
            content: lastQuestion,
            role: 'user',
        },
    ];

    const response = await axios.post(
        this.openAiApiUrl,
        { messages },
        {
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.openAiApiKey,
            },
        },
    );

    const searchQuery = response.data?.choices?.[0]?.message?.content?.trim();
    if (!searchQuery) {
        throw new Error('Failed to generate search query');
    }

    return searchQuery;
}


  async getEmbeddings(userQuery: string): Promise<any> {
    if (!userQuery) {
      throw new Error('Invalid input: userQuery must be provided');
    }

    const response = await axios.post(
      this.embeddingApiUrl,
      { input: userQuery },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.openAiApiKey,
        },
      },
    );

    if (!response.data?.data?.[0]?.embedding) {
      throw new Error('Failed to get embeddings');
    }

    return response.data.data[0].embedding;
  }

  async searchDocuments(searchText: string): Promise<string> {
    if (!searchText) {
      throw new Error('Invalid input: searchText must be provided');
    }

    const embeddings = await this.getEmbeddings(searchText);
    const response = await axios.post(
      this.searchApiUrl,
      {
        search: searchText,
        queryType: 'semantic',
        semanticConfiguration: 'default',
        captions: 'extractive',
        answers: 'extractive|count-3',
        queryLanguage: 'en-US',
        select: 'title,content,url',
        top: 3,
        vectorQueries: [
          {
            vector: embeddings,
            k: 7,
            fields: 'contentVector',
            kind: 'vector',
            exhaustive: true
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.searchApiKey,
        },
      },
    );

    if (!response.data?.value || !Array.isArray(response.data.value)) {
      throw new Error('Failed to retrieve search results');
    }

    const documentContents = response.data.value
      .map((doc: any) => {
        const title = doc.title?.includes('/') ? doc.title.split('/').pop().replace("%20", " ") : doc.title?.replace("%20", " ");
        return `[${title}]::[${doc.content}]::[${doc.url}]`;
      })
      .filter((content: string) => content)
      .join('\r');

    return documentContents;
  }

  async getChatCompletion(history: string[], lastQuestion: string, documentContents: string, site: string): Promise<any> {
    if (!history || !lastQuestion || !documentContents || !site) {
      throw new Error('Invalid input: history, lastQuestion, documentContents, and site must be provided');
    }

    const prompt = `
      ## Context Information Begins ##
      ${documentContents}
      ## Context Information Ends ##
      The above context information is gathered from multiple documents & products/services of '${site}', but it doesnt include the complete list of products/services available and strictly follows "[Document Name]::[Document Content]::[Document Url]" format.

      Your response should strictly be a json with following format:
      {
          "answer": // the answer to the question. answer should only provide information specific to the question and any additional information that might be relevant to the user. the answer should also include links to supporting documents that were used to get the answer e.g. GCC offers trips to italy [italy document 1 Name (italy document 1 Url)] [italy document 2 Name(italy document 2 Url)].
          "thoughts": // brief thoughts on how you came up with the answer, this should include the name of the documents used and logic that was applied.,
          "dataPoints": // documents that were cross referenced for finding the answer as a json array
            [{
            "title": // document title,
            "content": // document content trimmed to first 50 characters,
            "url": // document url,
            }]
      }
    `;

    const messages = [
      {
        content: prompt,
        role: 'system',
      },
      ...history.map((content, idx) => ({
        content: content || '',
        role: idx % 2 === 0 ? 'user' : 'assistant',
      })),
      {
        content: lastQuestion,
        role: 'user',
      },
    ];

    const response = await axios.post(
      this.openAiApiUrl,
      { messages },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.openAiApiKey,
        },
      },
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get chat completion');
    }

    const content = response.data.choices[0].message.content.trim();

    // Attempt to parse the content as JSON
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (error) {
      // If parsing fails, return the content as is
      return { message: content };
    }
  }
}
