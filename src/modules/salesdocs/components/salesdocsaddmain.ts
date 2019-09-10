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
    templateUrl: './src/modules/salesdocs/templates/salesdocsaddmain.html',
    providers: [view]
})
export class SalesDocsAddMain {

    /**
     * for the modal the reference to self
     */
    private self: any;

    constructor(private metadata: metadata, private language: language, private view: view) {

    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * continues to the next step and closes the modal
     */
    private next() {
        this.self.destroy();
    }
}
