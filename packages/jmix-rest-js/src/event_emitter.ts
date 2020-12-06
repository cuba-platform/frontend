import { ICubaRestCheckStatusError } from './model';

interface IRestEvents {
    'fetch_fail': (error: ICubaRestCheckStatusError) => any;
}
type EventKeys = keyof IRestEvents;

class EventEmitter {
    private listeners: Map<EventKeys, Set<IRestEvents[EventKeys]>> = new Map();

    public emit<K extends EventKeys>(eventName: K, ...restParams: Parameters<IRestEvents[K]>) {
        const events = this.listeners.get(eventName);

        if (events) {
            events.forEach((fn) => {
                fn.call(null, ...restParams);
            });
        }
    }

    public on<K extends EventKeys>(eventName: K, fn: IRestEvents[K]): () => void {
        if (!this.listeners.get(eventName)) {
            this.listeners.set(eventName, new Set());
        }

        const events = this.listeners.get(eventName);

        events.add(fn);

        // or use unsubscribe function
        return this.off.bind(this, eventName, fn);
    }

    public once<K extends EventKeys>(eventName: K, fn: IRestEvents[K]): () => void {
        const unsubscribe = this.on(eventName, (...args: any[]) => {
            fn.apply(null, args);
            unsubscribe();
        });

        return unsubscribe;
    }

    public off<K extends EventKeys>(eventName: K, fn: IRestEvents[K]) {
        const events = this.listeners.get(eventName);

        if (events) events.delete(fn);
    }
}

export const restEventEmitter = new EventEmitter();
