/**
 * @module GlobalComponents
 */
import {
    Component, Input
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-docked-composer-messages-badge',
    templateUrl: '../templates/globaldockedcomposermessagesbadge.html'
})
export class GlobalDockedComposerMessagesBadge {

    public showpopover: boolean = false;

    @Input()public side: "left" | "right" = 'left'

    constructor(public model: model,public language: language) {

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
