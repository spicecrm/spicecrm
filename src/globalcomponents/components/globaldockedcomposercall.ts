import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'global-docked-composer-call',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposercall.html'
})
export class GlobalDockedComposerCall {

    @ViewChild('containercontent', {read: ViewContainerRef}) private containercontent: ViewContainerRef;

    @Input() public calldata: any = {};


    private isClosed: boolean = false;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, private ViewContainerRef: ViewContainerRef) {

    }

    private closeComposer() {
        let i = 0;
        this.dockedComposer.calls.some(call => {
            if (call.callid == this.calldata.callid) {
                this.dockedComposer.calls.splice(i, 1);
                return true;
            }
            i++;
        });
    }
}