import * as signalR from '@microsoft/signalr';

interface UploadProgress {
  PostId: string;
  Type: 'photo' | 'video';
  Index: number;
  Total: number;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private uploadProgressCallbacks: Map<string, (progress: UploadProgress) => void> = new Map();

  async connect(userId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL || 'https://localhost:7096'}/uploadHub`, {
        accessTokenFactory: () => {
          // Get token from localStorage or your auth context
          return localStorage.getItem('accessToken') || '';
        }
      })
      .withAutomaticReconnect()
      .build();

    // Listen for upload progress events
    this.connection.on('UploadProgress', (progress: UploadProgress) => {
      const callback = this.uploadProgressCallbacks.get(progress.PostId);
      if (callback) {
        callback(progress);
      }
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.uploadProgressCallbacks.clear();
    }
  }

  subscribeToUploadProgress(postId: string, callback: (progress: UploadProgress) => void): void {
    this.uploadProgressCallbacks.set(postId, callback);
  }

  unsubscribeFromUploadProgress(postId: string): void {
    this.uploadProgressCallbacks.delete(postId);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();
export type { UploadProgress };
