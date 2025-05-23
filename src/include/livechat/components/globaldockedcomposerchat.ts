/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {Router} from "@angular/router";
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {session} from "../../../services/session.service";
@Component({
    selector: 'global-docked-composer-chat',
    templateUrl: '../templates/globaldockedcomposerchat.html',
    providers: [model, view],
    standalone: false
})
export class GlobalDockedComposerChat {

    @Input() public composerdata: any = {};
    @Input() public composerindex: number;

    public isClosed: boolean = false;
    public displayLabel: string = '';
    public multipleline: string = '1';
    public description: string = '';
    public parent_id: string = '';
    public parent_module: string = 'Leads';
    public parent_name: string = '';
    public mailbox_id: string = '';
    public messages: any = [];

    constructor(private session: session, private backend: backend, private view: view, private dockedComposer: dockedComposer, private router: Router, private metadata: metadata, private language: language, private modal: modal, private model: model) {
        // set the view to editable and to editmode
        this.view.isEditable = true;
        this.view.setEditMode();

        // set the model to editing
        this.model.isEditing = true;

        // set to global
        this.model.isGlobal = true;
    }
    public ngOnInit() {
        this.parent_id = this.model.id;
        this.parent_module = this.model.module;
        this.getTextMessage();
    }
    public toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    /**
     * returns the toggle icon to either minimize or maximize the composer based on the close state
     */
    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }
    public promptClose() {
        this.closeComposer();
    }

    /**
     * reload messages
     * @param parent_id
     * @param parent_module
     */
    public onloadmsg(parent_id, parent_module) {
        this.backend.getRequest("module/"+ parent_module + "/" + parent_id + "/livechats",{}).subscribe(res=> {
            if(res) {
                this.messages = res.message;
                this.description = '';
                this.displayLabel= res.parent_type;
                this.parent_name = res.parent_name;
                this.parent_id = res.parent_id;
                this.mailbox_id = res.mailboxid;
            }
        });
    }

    /**
     * post message
     * @param message
     * @param parent_id
     * @param parent_module
     */
    public sendMessage(message,parent_id,parent_module) {
        let mailbox_id = this.mailbox_id;
        let body = {
            message: message,
            mailbox_id: mailbox_id
        }
        this.backend.postRequest("module/"+ parent_module + "/" + parent_id + "/livechats",{}, body).subscribe(res=> {
            if(res) {
                this.onloadmsg(this.model.id, this.model.module);
            }
        });
    }

    /**
     *
     */
    public getTextMessage() {
            let parent_id = this.composerdata.model.data.id;
            let parent_module = this.composerdata.model.data.parent_module;
            // let model_id = this.composerdata.id;
            this.backend.getRequest("module/"+ parent_module + "/" + parent_id + "/livechats",{}).subscribe(res=> {
                if(res) {
                    this.messages = res.message;
                    this.description = '';
                    this.parent_name = res.parent_name;
                    this.parent_id = res.parent_id;
                    this.displayLabel = res.parent_type;
                    this.mailbox_id = res.mailboxid;
                    if(res.model_id != '') {
                        this.autocloseComposer(res.model_id);
                    }
                }
            });
    }
    public autocloseComposer(model_id) {
        for(let e=0;e<this.dockedComposer.composers.length;e++) {
            if (this.dockedComposer.composers[e].id === model_id) {
                this.dockedComposer.composers.splice(e,1);
                // this.backend.postRequest("getSocketCurrentUser",{},{model_id}).subscribe();
            }
        }
    }
    public closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.composerdata.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
    }
    public goRecord(parent_module) {
        this.router.navigate(["module/"+ this.parent_module +"/"+this.parent_id]);
    }
    public onFocus() {
        this.multipleline = '3';
    }

}
