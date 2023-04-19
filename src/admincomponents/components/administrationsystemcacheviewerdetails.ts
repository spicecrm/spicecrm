/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {backend} from '../../services/backend.service';
import {helper} from '../../services/helper.service';

@Component({
    selector: 'administration-system-cacheviewer-details',
    templateUrl: '../templates/administrationsystemcacheviewerdetails.html'
})
export class AdministrationSystemCacheViewerDetails {

    /**
     * reference to the modal itself
     */
    public self: any;

    public cachedKey: string;
    public cachedData: any;

    @Output() deleteitem: EventEmitter<boolean> = new EventEmitter<boolean>();


    get displayData(){
        return this.cachedData ? JSON.stringify(this.cachedData,null, '\t') : ''
    }

    public delete(){
        this.deleteitem.emit(true);
        this.close();
    }

    public close(){
        this.self.destroy();
    }
}
