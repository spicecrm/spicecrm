/**
 * @module services
 */
import {Injectable, EventEmitter} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";

@Injectable()
export class navigation {

    public activeModule$: EventEmitter<string>;

    public activeModule: string = "Home";
    private activeId: string = "";

    constructor(private title: Title, private broadcast: broadcast, private configurationService: configurationService) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
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
                if(this.activeModule === message.messagedata.module && this.activeId === message.messagedata.id) {
                    this.title.setTitle(this.systemName + " " + message.messagedata.data.summary_text);
                }
                break;
            default:
                break;
        }
    }
}
