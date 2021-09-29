/**
 * @module ObjectComponents
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import { take } from 'rxjs/operators';
import {backend} from '../../../services/backend.service';
import { model } from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/outputtemplates/templates/outputtemplatesdataassistant.html'
})
export class OutputTemplatesDataAssistant implements OnInit {

    /**
     * reference to the modal component
     */
    private self: any;

    /**
     * event emitter for the response
     */
    @Output() private response: EventEmitter<any> = new EventEmitter<any>();
    @Input() private templateModel: model;

    /**
     * the list of modules
     */
    private offeredModules: any[] = [{ name: 'Users', templateObjectName: 'current_user' }];

    private activeModule: string;

    /**
     * the module selected
     * @private
     */
    // private _selectedModule: string;

    private selectedFieldName: string;
    private selectedTemplateFunction: string;

    private insertType: string;

    private moduleFields: any[] = [];

    private functions: any;
    private offeredFunctions: any;

    private fieldFilter = '';
    private isLoadingModuleFields = false;
    private isLoadingFunctions = false;

    private currentPath: any;

    private _resultString: string;

    constructor( public language: language, public metadata: metadata, private backend: backend ) { }

    public ngOnInit() {

        this.offeredModules.push({ name: this.templateModel.getFieldValue('module_name'), templateObjectName: 'bean' });
        this.offeredModules.push({ name: this.templateModel.module, templateObjectName: 'template' });

        console.log(this.offeredModules);

        // this.moduleFields = this.metadata.getModuleFields(this.modulename);

        this.loadFunctions();
    }

    private loadFunctions() {
        this.isLoadingFunctions = true;
        this.backend.getRequest('module/OutputTemplates/templateFunctions')
            .pipe(take(1))
            .subscribe(response => {
                this.functions = response;
                this.language.sortArray( this.functions.pipe );
                this.language.sortArray( this.functions.noPipe );
                this.isLoadingFunctions = false;
            });
    }

/*
    private set selectedModule( val: string ) {
        this._selectedModule = val;
        this.moduleFields = this.metadata.getModuleFields(this._selectedModule);
    }

 */
/*
    private get selectedModule() {
        return this._selectedModule;
    }

 */
/*
    private getFields() {
        let fields = [];
        for ( let fieldname in this.moduleFields ) {
            fields.push({ name: fieldname, nameTranslated: this.language.getFieldDisplayName(this.modulename,fieldname) });
        }
        this.language.sortObjects( fields, 'nameTranslated');
        return fields;
    }


 */
    private cancel() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancel();
    }

    private ok() {
        if ( this.insertType === 'bean ') this.response.emit('bean.'+this.selectedFieldName);
        else this.response.emit('func.'+this.resultString );
        this.cancel();
    }

    /**
     * loads the fields for a given module
     * @param forModule: string
     * @param rootModule: object
     * @set isLoadingModuleFields
     * @set reportModuleFields[rootModule]
     */
    private getModuleFields(forModule, rootModule) {
        this.moduleFields[rootModule] = [];
        this.isLoadingModuleFields = true;
        // this.cdr.detectChanges();
        this.backend.getRequest('dictionary/browser/' + forModule + '/fields')
            .pipe(take(1))
            .subscribe(items => {
                this.moduleFields[rootModule] = items.filter(item => item.type != 'relate' && item.source != 'non-db');
                this.isLoadingModuleFields = false;
            });
    }

    /**
     * @return filteredReportFields: object[]
     */
    private getFilteredFields( fields ) {
        return !this.fieldFilter ? fields : fields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.fieldFilter.toLowerCase()) ||
                    (nodeFiled.label && this.language.getLabel(nodeFiled.label).toLowerCase().includes(this.fieldFilter.toLowerCase()));
            });
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFn(index, item) {
        return index;
    }

    /**
     * @set currentModule
     */
    private setActiveModule( moduleName ) {
        this.activeModule = moduleName;
        this.resultString = this.offeredModules[this.activeModule].templateObjectName;
    }

    /**
     * @param data: object
     * @param rootModule: string
     * @set currentPath
     * @getModuleFields
     */
    private onItemSelection( data, rootModule) {
        this.currentPath = data.path;
        console.log('current path',this.currentPath);
        this.getModuleFields(data.module, rootModule);
    }

    private set resultString( val: string ) {
        this._resultString = val.trim();
        if ( this._resultString ) {
            this.offeredFunctions = this.functions.pipe;
        } else {
            this.offeredFunctions = this.functions.noPipe;
        }
    }

    private get resultString(): string {
        return this._resultString;
    }

}
