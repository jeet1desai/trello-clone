import { Manager } from 'socket.io-client';

class SocketService {
  private socket: ReturnType<InstanceType<typeof Manager>['socket']> | null = null;
  private static instance: SocketService;
  private userId: string | null = null;
  private boardId: string | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (this.socket?.connected) {
      this.socket.emit('register', userId);
    }
  }

  public setBoardId(boardId: string): void {
    this.boardId = boardId;
    if (this.socket?.connected) {
      this.socket.emit('join_board', boardId);
    }
  }

  public connect(url: string): void {
    if (!this.socket) {
      const manager = new Manager(url, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket = manager.socket('/');

      this.socket.on('connect', () => {
        console.log('Socket connected');
        if (this.userId) {
          this.socket?.emit('register', this.userId);
        }
        if (this.boardId) {
          this.socket?.emit('join_board', this.boardId);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error: Error) => {
        console.error('Socket error:', error);
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit(event: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketService.getInstance();
