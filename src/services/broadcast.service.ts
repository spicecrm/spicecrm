/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

/**
 * the broadcast service is a simple service that can be used to send messages between components that are not in the same dom hiearchy
 */
interface broadcastMessage {
    messagetype: string;
    messagedata: any;
}

@Injectable({
    providedIn: 'root'
})
export class broadcast {

    /**
     * an event emitter that a component can subscribe to to receive events
     *
     * ```typescript
     * constructor(public broadcast: broadcast) {
     *   // subscribe to the broadcast service
     *   this.broadcast.message$.subscribe(message => {
     *       this.handleMessage(message);
     *   });
     *}
     * ```
     *
     */
    public message$: EventEmitter<broadcastMessage> = new EventEmitter<broadcastMessage>();

    /**
     *
     * a public function to briadcast a messase
     *
     * @param message an indicator for the type of message. Canbe any string
     * @param data the message data. Can be any object
     *
     * ```typescript
     * this.broadcast.broadcastMessage("model.loaded", {id: this.id, module: this.module, data: this.data});
     * ```
     *
     * ToDo: add type for the message and add documentation for the message so this is clear and not simply whatever can be broadcasted
     */
    public broadcastMessage(message: string, data: any = {}): void {
        this.message$.emit({
            messagetype: message,
            messagedata: data
        });
    }
}
