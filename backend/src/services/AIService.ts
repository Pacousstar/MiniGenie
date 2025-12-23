/**
 * Service IA pour Assena - Réponses contextuelles et pédagogiques
 */
import { supabaseAdmin } from '../config/supabase';

export interface AIConfig {
  provider: 'deepseek' | 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AssenaContext {
  childId: string;
  childName: string;
  childAge: number;
  childLevel: string;
  currentModule?: string;
  recentProgress?: any[];
  overallScore?: number;
  userLevel?: number;
}

export interface AssenaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private config: AIConfig | null = null;

  /**
   * Initialiser la configuration IA
   */
  initialize(config: AIConfig): void {
    this.config = config;
  }

  /**
   * Vérifier si le service IA est configuré
   */
  isConfigured(): boolean {
    return this.config !== null && !!this.config.apiKey;
  }

  /**
   * Obtenir le contexte de l'enfant depuis Supabase
   */
  async getChildContext(childId: string): Promise<AssenaContext> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Récupérer le profil de l'enfant
      const { data: child, error } = await supabaseAdmin
        .from('children')
        .select('*')
        .eq('id', childId)
        .single();

      if (error || !child) {
        throw new Error('Enfant non trouvé');
      }

      // Récupérer la progression récente
      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId)
        .order('last_attempt', { ascending: false })
        .limit(5);

      // Récupérer les sessions récentes
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId)
        .order('start_time', { ascending: false })
        .limit(3);

      return {
        childId: child.id,
        childName: child.pseudo || 'Mon ami',
        childAge: child.age || 5,
        childLevel: child.level || 'maternelle_gs',
        overallScore: child.overall_score || 0,
        userLevel: child.user_level || 0,
        recentProgress: progress || [],
        currentModule: sessions?.[0]?.module_type,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération du contexte:', error);
      throw error;
    }
  }

  /**
   * Générer une réponse d'Assena basée sur le contexte
   */
  async generateResponse(
    childId: string,
    userMessage: string,
    context?: AssenaContext
  ): Promise<string> {
    if (!this.isConfigured()) {
      // Mode fallback : réponses pré-définies
      return this.getFallbackResponse(userMessage);
    }

    try {
      // Obtenir le contexte si non fourni
      const childContext = context || await this.getChildContext(childId);

      // Construire le prompt système
      const systemPrompt = this.buildSystemPrompt(childContext);

      // Construire les messages
      const messages: AssenaMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ];

      // Appeler l'API IA selon le provider
      const response = await this.callAIAPI(messages);

      return response;
    } catch (error: any) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      // Fallback en cas d'erreur
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Construire le prompt système pour Assena
   */
  private buildSystemPrompt(context: AssenaContext): string {
    const levelDescriptions: Record<string, string> = {
      maternelle_ps: 'petite section de maternelle (3 ans)',
      maternelle_ms: 'moyenne section de maternelle (4 ans)',
      maternelle_gs: 'grande section de maternelle (5 ans)',
      primaire_cp1: 'CP (6 ans)',
      primaire_cp2: 'CE1 (7 ans)',
    };

    const levelDesc = levelDescriptions[context.childLevel] || context.childLevel;

    return `Tu es Assena, une mascotte IA bienveillante, patiente, joyeuse et encourageante pour une application éducative pour enfants.

CONTEXTE DE L'ENFANT:
- Nom: ${context.childName}
- Âge: ${context.childAge} ans
- Niveau: ${levelDesc}
- Score global: ${context.overallScore}/100
- Niveau utilisateur: ${context.userLevel}

RÈGLES IMPORTANTES:
1. Parle toujours de manière simple et adaptée à l'âge de l'enfant (${context.childAge} ans)
2. Utilise un langage positif, encourageant et bienveillant
3. Félicite les progrès et encourage en cas de difficulté
4. Réponds de manière courte (maximum 2-3 phrases)
5. Utilise des emojis de manière modérée et appropriée
6. Ne donne jamais de réponses négatives ou décourageantes
7. Adapte ton vocabulaire au niveau de l'enfant

${context.currentModule ? `L'enfant travaille actuellement sur le module: ${context.currentModule}` : ''}

Réponds toujours en français, de manière chaleureuse et pédagogique.`;
  }

  /**
   * Appeler l'API IA selon le provider
   */
  private async callAIAPI(messages: AssenaMessage[]): Promise<string> {
    if (!this.config) {
      throw new Error('Service IA non configuré');
    }

    const { provider, apiKey, model, maxTokens, temperature } = this.config;

    switch (provider) {
      case 'deepseek':
        return this.callDeepSeekAPI(messages, apiKey, model, maxTokens, temperature);
      case 'openai':
        return this.callOpenAIAPI(messages, apiKey, model, maxTokens, temperature);
      default:
        throw new Error(`Provider ${provider} non supporté`);
    }
  }

  /**
   * Appeler l'API DeepSeek
   */
  private async callDeepSeekAPI(
    messages: AssenaMessage[],
    apiKey: string,
    model: string = 'deepseek-chat',
    maxTokens: number = 150,
    temperature: number = 0.7
  ): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: maxTokens || 150,
        temperature: temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as any;
      throw new Error(`Erreur DeepSeek API: ${error?.error?.message || response.statusText}`);
    }

    const data = await response.json() as any;
    return data?.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer de réponse.';
  }

  /**
   * Appeler l'API OpenAI
   */
  private async callOpenAIAPI(
    messages: AssenaMessage[],
    apiKey: string,
    model: string = 'gpt-3.5-turbo',
    maxTokens: number = 150,
    temperature: number = 0.7
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: maxTokens || 150,
        temperature: temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as any;
      throw new Error(`Erreur OpenAI API: ${error?.error?.message || response.statusText}`);
    }

    const data = await response.json() as any;
    return data?.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer de réponse.';
  }

  /**
   * Réponses de fallback (sans IA)
   */
  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Réponses pré-définies selon le contexte
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return 'Bonjour ! Je suis Assena, ravie de te voir ! Prêt(e) à apprendre quelque chose de nouveau aujourd\'hui ? 🌟';
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return 'Je suis là pour t\'aider ! Dis-moi ce que tu veux apprendre et je te guiderai. 💪';
    }

    if (lowerMessage.includes('bravo') || lowerMessage.includes('félicitation') || lowerMessage.includes('bien')) {
      return 'Merci ! C\'est grâce à toi que nous progressons ensemble. Continue comme ça ! 🎉';
    }

    if (lowerMessage.includes('difficile') || lowerMessage.includes('dur') || lowerMessage.includes('compliqué')) {
      return 'Je comprends, c\'est normal que certaines choses soient difficiles. Prenons notre temps, on y arrivera ensemble ! 💙';
    }

    if (lowerMessage.includes('merci')) {
      return 'De rien ! C\'est un plaisir de t\'accompagner dans ton apprentissage. 😊';
    }

    // Réponse par défaut
    return 'Je suis là pour t\'aider ! Dis-moi ce que tu veux faire ou apprendre aujourd\'hui. 🌟';
  }

  /**
   * Générer un message d'encouragement basé sur la progression
   */
  async generateEncouragement(childId: string, context?: AssenaContext): Promise<string> {
    const childContext = context || await this.getChildContext(childId);

    const encouragements = [
      `Bravo ${childContext.childName} ! Tu progresses vraiment bien ! Continue comme ça ! 🌟`,
      `Je suis fière de toi ${childContext.childName} ! Tu apprends de nouvelles choses chaque jour ! 💪`,
      `Super travail ${childContext.childName} ! Tu es sur la bonne voie ! 🎉`,
    ];

    if (this.isConfigured()) {
      try {
        const systemPrompt = this.buildSystemPrompt(childContext);
        const messages: AssenaMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Génère un message d\'encouragement court et positif pour motiver l\'enfant.' },
        ];
        return await this.callAIAPI(messages);
      } catch (error) {
        console.error('Erreur génération encouragement IA:', error);
      }
    }

    // Fallback
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  /**
   * Générer une explication pédagogique
   */
  async generateExplanation(
    childId: string,
    topic: string,
    context?: AssenaContext
  ): Promise<string> {
    const childContext = context || await this.getChildContext(childId);

    if (this.isConfigured()) {
      try {
        const systemPrompt = this.buildSystemPrompt(childContext);
        const messages: AssenaMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Explique de manière simple et adaptée à un enfant de ${childContext.childAge} ans: ${topic}` },
        ];
        return await this.callAIAPI(messages);
      } catch (error) {
        console.error('Erreur génération explication IA:', error);
      }
    }

    // Fallback
    return `Je vais t'expliquer ${topic} de manière simple. C'est une chose intéressante à apprendre ! 🌟`;
  }
}

export const aiService = new AIService();
