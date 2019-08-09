/**
 * @module ObjectComponents
 */
import {Component,  EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";
import {modal} from "../../services/modal.service";
import {relatedmodels} from "../../services/relatedmodels.service";

@Component({
    selector: 'object-action-remove-button',
    templateUrl: './src/objectcomponents/templates/objectactionremovebutton.html'
})
export class ObjectActionRemoveButton {

    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public parent: any = {};
    public module: string = '';

    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private relatedmodels: relatedmodels, private modalservice: modal) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public ngOnInit() {
        setTimeout(() => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    get canDelete() {
        try {
            return this.model.checkAccess('delete');
        } catch (e) {
            return false;
        }
    }

    public execute() {
        this.modalservice.confirm( this.language.getLabel('QST_REMOVE_ENTRY'), this.language.getLabel('QST_REMOVE_ENTRY', null, 'short')).subscribe( (answer) => {
            if ( answer ) this.relatedmodels.deleteItem(this.model.id);
        });
    }


    private handleDisabled(mode) {
        if (!this.canDelete) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }

}