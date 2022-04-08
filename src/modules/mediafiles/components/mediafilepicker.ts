/**
 * @module ObjectComponents
 */
import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {layout} from '../../../services/layout.service';

import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'media-file-picker',
    templateUrl: '../templates/mediafilepicker.html',
    providers: [view, modellist, model]
})
export class MediaFilePicker extends ObjectModalModuleLookup {

    /**
     * set the module fixed to MediaFiles
     */
    public module = 'MediaFiles';

    /**
     * event emitter for the response
     */
    @Output() public answer: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout, public elementRef: ElementRef) {
        super(language, modellist, metadata, modelutilities, model, layout);
    }

    /**
     * gets the padding for the tiles container
     */
    get containerStyle() {
        let bbox = this.elementRef.nativeElement.getBoundingClientRect();
        let count = Math.floor((bbox.width - 10) / 320);
        let padding = Math.floor(((bbox.width - 10) - count * 320) / 2);
        return {
            'padding-left': padding + 'px',
            'padding-right': padding + 'px'
        };
    }

    /**
     * delibvers the pick event if an image is picked
     *
     * @param item
     */
    public pick(item): void {
        this.answer.emit({id: item});
        this.self.destroy();
    }

    /**
     * adds a new model
     */
    public upload(): void {
        if (!this.metadata.checkModuleAcl('MediaFiles','create')) {
            return;
        }
        this.model.module = 'MediaFiles';
        this.model.id = undefined;
        this.model.initialize();
        this.model.addModel().subscribe(data => {
            this.answer.emit({id: this.model.id});
            this.self.destroy();
        });
    }

}
