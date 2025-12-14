/**
 * Service de gestion offline-first
 */
import { getChildProfile, saveChildProfile, saveProgress, getProgress } from '@minigenie/shared/src/utils/storage';

export interface OfflineQueueItem {
  id: string;
  type: 'progress' | 'profile' | 'sync';
  data: any;
  timestamp: Date;
  synced: boolean;
}

class OfflineService {
  private queue: OfflineQueueItem[] = [];
  private isOnline: boolean = true;

  /**
   * Initialiser le service offline
   */
  async initialize(): Promise<void> {
    // Vérifier la connexion
    this.checkConnection();
    
    // Charger la file d'attente
    await this.loadQueue();
    
    // Démarrer la synchronisation si en ligne
    if (this.isOnline) {
      this.syncQueue();
    }
  }

  /**
   * Vérifier la connexion internet
   */
  private checkConnection(): void {
    // Pour mobile, on peut utiliser NetInfo
    // Pour web, on peut utiliser navigator.onLine
    if (typeof navigator !== 'undefined') {
      this.isOnline = navigator.onLine;
    } else {
      // Par défaut, on considère qu'on est en ligne
      this.isOnline = true;
    }
  }

  /**
   * Charger la file d'attente depuis le stockage local
   */
  private async loadQueue(): Promise<void> {
    try {
      // TODO: Charger depuis AsyncStorage/localStorage
      this.queue = [];
    } catch (error) {
      console.error('Erreur lors du chargement de la file:', error);
      this.queue = [];
    }
  }

  /**
   * Sauvegarder la file d'attente
   */
  private async saveQueue(): Promise<void> {
    try {
      // TODO: Sauvegarder dans AsyncStorage/localStorage
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la file:', error);
    }
  }

  /**
   * Ajouter un élément à la file d'attente
   */
  async enqueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'synced'>): Promise<void> {
    const queueItem: OfflineQueueItem = {
      ...item,
      id: `queue_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      synced: false,
    };

    this.queue.push(queueItem);
    await this.saveQueue();

    // Si en ligne, synchroniser immédiatement
    if (this.isOnline) {
      this.syncItem(queueItem);
    }
  }

  /**
   * Synchroniser un élément spécifique
   */
  private async syncItem(item: OfflineQueueItem): Promise<void> {
    try {
      // TODO: Envoyer à Supabase
      // Pour l'instant, on marque juste comme synchronisé
      item.synced = true;
      await this.saveQueue();
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      // L'élément restera dans la file pour réessayer plus tard
    }
  }

  /**
   * Synchroniser toute la file
   */
  async syncQueue(): Promise<void> {
    if (!this.isOnline) {
      return;
    }

    const unsyncedItems = this.queue.filter(item => !item.synced);
    
    for (const item of unsyncedItems) {
      await this.syncItem(item);
    }

    // Nettoyer les éléments synchronisés anciens (plus de 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    this.queue = this.queue.filter(
      item => !item.synced || item.timestamp > sevenDaysAgo
    );
    
    await this.saveQueue();
  }

  /**
   * Sauvegarder la progression (offline-first)
   */
  async saveProgressOffline(progress: any): Promise<void> {
    // Sauvegarder localement immédiatement
    await saveProgress(progress);
    
    // Ajouter à la file pour synchronisation
    await this.enqueue({
      type: 'progress',
      data: progress,
    });
  }

  /**
   * Obtenir le statut de connexion
   */
  getConnectionStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Obtenir le nombre d'éléments en attente de synchronisation
   */
  getPendingCount(): number {
    return this.queue.filter(item => !item.synced).length;
  }
}

// Instance singleton
export const offlineService = new OfflineService();

