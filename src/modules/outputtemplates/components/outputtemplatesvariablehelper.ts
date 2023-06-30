/**
 * @module ModuleOutputTemplates
 */
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';
import { take } from 'rxjs/operators';
import { backend } from '../../../services/backend.service';
import { model } from '../../../services/model.service';

@Component({
    templateUrl: '../templates/outputtemplatesvariablehelper.html'
})
export class OutputTemplatesVariableHelper implements OnInit {

    /**
     * reference to the modal component
     */
    public self: any;

    /**
     * event emitter for the response
     */
    @Output() public response: EventEmitter<any> = new EventEmitter<any>();

    /**
     * The model of the template the whole thing belongs to (email template or output template or ...)
     */
    public templateModel: model;

    /**
     * The list of the 3 on top offered modules (bean, template, current user).
     */
    public offeredModules: any[] = [];

    /**
     * The active (selected) module off the on top offered modules.
     */
    public activeModule: string; // 'bean'|'current_user'|'template';

    /**
     * Holds all the fields of the modules.
     */
    public moduleFields: any[] = [];

    /**
     * List of all system template functions (pipe and non-pipe).
     */
    public allFunctions: any;

    /**
     * The System Template Functions offered for selection by user, either pipe or non-pipe.
     */
    public offeredFunctions: any;

    /**
     * Filter value to narrow down the offered fields the user is looking for.
     */
    public fieldFilter = '';

    /**
     * Are the fields of the just selected module currently loading?
     */
    public isLoadingModuleFields = false;

    /**
     * Are the system template functions currently loading?
     */
    public isLoadingFunctions = false;

    /**
     * The path of modules the system tree delivered.
     */
    public modulePathFromTree = '';

    /**
     * The result of the function selection.
     */
    public functionResult = '';

    /**
     * The result of the module field selection.
     */
    public fieldResult = '';

    /**
     * Holds the history of selected system template functions. So the user can do a step-by-step recovery.
     */
    public functionHistory: any[] = [];

    /**
     * Is there a template (EmailTemplate or OutputTemplate) in the base?
     */
    public hasTemplate = false;

    /**
     * The params of the actual (last selected) function.
     */
    public actualFunctionParams = [];

    constructor( public language: language, public metadata: metadata, public backend: backend, public cdr: ChangeDetectorRef, @Optional() public model: model ) { }

    public ngOnInit(): void {

        // Build the array of offered modules.
        this.offeredModules = [{
            name: 'Users',
            templateObjectName: 'current_user',
            displayName: this.language.getLabel('LBL_CURRENT_USER')
        }];
        if ( this.model?.module === 'CampaignTasks' ) {
            let done = {}; // Helper object to prevent collecting one module several times.
            if ( this.metadata.fieldDefs.ProspectLists ) {
                let plMetadata = this.metadata.fieldDefs.ProspectLists;
                Object.keys( plMetadata ).forEach( item => {
                    if ( plMetadata[item].type === 'link' ) {
                        let searchTerm = ( plMetadata[item].module ? plMetadata[item].module : plMetadata[item].name ).toLowerCase();
                        for( let key in this.metadata.fieldDefs ) {
                            if( key.toLowerCase() == searchTerm ) {
                                if ( !done[key] === true ) {
                                    this.offeredModules.push( {
                                        name: key,
                                        templateObjectName: 'bean.' + key,
                                        displayName: this.language.getLabel(this.metadata.getModuleDefs( key ).module_label)
                                    } );
                                    done[key]=true;
                                }
                            }
                        }
                    }
                });
            }
        }
        if ( this.model?.module === 'LandingPages' || this.model?.module === 'OutputTemplates' || this.model?.module === 'EmailTemplates' ) {
            this.hasTemplate = true;
            this.templateModel = this.model;
            this.offeredModules.push({
                name: this.templateModel.module,
                templateObjectName: 'template',
                displayName: this.language.getLabel('LBL_TEMPLATE')
            });
            if ( this.templateModel.getFieldValue('module_name')) {
                this.offeredModules.push({
                    name: this.templateModel.getFieldValue('module_name'),
                    templateObjectName: 'bean.'+this.templateModel.getFieldValue('module_name'),
                    displayName: this.language.getModuleName( this.templateModel.getFieldValue('module_name'), true )
                });
            }
            if ( this.templateModel.getFieldValue('for_bean')) {
                this.offeredModules.push({
                    name: this.templateModel.getFieldValue('for_bean'),
                    templateObjectName: 'bean.'+this.templateModel.getFieldValue('for_bean'),
                    displayName: this.language.getModuleName( this.templateModel.getFieldValue('for_bean'), true )
                });
            }
        }
        this.language.sortObjects( this.offeredModules, 'displayName');
        // Load the system template functions from the backend.
        this.loadFunctions();
    }

    /**
     * Loads all system template functions from the backend.
     * Divides them into pipe and non-pipe functions.
     */
    public loadFunctions(): void {
        this.isLoadingFunctions = true;
        this.backend.getRequest('module/OutputTemplates/templateFunctions')
            .pipe(take(1))
            .subscribe(response => {
                this.allFunctions = response;
                this.language.sortObjects( this.allFunctions.pipe, 'name' );
                this.language.sortObjects( this.allFunctions.noPipe, 'name' );
                this.isLoadingFunctions = false;
                this.buildOfferedFunctions();
            });
    }

