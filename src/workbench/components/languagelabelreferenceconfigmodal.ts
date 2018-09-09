import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { language } from '../../services/language.service';

@Component({
    selector: 'language-label-reference-config-modal',
    templateUrl: './src/workbench/templates/languagelabelreferenceconfigmodal.html',
})
export class LanguageLabelReferenceConfigModal
{
    self;

    constructor( private lang: language ) {}

    closeDialog()
    {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }
}