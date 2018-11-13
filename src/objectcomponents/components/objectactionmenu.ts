import {Component, ElementRef, Renderer, Input, Output, OnDestroy, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import { helper } from '../../services/helper.service';

@Component({
    selector: 'object-action-menu',
    templateUrl: './src/objectcomponents/templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu implements OnDestroy {

    @Input() buttonsize: string = '';
    @Input() addactions: Array<any> = [];
    @Input() addeditactions: Array<any> = [];
    @Input() standardactions: boolean = true;
    @Input() standardeditactions: boolean = true;
    @Output() action: EventEmitter<string> = new EventEmitter<string>();
    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private language: language, private broadcast: broadcast, private model: model, private view: view, private metadata: metadata, private elementRef: ElementRef, private renderer: Renderer, private helper: helper ) {

    }

    public ngOnDestroy(){
        if(this.clickListener) this.clickListener();
    }


    private isEditMode() {
        return this.view.isEditMode();
    }

    private hasNoActions()    {
        // because of custom actions can't be checked if they are enabled... return false
        if(this.addactions.length > 0)
            return false;

        if (this.standardactions) {
            if (this.model.data.acl && this.model.data.acl.edit === false && this.model.data.acl.delete === false)
                return true;
        }

        return false;
        /*
        if (this.standardactions) {
            if (this.model.data.acl && this.model.data.acl.edit === false && this.model.data.acl.delete === false)
                return this.addactions.length == 0;
            else
                return false;
        } else {
            return this.addactions.length == 0;
        }
        */
    }

    canEdit() {
        return this.model.data.acl.edit;
    }

    canDelete() {
        return this.model.data.acl.delete;
    }

    cancelEdit() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    saveModel() {
        this.model.save(true).subscribe(data => {
            this.view.setViewMode();
        })
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    editModel() {
        this.model.edit(true);
    }

    confirmDelete(){
        this.helper.confirm(this.language.getLabel('LBL_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_CONFIRM')).subscribe(answer =>{
            if(answer){
                this.deleteModel();
            }
        });
    }

    deleteModel() {
        this.isOpen = false;
        this.model.delete().subscribe(status => {
            if (status) {
                // this.broadcast.broadcastMessage('model.delete', {id: this.model.id});
            }
        })
    }

    doCustomAction(action) {
        this.action.emit(action);
        this.isOpen = false;
    }

    getButtonSizeClass() {
        if (this.buttonsize !== '')
            return 'slds-button--icon-' + this.buttonsize;
    }

    getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100)
            return 'slds-dropdown--bottom';
    }
}