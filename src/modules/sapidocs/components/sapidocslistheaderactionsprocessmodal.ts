/**
 * @module ObjectComponents
 */

import {Subject} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocslistheaderactionsprocessmodal.html',
})
export class SAPIDOCsListHeaderActionsProcessModal implements OnInit {

    /**
     * reference to the modal itsel
     */
    private self: any;

    private count: number = 0;
    private processed: number = 0;
    private processedcomplete: number = 0;
    private processedfailed: number = 0;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private backend: backend,
        private modellist: modellist,
    ) {
    }

    public ngOnInit(): void {
        this.count = this.modellist.getSelectedIDs().length;
        if(this.count > 0) {
            this.processIDOCs().then(ret => {
                this.close();
            });
        } else {
            this.close();
        }
    }

    /**
     * process the idocs sequentially
     */
    private async processIDOCs(): Promise<boolean> {
        let ret = new Subject<boolean>();
        let selectedIds = this.modellist.getSelectedIDs();
        for (let selectedId of selectedIds) {
            await this.processIDOC(selectedId).then(res => {
                if (res) {
                    this.processedcomplete++;
                } else {
                    this.processedfailed++;
                }
            });
            this.processed++;

            // if we have processed all complete
            if (this.processed == this.count) {
                ret.next(true);
                ret.complete();
            }
        }
        return ret.toPromise();
    }

    /**
     * close the window
     */
    private close() {
        this.self.destroy();
    }

    /**
     * processes a single idoc
     */
    private async processIDOC(idocid): Promise<boolean> {
        let sub = new Subject<boolean>();
        this.backend.postRequest(`modules/SAPIdocs/${idocid}/process`).subscribe(
            success => {
                sub.next(true);
                sub.complete();
            },
            error => {
                sub.next(false);
                sub.complete();
            });
        return sub.toPromise();
    }

    /**
     * returns the style for the process bar with the progress percentage
     */
    get progressBarStyle() {
        return {
            width: this.percentage + '%'
        };
    }

    /**
     * calculates the completion percentage
     */
    get percentage() {
        return this.count > 0 ? Math.floor(this.processed / this.count * 100) : 0;
    }

}
