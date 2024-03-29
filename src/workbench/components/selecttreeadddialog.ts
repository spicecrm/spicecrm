/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'selecttree-add-dialog',
    templateUrl: '../templates/selecttreeadddialog.html'
})
export class SelectTreeAddDialog{

    @Input() tree = null;
    @Output('tree') tree$ = new EventEmitter();

    addType: string = 'fieldset';
    addName: string = '';
    fieldsettype: string = 'custom';
    self;

    constructor(public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public utils: modelutilities) {

    }


    closeDialog() {
        this.self.destroy();
    }


    add() {
        this.tree = {
            id: this.utils.generateGuid(),
            name: this.addName
        };


        this.backend.postRequest('configuration/spiceui/core/selecttree/newtree', null, this.tree).subscribe(
            (success) => {

                // this.toast.sendToast('saved');
                this.tree$.emit(this.tree);
                this.self.destroy();

            },
            (error) => {
                // this.toast.sendAlert('saving failed!');
                console.error(error);

            }
        );
    }


}
