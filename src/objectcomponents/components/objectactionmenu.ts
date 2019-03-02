/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import {helper} from '../../services/helper.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'object-action-menu',
    templateUrl: './src/objectcomponents/templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu {

    @Input() private buttonsize: string = '';
    @Input() private addactions: any[] = [];
    @Input() private addeditactions: any[] = [];
    @Input() private standardactions: boolean = true;
    @Input() private standardeditactions: boolean = true;
    @Output() private action: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language, private broadcast: broadcast, private model: model, private view: view, private metadata: metadata, private elementRef: ElementRef, private renderer: Renderer2, private helper: helper, private layout: layout) {

    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }


    private isEditMode() {
        return this.view.isEditMode();
    }

    private hasNoActions() {
        // because of custom actions can't be checked if they are enabled... return false
        if (this.addactions.length > 0) return false;

        if (this.standardactions) {
            if (this.model.data.acl && this.model.data.acl.edit === false && this.model.data.acl.delete === false) return true;
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

    private canEdit() {
        return this.model.checkAccess('edit');
    }

    private canView() {
        return this.model.checkAccess('detail');
    }

    private canDelete() {
        return this.model.checkAccess('delete');
    }

    private cancelEdit() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    private saveModel() {
        this.model.save(true).subscribe(data => {
            this.view.setViewMode();
        });
    }


    private editModel() {
        if(this.canEdit()) {
            this.model.edit(true);
        }
    }

    private confirmDelete() {
        this.helper.confirm(this.language.getLabel('LBL_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_CONFIRM')).subscribe(answer => {
            if (answer) {
                this.deleteModel();
            }
        });
    }

    private deleteModel() {
        this.model.delete().subscribe(status => {
            if (status) {
                // this.broadcast.broadcastMessage('model.delete', {id: this.model.id});
            }
        });
    }

    private viewModel() {
        this.model.goDetail();
    }

    private doCustomAction(action) {
        this.action.emit(action);
    }

    private getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }

    private getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100) {
            return 'slds-dropdown--bottom';
        }
    }
}
