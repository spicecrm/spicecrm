import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {AttributeObjectI, SocialMediaElementI, SocialMediaI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";
import {firstValueFrom} from "rxjs";

@Component({
    selector: 'spice-page-builder-element-social',
    templateUrl: '../templates/spicepagebuilderelementsocial.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpicePageBuilderElementSocial extends SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public declare element: SocialMediaI;
    /**
     * holds the info if the styles panel is expanded
     */
    public styleExpanded: boolean = false;
    /**
     * holds the info if the element styles panel is expanded
     */
    public elementStylesExpanded: string;
    /**
     * holds the children styles in object
     */
    public childrenStyles: {[name: string]: any} = {};
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[][] = [
        [
            {name: 'mode', type: 'options', class: 'slds-size--1-of-4', options: [{label: 'LBL_HORIZONTAL', value: 'horizontal'}, {label: 'LBL_VERTICAL', value: 'vertical'}]},
            {name: 'icon-size', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'container-background-color', type: 'color', class: 'slds-size--1-of-4'},
            {name: 'color', type: 'color', class: 'slds-size--1-of-4'},
        ],
        [
            {name: 'padding', type: 'padding', class: 'slds-size--1-of-2'},
            {name: 'inner-padding', type: 'padding', class: 'slds-size--1-of-2'},
        ],
        [
            {name: 'icon-padding', type: 'padding', class: 'slds-size--1-of-2'},
            {name: 'text-padding', type: 'padding', class: 'slds-size--1-of-2'},
        ],
        [
            {name: 'border', type: 'borders', class: 'slds-size--1-of-2'},
        ],
        [
            {name: 'align', type: 'halign', class: 'slds-size--1-of-4'},
            {name: 'css-class', type: 'text', class: 'slds-size--1-of-4'},
        ],
        [
            {name: 'font-size', type: 'text', class: 'slds-size--1-of-3'},
            {name: 'font-style', type: 'fontstyle', class: 'slds-size--1-of-3'},
            {name: 'font-weight', type: 'fontweight', class: 'slds-size--1-of-3'},
        ],
        [
            {name: 'font-family', type: 'text', class: 'slds-size--1-of-3'},
            {name: 'text-decoration', type: 'text', class: 'slds-size--1-of-3'},
            {name: 'line-height', type: 'text', class: 'slds-size--1-of-3'},
        ]
    ];

    /**
     * holds element attributes list
     */
    public readonly attributesListElement: AttributeObjectI[][] = [
        [
            {name: 'background-color', type: 'color', class: 'slds-size--1-of-4'},
            {name: 'color', type: 'color', class: 'slds-size--1-of-4'},
            {name: 'target', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'title', type: 'text', class: 'slds-size--1-of-4'},
        ],
        [
            {name: 'rel', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'srcset', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'sizes', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'icon-position', type: 'options', class: 'slds-size--1-of-4', options: [{label: 'LBL_LEFT', value: 'left'}, {label: 'LBL_RIGHT', value: 'right'}]},
        ],
        [
            {name: 'border', type: 'borders', class: 'slds-size--1-of-2'},
            {name: 'css-class', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'align', type: 'halign', class: 'slds-size--1-of-4'},
        ],
    ];

    /**
     * @return string editor style
     */
    get editorStyle() {
        if (this.styleExpanded) {
            return {
                height: '50%'
            }
        } else {
            return {
                height: 'calc(100% - 70px)'
            }
        }
    }

    /**
     * set initial values 
     */
    public ngOnInit() {
        super.ngOnInit();
        if (this.element.children.length == 0 && this.isEditMode) {
            this.addMedia();
        }
    }
    /**
     * generate body style object
     * @param pickList
     */
    public generateStyle(pickList?: string[]) {
        super.generateStyle(pickList);

        this.style['flex-direction'] = this.element.attributes.mode == 'horizontal' ? 'row' : 'column';
        this.style['justify-content'] = this.element.attributes.align == 'left' ? 'start' : this.element.attributes.align == 'right' ? 'end' : 'center';
        this.style['align-items'] = this.style['justify-content'];

        this.childrenStyles = {};

        this.element.children.forEach(child => {

            this.childrenStyles[child.attributes.name] = {
                container: {
                    'color': child.attributes['color'],
                    'border': child.attributes['border'],
                    'align-items': child.attributes['vertical-align'] == 'middle' ? 'center' : child.attributes['vertical-align'] == 'top' ? 'start' : 'end',
                },
                icon: {
                    'width': this.element.attributes['icon-size'],
                    'height': this.element.attributes['icon-size'],
                },
                iconContainer: {
                    'background-color': child.attributes['background-color'],
                    'padding': this.element.attributes['icon-padding'],
                    'border-radius': child.attributes['border-radius'],
                },
                text: {
                    'padding': this.element.attributes['text-padding'],
                    color: child.attributes['color'],
                }
            };
        });
    }

    /**
     * add new social media icon
     */
    public addMedia() {
        const options = this.spicePageBuilderService.predefinedSocialMedia
            .filter(option => option.name == 'custom' || !this.element.children.some(child => child.attributes.name == option.name))
            .map(option => ({value: option.name, display: option.name}));

        let selectOptionFn = () => firstValueFrom(this.modal.prompt('input', '', 'LBL_MAKE_SELECTION', null, null, options, 'radio'));

        if (options.length == 1) {
            selectOptionFn = () => Promise.resolve(options[0].value);
        }

        selectOptionFn().then(name => {

            if (!name) return;

            const media = this.spicePageBuilderService.predefinedSocialMedia.find(media => media.name == name);
            const generateChildFn = (name: string, src: string, color: string) => ({
                content: '',
                tagName: 'social-element',
                attributes: {
                    href: 'https://', src: src, name: name,
                    'background-color': color,
                    'vertical-align': 'middle',
                    'text-padding': '4px 4px 4px 0',
                    'border-radius': '3px'
                }
            });

            if (name == 'custom') {
                this.modal.input('', 'icon url').subscribe(url => {

                    if (!url) return;

                    this.element.children.push(
                        generateChildFn(media.name, url, media.background)
                    );

                    this.cdRef.detectChanges();
                });
            } else {
                this.element.children.push(
                    generateChildFn(media.name, media.icon, media.background)
                );
                this.cdRef.detectChanges();
            }
        });

    }

    /**
     * delete child by name
     * @param index
     */
    public deleteChild(index: number) {
        this.element.children.splice(index, 1);
        this.cdRef.detectChanges();
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {

        this.element.children = res.children;
        super.handleEditResponse(res);
    }
}