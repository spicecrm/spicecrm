import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router}   from '@angular/router';
import {Observable, Subject, of} from 'rxjs';

@Injectable()
export class recent {
    private items: Array<any> = [];
    public moduleItems: any = {};

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                this.items.some((item, index) => {
                    if(item.module_name === message.messagedata.module && item.item_id == message.messagedata.id){
                        this.items[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });

                if(this.moduleItems[message.messagedata.module]){
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if(item.item_id == message.messagedata.id){
                            this.moduleItems[message.messagedata.module][index].item_summary = message.messagedata.data.summary_text;
                            return true;
                        }
                    });
                }

                break;
            case 'model.delete':
                this.items.some((item, index) => {
                    if(item.module_name === message.messagedata.module && item.item_id == message.messagedata.id){
                        this.items.splice(index, 1);
                        return true;
                    }
                });

                if(this.moduleItems[message.messagedata.module]){
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if(item.item_id == message.messagedata.id){
                            this.items.splice(index, 1);
                            return true;
                        }
                    });
                }

                break;
        }
    }

    public trackItem(module: string, item_id: string, item_summary: string) {
        // handle the general tracker
        this.items.some((item, index) => {
            if(item.module_name === module && item.item_id == item_id){
                this.items.splice(index, 1);
                return true;
            }
        });

        this.items.splice(0, 0, {
            item_id: item_id,
            module_name: module,
            item_summary: item_summary
        });

        while(this.items.length > 50) {this.items.pop();}

        // handle the module specific tracker
        if(this.moduleItems[module]){
            this.moduleItems[module].some((item, index) => {
                if(item.item_id == item_id){
                    this.moduleItems[module].splice(index, 1);
                    return true;
                }
            });

            this.moduleItems[module].splice(0, 0, {
                item_id: item_id,
                module_name: module,
                item_summary: item_summary
            });

            while(this.moduleItems[module].length > 5) {this.moduleItems[module].pop();}
        }
    }

    public getRecent(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('recent'+this.session.authData.sessionId)] && sessionStorage[window.btoa('recent'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            let response = this.session.getSessionData('recent');
            for (let item of response) {
                this.items.push(item);
            }
            loadhandler.next('getRecent');
        }else {
            this.backend.getRecent('', 50).subscribe(response => {
                this.session.setSessionData('recent',response);
                for (let item of response) {
                    this.items.push(item);
                }
                loadhandler.next('getRecent');
            });
        }
    }

    public getModuleRecent(module: string) {
        if(this.moduleItems[module]) {
            return of(this.moduleItems[module]);
        } else {
            let responseSubject = new Subject<Array<any>>();
            if (!this.moduleItems[module]) {
                this.backend.getRecent(module, 5) .subscribe(response => {
                    this.moduleItems[module] = [];
                    for (let item of response) {
                        this.moduleItems[module].push(item);
                    }
                    responseSubject.next(this.moduleItems[module]);
                    responseSubject.complete();
                });
            }
            return responseSubject.asObservable();
        }
    }
}
