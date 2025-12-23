/**
 * Service d'export de données (CSV, PDF)
 */
import { analyticsService } from './AnalyticsService';

class ExportService {
  /**
   * Exporter les données en CSV
   */
  async exportToCSV(childId: string, startDate?: Date, endDate?: Date): Promise<string> {
    const data = await analyticsService.getExportData(childId, startDate, endDate);

    if (data.length === 0) {
      return 'Aucune donnée à exporter';
    }

    // En-têtes CSV
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    // Lignes CSV
    const csvRows = data.map((row) => {
      return headers.map((header) => {
        const value = row[header];
        // Échapper les virgules et guillemets
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  /**
   * Générer un rapport PDF (format JSON structuré pour génération PDF côté client)
   */
  async generatePDFReport(childId: string): Promise<any> {
    const reportData = await analyticsService.getReportData(childId);

    // Retourner les données structurées
    // Le PDF sera généré côté client avec une bibliothèque comme jsPDF ou pdfkit
    return {
      ...reportData,
      format: 'pdf-ready',
      sections: [
        {
          title: 'Profil',
          data: reportData.child,
        },
        {
          title: 'Statistiques',
          data: reportData.stats,
        },
        {
          title: 'Sessions Récentes',
          data: reportData.sessions,
        },
        {
          title: 'Progression par Module',
          data: reportData.progress,
        },
        {
          title: 'Badges Débloqués',
          data: reportData.badges,
        },
      ],
    };
  }

  /**
   * Générer un résumé textuel pour PDF
   */
  generateTextSummary(reportData: any): string {
    const { child, stats, sessions, progress, badges } = reportData;

    let summary = `RAPPORT D'APPRENTISSAGE - ${child.pseudo}\n`;
    summary += `Généré le ${new Date(reportData.generatedAt).toLocaleDateString('fr-FR')}\n\n`;

    summary += `=== PROFIL ===\n`;
    summary += `Âge: ${child.age} ans\n`;
    summary += `Niveau: ${child.level}\n`;
    summary += `Niveau utilisateur: ${child.userLevel}\n`;
    summary += `Score global: ${child.overallScore}/100\n\n`;

    summary += `=== STATISTIQUES ===\n`;
    summary += `Total de sessions: ${stats.sessionsCount}\n`;
    summary += `Temps total: ${stats.totalTime} minutes\n`;
    summary += `Score moyen: ${stats.averageScore}/100\n`;
    summary += `Modules utilisés: ${stats.modulesUsed.join(', ')}\n`;
    summary += `Dernière activité: ${stats.lastActivity.toLocaleDateString('fr-FR')}\n\n`;

    summary += `=== PROGRESSION ===\n`;
    const completedModules = progress.filter((p: any) => p.completed).length;
    summary += `Modules complétés: ${completedModules}/${progress.length}\n\n`;

    summary += `=== BADGES ===\n`;
    summary += `Badges débloqués: ${badges.length}\n`;

    return summary;
  }
}

export const exportService = new ExportService();
