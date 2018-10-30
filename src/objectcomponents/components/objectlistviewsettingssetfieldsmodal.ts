import {Component, Input, OnInit} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-listview-settings-setfields-modal',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingssetfieldsmodal.html',
    host: {
        '(document:keydown)': 'this.keypressed($event)',
        '(document:keyup)': 'this.keypressed($event)'
    }
})
export class ObjectListViewSettingsSetfieldsModal implements OnInit {

    allListFields: Array<any> = [];
    listFields: Array<any> = [];
    selectedListFields: Array<string> = [];
    availableFields: Array<any> = [];
    selectedAvailableFields: Array<string> = [];

    multiselect: boolean = false;

    self: any = {};
    modellist: any = {};

    constructor(private metadata: metadata, private language: language) {

    }

    ngOnInit() {
        // check if we have fielddefs
        let fielddefs = this.modellist.getFieldDefs();
        // load all fields
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let allListFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        // sort out the optional ones
        for (let listField of allListFields) {
            listField.displayName = this.language.getFieldDisplayName(this.modellist.module, listField.field)
            if((fielddefs.length > 0 && fielddefs.indexOf(listField.field) >= 0)|| (fielddefs.length === 0 && listField.fieldconfig.default !== false)) {
                this.listFields.push(listField);
            } else {
                this.availableFields.push(listField);
            }
        }

        // sort the fields properly
        if(fielddefs.length > 0){
            this.listFields.sort((a, b) => {
                return fielddefs.indexOf(a.field) - fielddefs.indexOf(b.field);
            })
        }

        this.sortAvailableFields();
    }

    private sortAvailableFields() {
        this.availableFields =  this.availableFields.sort((a, b) => {
            return a.displayName === b.displayName ? 0 : a.displayName > b.displayName ? 1 : -1;
        })
    }

    private keypressed(event) {
        // check the control key to enable MultiSelect
        if (event.type === 'keydown' && event.key === 'Control' && this.multiselect === false) {
            this.multiselect = true;
        }

        if (event.type === 'keyup' && event.key === 'Control' && this.multiselect === true) {
            this.multiselect = false;
        }
    }

    close():void {
        this.self.destroy();
    }

    canSave():boolean {
        return this.listFields.length > 0;
    }

    save():void {
        if (this.canSave()) {
            let fieldsArray: Array<string> = [];
            for(let thisField of this.listFields){
                fieldsArray.push(thisField.field);
            }
            this.modellist.updateListType({fielddefs : btoa(JSON.stringify(fieldsArray))}).subscribe(ret => this.close());
        }
    }

    /*
     select the field whenc lciked int he container
     */
    selectField(container, field) {
        switch (container) {
            case 'available':
                if (this.multiselect === false)
                    this.selectedAvailableFields = [field];
                else {
                    if (this.selectedAvailableFields.indexOf(field) >= 0)
                        this.selectedAvailableFields.splice(this.selectedAvailableFields.indexOf(field), 1);
                    else
                        this.selectedAvailableFields.push(field);
                }
                break;
            case 'list':
                if (this.multiselect === false)
                    this.selectedListFields = [field];
                else {
                    if (this.selectedListFields.indexOf(field) >= 0)
                        this.selectedListFields.splice(this.selectedListFields.indexOf(field), 1);
                    else
                        this.selectedListFields.push(field);
                }
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    isSelected(container, field) {
        switch (container) {
            case 'available':
                if (this.selectedAvailableFields.indexOf(field) >= 0)
                    return true;
                else
                    return false;
            case 'list':
                if (this.selectedListFields.indexOf(field) >= 0)
                    return true;
                else
                    return false;
        }
    }

    /*
     move selected field to the othe container
     */
    moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.listFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    })
                })
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.listFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.availableFields.push(this.listFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    })
                });
                this.selectedListFields = [];
                this.sortAvailableFields();
                break;
        }
    }

    moveUp(){
        let moveArray: Array<any> = [];
        let minIndex: number = -1;

        this.selectedListFields.forEach((item) => {
            this.listFields.some((targetitem, targetindex) => {
                if (item == targetitem.field) {
                    moveArray.push(targetindex)
                    return true;
                }
            })
        });

        moveArray.sort();

        moveArray.forEach(item => {
            if(item - 1 > minIndex && item > 0){
                this.listFields.splice(item - 1, 0, this.listFields.splice(item, 1)[0]);
                minIndex = item - 1;
            } else {
                minIndex = item;
            }
        })

        return;
    }

    moveDown(){
        let moveArray: Array<any> = [];
        let maxIndex: number = this.listFields.length;

        this.selectedListFields.forEach((item) => {
            this.listFields.some((targetitem, targetindex) => {
                if (item == targetitem.field) {
                    moveArray.push(targetindex)
                    return true;
                }
            })
        });

        moveArray.sort().reverse();

        moveArray.forEach(item => {
            if(item + 1 < maxIndex && item < this.listFields.length - 1){
                this.listFields.splice(item + 1, 0, this.listFields.splice(item, 1)[0]);
                maxIndex = item + 1;
            } else {
                maxIndex = item;
            }
        })

        return;
    }

}