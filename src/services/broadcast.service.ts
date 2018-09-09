import {Injectable, EventEmitter} from '@angular/core';

interface broadcastMessage {
    messagetype:   string;
    messagedata:   any;
}

@Injectable()
export class broadcast {
    public message$: EventEmitter<broadcastMessage>;

    constructor() {
        this.message$ = new EventEmitter<broadcastMessage>();
    }
    public broadcastMessage(message: string, data: any = {}): void {
        this.message$.emit({
            messagetype: message,
            messagedata: data
        });
    }
}
