// server/services/assistant-service.js
const axios = require('axios');
const { NlpManager } = require('node-nlp');

const Command = require(process.cwd() + '/models/Command');
const Task = require(process.cwd() + '/models/Task');


class AssistantService {
  constructor() {
    this.nlp = new NlpManager({ languages: ['en'] });
    this.initNLP();
    this.assemblyAIApiKey = process.env.ASSEMBLY_AI_API_KEY;
  }

  async initNLP() {
    // Add basic intents
    this.nlp.addDocument('en', 'hello', 'greetings.hello');
    this.nlp.addDocument('en', 'hi', 'greetings.hello');
    this.nlp.addDocument('en', 'hey jarvis', 'greetings.hello');

    this.nlp.addDocument('en', 'what time is it', 'queries.time');
    this.nlp.addDocument('en', 'tell me the time', 'queries.time');

    this.nlp.addDocument('en', 'add a task', 'tasks.add');
    this.nlp.addDocument('en', 'create a new task', 'tasks.add');

    // Add answers
    this.nlp.addAnswer('en', 'greetings.hello', 'Hello, I am JARVIS. How can I assist you today?');
    this.nlp.addAnswer('en', 'queries.time', `The current time is ${new Date().toLocaleTimeString()}.`);
    this.nlp.addAnswer('en', 'tasks.add', 'What would you like to add as a task?');

    // Train the model
    await this.nlp.train();
    console.log('NLP model trained');
  }

  async transcribeAudio(audioData) {
    try {
      // Create a new transcription using AssemblyAI's API
      const response = await axios.post('https://api.assemblyai.com/v2/transcript', 
        { audio_url: audioData },
        {
          headers: {
            'Authorization': this.assemblyAIApiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const transcriptId = response.data.id;
      
      // Poll for the transcript until it's ready
      let transcriptResult = await this.getTranscriptionResult(transcriptId);
      
      return transcriptResult.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
  
  async getTranscriptionResult(transcriptId) {
    let status = 'processing';
    let result;
    
    while (status === 'processing' || status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            'Authorization': this.assemblyAIApiKey
          }
        }
      );
      
      status = response.data.status;
      result = response.data;
    }
    
    return result;
  }
  
  async processSpeech(audioData) {
    try {
      // First transcribe the audio using AssemblyAI
      const transcription = await this.transcribeAudio(audioData);
      
      // Then process the text with NLP
      const result = await this.nlp.process('en', transcription);
      
      // Generate response
      const response = {
        input: transcription,
        intent: result.intent,
        answer: result.answer || "I'm not sure how to respond to that."
      };
      
      return response;
    } catch (error) {
      console.error('Error processing speech:', error);
      throw error;
    }
  }

  async executeCommand(commandName) {
    try {
      const command = await Command.findOne({ name: commandName });
      if (command) {
        // Execute the command
        return { success: true, message: `Executing command: ${command.description}` };
      } else {
        return { success: false, message: 'Command not found' };
      }
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }
}

const assistantService = new AssistantService();

module.exports = { assistantService };
