/**
 * @module ObjectComponents
 */
import {
    Component, Input
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-messages-badge',
    templateUrl: './src/objectcomponents/templates/objectrecordmessagesbadge.html'
})
export class ObjectRecordMessagesBadge {

    @Input() private side: "left" | "right" = 'left'

    constructor(private model: model, private language: language) {

    }

    get messagecount() {
        return this.model.getMessages().length;
    }

    get messages() {
        return this.model.getMessages();
    }

    get nubbinClass() {
        return this.side == 'right' ? 'slds-nubbin_bottom-right' : 'slds-nubbin_bottom-left';
    }

    get popoverStyle() {
        if (this.side == 'right') {
            return {
                bottom: '37px',
                right: '-10px'
            };
        } else {
            return {
                bottom: '37px',
                left: '-10px'
            };
        }
    }
}
