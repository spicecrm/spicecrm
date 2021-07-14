/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

@Injectable()
export class broadcast {

    /**
     * an event emitter that a component can subscribe to to receive events
     *
     * ```typescript
     * constructor(private broadcast: broadcast) {
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
