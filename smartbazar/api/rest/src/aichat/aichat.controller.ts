// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './aichat.service';

@Controller('/chat')
export class AiChatController {
  constructor(private readonly chatService: AiChatService) {}

  @Post()
  async handleChat(@Body() body: { history: string[]; lastQuestion: string; site: string; stream?: boolean }) {

    const { history, lastQuestion, site } = body;
    if (lastQuestion) {
    const searchQuery = await this.chatService.generateSearchQuery(history, lastQuestion);
    const documentContents = await this.chatService.searchDocuments(searchQuery);
    const chatCompletion = await this.chatService.getChatCompletion(history, lastQuestion, documentContents, site);
    return { response: chatCompletion };
    }
    else{
    return { response: "Please Enter a Valid Prompt" };
    }
  }
}
