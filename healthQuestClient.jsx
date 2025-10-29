// HealthQuest API Client
const API_CONFIG = {
  baseURL: 'https://api-dev.discoverhealthquest.com',
  apiVersion: 'v1',
  timeout: 30000
};

class HealthQuestAPI {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  getHeaders() {
    // Add authentication headers when available
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Request Failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Quest Methods
  async getQuest(questId) {
    const response = await this.request(`/api/v1/quests/${questId}`);
    return response.data;
  }

  async getLesson(questId, lessonNumber) {
    const response = await this.request(
      `/api/v1/quests/${questId}/lessons/${lessonNumber}`
    );
    return response.data;
  }

  async getAssessment(questId, assessmentType) {
    const response = await this.request(
      `/api/v1/quests/${questId}/assessments/${assessmentType}`
    );
    return response.data;
  }

  async getAllLessons(questId) {
    const quest = await this.getQuest(questId);
    return quest.lessons || [];
  }

  // User Progress Methods
  async submitProgress(userId, progressData) {
    const response = await this.request(
      `/api/v1/users/${userId}/progress`,
      {
        method: 'POST',
        body: JSON.stringify(progressData)
      }
    );
    return response.data;
  }

  async submitAssessment(userId, assessmentData) {
    const response = await this.request(
      `/api/v1/users/${userId}/assessments`,
      {
        method: 'POST',
        body: JSON.stringify(assessmentData)
      }
    );
    return response.data;
  }

  async getUserProgress(userId, questId) {
    const response = await this.request(
      `/api/v1/users/${userId}/quests/${questId}/progress`
    );
    return response.data;
  }
}

// Export singleton instance
export const healthQuestAPI = new HealthQuestAPI();