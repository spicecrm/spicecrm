/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {ObjectActionOutputBeanButton} from "./objectactionoutputbeanbutton";

@Component({
    selector: 'object-action-live-compile-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionlivecompilebeanbutton.html'
})
export class ObjectActionLiveCompileBeanButton extends ObjectActionOutputBeanButton {
    /**
     * call the parent open output with live compile
     */
    public openOutput() {
        super.openOutput(true, 'pdf');
    }
}
