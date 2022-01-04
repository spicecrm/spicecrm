/**
 * @module ModuleSalesDocs
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";

/**
 * renders a modal for the creation of the document data
 */
@Component({
    templateUrl: '../templates/salesdocsaddmain.html',
    providers: [view]
})
export class SalesDocsAddMain {

    /**
     * for the modal the reference to self
     */
    public self: any;

    constructor(public metadata: metadata, public language: language, public view: view) {

    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * continues to the next step and closes the modal
     */
    public next() {
        this.self.destroy();
    }
}
