import { io, Socket } from 'socket.io-client';

export type SocketState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting' | 'error';

export class AdvancedSocketClient {
    private socket: Socket | null = null;
    private state: SocketState = 'disconnected';
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 1000;
    private eventHandlers: Map<string, Function[]> = new Map();
    private connectionPromise: Promise<void> | null = null;

    constructor(private options: {
        url: string;
        autoReconnect?: boolean;
        debug?: boolean;
    }) {
        options.autoReconnect = options.autoReconnect ?? true;
        options.debug = options.debug ?? false;
    }

    async connect(orderId?: string): Promise<void> {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                this.setState('connecting');
                this.socket = io(this.options.url, {
                    transports: ['websocket', 'polling'],
                    reconnection: this.options.autoReconnect,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    reconnectionDelay: this.reconnectDelay,
                    reconnectionDelayMax: 10000,
                    timeout: 20000,
                    autoConnect: true,
                    forceNew: false,
                    multiplex: true,
                    query: orderId ? { orderId } : {}
                });
                this.setupEventListeners();
                this.socket.on('connect', () => {
                    this.setState('connected');
                    this.reconnectAttempts = 0;
                    if (orderId) {
                        this.joinOrderRoom(orderId);
                    }
                    resolve();
                });
                this.socket.on('connect_error', (error: Error) => {
                    this.setState('error');
                    reject(error);
                });
                this.socket.on('disconnect', (reason: string) => {
                    this.setState('disconnected');
                    if (reason === 'io server disconnect') {
                        this.socket?.connect();
                    }
                });
                this.socket.on('reconnect_attempt', (attempt: number) => {
                    this.setState('reconnecting');
                    this.reconnectAttempts = attempt;
                });
                this.socket.on('reconnect_failed', () => {
                    this.setState('error');
                });
            } catch (error) {
                reject(error);
            }
        });
        return this.connectionPromise;
    }

    private setState(newState: SocketState): void {
        this.state = newState;
        this.emit('state:changed', newState);
    }

    private setupEventListeners(): void {
        if (!this.socket) return;
        const standardEvents = [
            'order:status:updated',
            'order:stage:changed',
            'delivery:assigned',
            'notification:new'
        ];
        standardEvents.forEach(event => {
            this.socket?.on(event, (data: any) => {
                this.emit(event, data);
            });
        });
    }

    joinOrderRoom(orderId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('join:order', orderId);
        }
    }

    leaveOrderRoom(orderId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('leave:order', orderId);
        }
    }

    on(event: string, handler: Function): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
    }

    off(event: string, handler: Function): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any): void {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {}
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.setState('disconnected');
            this.connectionPromise = null;
        }
    }

    getState(): SocketState {
        return this.state;
    }

    isConnected(): boolean {
        return this.state === 'connected' && this.socket?.connected === true;
    }
}

export const socketClient = new AdvancedSocketClient({
    url: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
    autoReconnect: true,
    debug: process.env.NODE_ENV === 'development'
});
