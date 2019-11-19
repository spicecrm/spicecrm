/**
 * @module ObjectComponents
 */

import {
    Component,
    ElementRef, Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';
import {ObjectListViewFilterPanelExportTargetlist} from "./objectlistviewfilterpanelexporttargetlist";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'object-listview-filter-panel-export-button',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelexportbutton.html',
})
export class ObjectListViewFilterPanelExportButton {

    exportfilterOpen: boolean = false;
    clickListener: any;


    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private modal: modal, private renderer: Renderer2, private backend: backend) {
    }

    toggleFilterOpen(event) {

        event.stopPropagation();
        event.preventDefault();

        this.exportfilterOpen = !this.exportfilterOpen;

        // toggle the listener
        if (this.exportfilterOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }


    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.exportfilterOpen = false;
        }
    }

    get exportdisabled(){
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    export() {
        this.exportfilterOpen = false;

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            let params = {
                listid: this.modellist.currentList.id,
                sortfields: this.modellist.sortArray,
                fields: JSON.stringify(this.modellist.lastFields)
            }

            // generate filename
            let filename = this.model.module + '_' + this.modellist.currentList.name + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';

            this.backend.downloadFile({
                route: '/module/' + this.model.module + '/export',
                method: "POST",
                body: params
            }, filename).subscribe(loaded =>{
                loadingRef.instance.self.destroy();
            });
        });

    }

    exportTargetList() {
        this.exportfilterOpen = false;
        this.modal.openModal('ObjectListViewFilterPanelExportTargetlist').subscribe(modalRef => {
            modalRef.instance.listId = this.modellist.currentList.id;
        });
    }

}