    /**
     * Either the pipe or the non-pipe functions have to be offered for selection,
     * depends on whether a field or function has already been selected or nothing.
     */
    public buildOfferedFunctions(): void {
        if ( this.fieldResult || this.functionResult ) this.offeredFunctions = this.allFunctions.pipe;
        else this.offeredFunctions = this.allFunctions.noPipe;
    }

    /**
     * Close the modal.
     */
    public close(): void {
        this.self.destroy();
    }

    /**
     * Cancel button clicked.
     */
    public cancel(): void {
        this.close();
    }

    /**
     * Escape or X from the modal.
     */
    public onModalEscX(): void {
        this.cancel();
    }

    /**
     * OK button clicked:
     * Submit (to the rich text editor) the field name (with its path) and the selected function names,
     * joined by a pipe symbol. At last close the modal.
     */
    public submit(): void {
        let back;
        if ( !this.fieldResult && !this.functionResultWithParams ) back = '';
        if ( !this.fieldResult && this.functionResultWithParams ) back = 'func.'+this.functionResultWithParams;
        else {
            back = this.fieldResult;
            if ( this.functionResultWithParams ) back += '|' + this.functionResultWithParams;
        }
        this.response.emit( back );
        this.close();
    }

    /**
     * Loads the fields for a given module.
     */
    public getModuleFields( forModule, rootModule ) {
        this.moduleFields[rootModule] = [];
        this.isLoadingModuleFields = true;
        this.cdr.detectChanges();
        this.backend.getRequest('dictionary/browser/' + forModule + '/fields')
            .pipe(take(1))
            .subscribe(items => {
                this.moduleFields[rootModule] = items.filter(item => item.type != 'relate' && item.source != 'non-db');
                this.isLoadingModuleFields = false;
            });
    }

    /**
     * Narrow down the fields according the filter value.
     */
    public getFilteredFields( fields ): any[] {
        return !this.fieldFilter ? fields : fields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.fieldFilter.toLowerCase()) ||
                    (nodeFiled.label && this.language.getLabel(nodeFiled.label).toLowerCase().includes(this.fieldFilter.toLowerCase()));
            });
    }

    /**
     * Track changes for items in the iterable.
     */
    public trackByFn(index, item) {
        return index;
    }

    /**
     * One of the 3 module tabs has beed clicked.
     */
    public setActiveModuleTab( templateObjectName ): void {
        this.activeModule = templateObjectName;
    }

    /**
     * An item of the module tree has been selected.
     */
    public treeItemSelected( data, rootModule ): void {
        this.modulePathFromTree = data.path;
        this.getModuleFields(data.module, rootModule);
    }

    /**
     * Undoes the last selection of a system template function.
     */
    public functionUndo(): void {
        if ( this.functionHistory.length ) {
            let popped = this.functionHistory.pop();
            this.functionResult = popped.result;
            this.actualFunctionParams = popped.params;
            this.buildOfferedFunctions();
        }
    }

    /**
     * Paranthesis for the param in the result?
     */
    public isTypeString( type: string ): boolean {
        switch( type ) {
            case 'string':
            case 'color': return true;
        }
        return false;
    }

    /**
     * Getter for the function result string incl. the parameters (seperated by ':').
     */
    public get functionResultWithParams() {
        let result = this.functionResult;
        this.actualFunctionParams.forEach( item => {
            result += ':';
            if (( item.type === 'color' && item.value === '#000000' ) || item.value === undefined || item.value === '' ) return;
            result += ( this.isTypeString( item.type ) ? "'"+item.value+"'" : item.value );
        });
        result = result.replace(/:+$/g, '');
        return result;
    }

    /**
     * Fills the field with the function result.
     * And updates the offered functions (because now the pipe functions have to be displayed).
     */
    public functionSelected( func ): void {
        this.functionHistory.push({
            result: this.functionResult,
            params: this.actualFunctionParams
        });
        this.functionResult = this.functionResultWithParams;
        if ( this.functionResult ) this.functionResult += '|';
        this.functionResult += func.name;
        this.actualFunctionParams = func.paramConfigs ? JSON.parse(JSON.stringify(func.paramConfigs)) : [];
        this.buildOfferedFunctions();
    }

    /**
     * Fills the field with the field result.
     * And updates the offered functions (because now the pipe functions have to be displayed).
     */
    public fieldSelected( field: string ): void {
        let parts = this.modulePathFromTree.split(/::/);
        let simplePath = []; // The elements for the path with the syntax the template compiler needs.
        for ( let i = 1; i < parts.length; i++ ) {
            simplePath.push( parts[i].split(':').pop() );
        }
        let joined = simplePath.join('.'); // The path with the syntax the template compiler needs.
        if ( joined ) joined += '.';
        if ( this.activeModule.indexOf('bean.',0) !== -1 ) {
            this.fieldResult = 'bean.'+joined+field;
        } else {
            switch( this.activeModule ) {
                case 'current_user':
                    this.fieldResult = 'current_user.' + joined + field;
                    break;
                case 'template':
                    this.fieldResult = 'template.' + joined + field;
                    break;
            }
        }
        this.buildOfferedFunctions();
    }

    /**
     * Clears the field with the field result.
     * And updates the offered functions (because now the non-pipe functions have to be displayed).
     */
    public clearFieldResult() {
        this.fieldResult = '';
        this.buildOfferedFunctions();
    }

}
