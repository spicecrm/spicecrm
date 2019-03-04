/**
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';

@Injectable()
export class listfilters {

    constructor() {
    }

    loadedBasefilter: string = '';
    basefilter: string = '';
    loadedFilters: Array<any> = [];
    filters: Array<any> = [];

    isDirty(){
        return this.loadedBasefilter !== this.basefilter || btoa(JSON.stringify(this.filters)) !== btoa(JSON.stringify(this.loadedFilters));
    }

    setSaved(){
        this.loadedBasefilter = this.basefilter;
        this.loadedFilters = this.filters;
    }

    cancelEdit(){
        this.basefilter = this.loadedBasefilter;
        this.filters = this.loadedFilters;
    }
}