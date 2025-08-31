import * as signalR from '@microsoft/signalr';

interface UploadProgress {
  postId: string;
  type: 'photo' | 'video';
  index: number;
  total: number;
  fileName: string;
}

interface UploadCompleted {
  postId: string;
  success: boolean;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private uploadProgressCallbacks: Map<string, (progress: UploadProgress) => void> = new Map();
  private uploadCompletedCallbacks: Map<string, (completed: UploadCompleted) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(userId?: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL || 'https://localhost:7096'}/hubs/posts`, {
        accessTokenFactory: () => {
          // Get token from localStorage or your auth context
          return localStorage.getItem('accessToken') || '';
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return null; // Stop reconnecting
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Listen for upload progress events
    this.connection.on('UploadProgress', (progress: UploadProgress) => {
      console.log('Received upload progress:', progress);
      debugger;
      
      // Try specific postId first, then wildcard
      let callback = this.uploadProgressCallbacks.get(progress.postId);
      if (!callback) {
        callback = this.uploadProgressCallbacks.get('*');
      }
      
      if (callback) {
        callback(progress);
      } else {
        console.warn(`No callback found for PostId: ${progress.postId}`);
      }
    });

    // Listen for upload completed events
    this.connection.on('UploadCompleted', (completed: UploadCompleted) => {
      console.log('Upload completed:', completed);
      
      // Try specific postId first, then wildcard
      let callback = this.uploadCompletedCallbacks.get(completed.postId);
      if (!callback) {
        callback = this.uploadCompletedCallbacks.get('*');
      }
      
      if (callback) {
        callback(completed);
      }
    });

    // Handle connection events
    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected successfully');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Retrying connection in 3 seconds... (Attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(userId), 3000);
      } else {
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.uploadProgressCallbacks.clear();
      this.uploadCompletedCallbacks.clear();
    }
  }

  async subscribeToUploadProgress(postId: string, callback: (progress: UploadProgress) => void): Promise<void> {
    // Ensure connection is established before subscribing
    if (!this.isConnected()) {
      console.log('SignalR not connected, attempting to connect...');
      await this.connect();
    }
    
    console.log('Setting upload progress callback for postId:', postId);
    this.uploadProgressCallbacks.set(postId, callback);
  }

  async subscribeToUploadCompleted(postId: string, callback: (completed: UploadCompleted) => void): Promise<void> {
    // Ensure connection is established before subscribing
    if (!this.isConnected()) {
      console.log('SignalR not connected, attempting to connect...');
      await this.connect();
    }
    
    console.log('Setting upload completed callback for postId:', postId);
    this.uploadCompletedCallbacks.set(postId, callback);
  }

  unsubscribeFromUploadProgress(postId: string): void {
    this.uploadProgressCallbacks.delete(postId);
  }

  unsubscribeFromUploadCompleted(postId: string): void {
    this.uploadCompletedCallbacks.delete(postId);
  }

  unsubscribeAll(postId: string): void {
    this.uploadProgressCallbacks.delete(postId);
    this.uploadCompletedCallbacks.delete(postId);
  }

  clearAllSubscriptions(): void {
    this.uploadProgressCallbacks.clear();
    this.uploadCompletedCallbacks.clear();
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  async ensureConnected(userId?: string) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        await this.connect(userId);
    }
}
}

export const signalRService = new SignalRService();
export type { UploadProgress, UploadCompleted };
