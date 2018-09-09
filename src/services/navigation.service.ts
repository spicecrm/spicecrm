import {Injectable, EventEmitter} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {broadcast} from './broadcast.service';

@Injectable()
export class navigation {

    activeModule: string = 'Home';
    activeId: string = '';
    public activeModule$: EventEmitter<string>;

    constructor(private title: Title, private broadcast: broadcast) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    handleMessage(message: any) {
        switch (message.messagetype) {
            case 'model.save':
                if(this.activeModule == message.messagedata.module && this.activeId == message.messagedata.id)
                    this.title.setTitle('SpiceCRM ' + message.messagedata.data.summary_text);
                    break;
        }
    }

    public setActiveModule(module: string, id: string = '', summaryText: string = ''): void {
        this.activeModule = module;
        this.activeId = id;
        this.activeModule$.emit(module);

        this.title.setTitle('SpiceCRM ' + summaryText != '' ? summaryText : module);
    }

}




