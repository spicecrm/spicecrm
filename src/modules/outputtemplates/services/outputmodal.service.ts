import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class outputModalService {
    /**
     * holds the selected template
     */
    public selectedTemplate: {id: string, name: string};
    /**
     * emitter to share the modal response with parents
     */
    public modalResponse$ = new EventEmitter();
}
