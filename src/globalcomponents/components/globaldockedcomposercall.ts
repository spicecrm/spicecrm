import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'global-docked-composer-call',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposercall.html'
})
export class GlobalDockedComposerCall implements OnInit {

    @ViewChild('containercontent', {read: ViewContainerRef}) private containercontent: ViewContainerRef;

    @Input() public calldata: any = {};

    private searching: boolean = true;
    private contact: any = {};


    private isClosed: boolean = false;

    constructor(private backend: backend, private dockedComposer: dockedComposer, private language: language, private ViewContainerRef: ViewContainerRef) {

    }

    public ngOnInit() {
        this.backend.postRequest('search', {}, {
            modules: 'Contacts',
            searchterm: this.calldata.callnumber
        }).subscribe(results => {
            try {
                this.contact = results.Contacts.hits[0]._source;
                this.searching = false;
            } catch (err) {
                this.searching = false;
            }
        });
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