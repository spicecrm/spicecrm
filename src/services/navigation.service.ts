/**
 * @module services
 */
import {Injectable, EventEmitter} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Observable, Subject, of} from "rxjs";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {CanActivate, CanDeactivate, Router} from "@angular/router";
import {session} from "./session.service";
import {metadata} from "./metadata.service";
import {modal} from "./modal.service";
import {language} from "./language.service";

@Injectable()
export class navigation {

    public activeModule$: EventEmitter<string>;

    public activeModule: string = "Home";
    private activeId: string = "";

    private modelsEditing: any[] = [];

    constructor(private title: Title, private broadcast: broadcast, private configurationService: configurationService) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    public setActiveModule(activemodule: string, id: string = "", summaryText: string = ""): void {
        this.activeModule = activemodule;
        this.activeId = id;
        this.activeModule$.emit(activemodule);

        this.title.setTitle(this.systemName + " " + (summaryText !== "" ? summaryText : activemodule));
    }

    private get systemName() {
        return this.configurationService.data.display ? this.configurationService.data.display : "SpiceCRM";
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
            case "model.save":
                if (this.activeModule === message.messagedata.module && this.activeId === message.messagedata.id) {
                    this.title.setTitle(this.systemName + " " + message.messagedata.data.summary_text);
                }
                break;
            default:
                break;
        }
    }

    public addModelEditing(module, id, summary_text) {
        this.modelsEditing.push({module, id, summary_text});
    }

    public removeModelEditing(module, id) {
        let i = 0;
        this.modelsEditing.some(model => {
            if (model.id == id && model.module == module) {
                this.modelsEditing.splice(i, 1);
                return true;
            }
            i++;
        });
    }

    get editing() {
        return this.modelsEditing.length > 0;
    }

    public discardAllChanges() {
        this.modelsEditing = [];
    }

}

@Injectable()
export class canNavigateAway implements CanActivate {
    constructor(private navigation: navigation, private modal: modal, private language: language) {
    }

    public canActivate(route, state): Observable<boolean> {
        if (this.navigation.editing) {
            let retSubject = new Subject<boolean>();
            this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP','', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP')).subscribe(retval => {
                if (retval) {
                    this.navigation.discardAllChanges();
                }
                retSubject.next(retval)
                retSubject.complete();
            });
            return retSubject.asObservable();
        } else {
            return of(true);
        }
    }
}
