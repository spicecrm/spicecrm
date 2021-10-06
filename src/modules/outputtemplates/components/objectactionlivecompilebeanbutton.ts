/**
 * @module ObjectComponents
 */
import { Component, EventEmitter, ViewContainerRef } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
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
