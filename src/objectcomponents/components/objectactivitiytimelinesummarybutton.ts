import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-activitiytimeline-summary-button',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummarybutton.html',
})
export class ObjectActivitiyTimelineSummaryButton {

    constructor(private metadata: metadata, private model: model, private language: language, private modal: modal) {
    }

    private displaySummary() {
        this.modal.openModal('ObjectActivitiyTimelineSummaryModal').subscribe(modalRef => {
            modalRef.instance.parent = this.model;
        });
    }
}
