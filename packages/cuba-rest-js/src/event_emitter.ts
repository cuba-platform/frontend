interface IKeyFuncVal {
    [k: string]: (...args) => any;
}

class EventEmitter<Events extends IKeyFuncVal, Key extends keyof Events = keyof Events> {
    private listeners: Map<Key, Set<Events[Key]>> = new Map();

    emit<K extends Key>(eventName: K, ...restParams: Parameters<Events[K]>) {
        const events = this.listeners.get(eventName);

        if (events) {
            events.forEach((fn) => {
                fn.call(null, ...restParams);
            });
        }
    }

    on<K extends Key>(eventName: K, fn: Events[K]): () => void {
        if (!this.listeners.get(eventName)) {
            this.listeners.set(eventName, new Set());
        }

        const events = this.listeners.get(eventName);

        events.add(fn);

        // or use unsubscribe function
        return this.off.bind(this, eventName, fn);
    }

    once<K extends Key>(eventName: K, fn: Events[K]): () => void {
        // @ts-ignore
        const unsubscribe = this.on(eventName, (...args: any[]) => {
            fn(...args);
            unsubscribe();
        });

        return unsubscribe;
    }

    off<K extends Key>(eventName: K, fn: Events[K]) {
        const events = this.listeners.get(eventName);

        if (events) events.delete(fn);
    }
}

interface ICubaRestCheckStatusError {
    message: string;
    response: Response;
}

type REST_EMITTERS_CALLBACKS_PARAMS = {
    'fetch_fail': (error: ICubaRestCheckStatusError) => any;
};


export const restEventEmitter = new EventEmitter<REST_EMITTERS_CALLBACKS_PARAMS>();
