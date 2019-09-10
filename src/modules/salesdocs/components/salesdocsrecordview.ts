/**
 * @module ModuleSalesDocs
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";


@Component({
    selector: 'salesdocs-record-view',
    templateUrl: './src/modules/salesdocs/templates/salesdocsrecordview.html',
})
export class SalesDocsRecordView {

    /**
     * the renered doc type
     */
    private _salesdoctype: string;

    private headerComponentset: string = '';
    private footerComponentset: string = '';

    constructor(private metadata: metadata, private language: language, private view: view, private model: model, private configuration: configurationService) {
        this.model.data$.subscribe(recordData => {
            let docType = this.model.getField('salesdoctype');
            if(docType && docType != this._salesdoctype){
                this.renderViewForDocType();
            }
        });
    }


    private renderViewForDocType(){
        let docTypes = this.configuration.getData('salesdoctypes');
        if(docTypes && docTypes.find(docType => docType.name == this.model.getField('salesdoctype'))){
            let docType = docTypes.find(docType => docType.name == this.model.getField('salesdoctype'));
            this.headerComponentset = docType.headercomponentset;
            this.footerComponentset = docType.footercomponentset;
        }
    }

}
