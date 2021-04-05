/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * container element to be rendered in the view
 */
export interface TagElementI {
    tagName: string;
    attributes: any;
    children: any[];
}
/**
 * body element that will be rendered in the view
 * More details: https://mjml.io/documentation/#mj-body
 */
export interface BodyI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'width'?: string,
        'css-class'?: string
    };
}
/**
 * section element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-section
 */
export interface SectionI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'background-repeat'?: string,
        'background-size'?: string,
        'background-url'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'padding'?: string,
        'css-class'?: string,
        'direction'?: string,
        'full-width'?: string,
        'text-align'?: string
    };
}
/**
 * column element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-column
 */
export interface ColumnI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'width'?: string,
        'vertical-align'?: string,
        'padding'?: string,
        'css-class'?: string
    };
}
/**
 * content element to be rendered in the view
 */
export interface ContentElementI {
    tagName: string;
    attributes: any;
}
/**
 * divider element to be rendered in the view
 */
export interface DividerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'border-color'?: string,
        'border-style'?: string,
        'border-width'?: string,
        'padding'?: string,
        'css-class'?: string,
        'width'?: string
    };
}
/**
 * button element to be rendered in the view
 */
export interface ButtonI extends ContentElementI {
    content: string;
    attributes: {
        'href': string,
        'align': string,
        'background-color'?: string,
        'container-background-color'?: string,
        'color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'inner-padding'?: string,
        'text-align'?: string,
        'vertical-align'?: string,
        'css-class'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'letter-spacing'?: string,
        'line-height'?: string,
        'rel'?: string,
        'target'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'width'?: string
    };
}
/**
 * image element to be rendered in the view
 */
export interface ImageI extends ContentElementI {
    attributes: {
        'href?': string,
        'align?': string,
        'alt'?: string,
        'src': string,
        'title'?: string,
        'border'?: string,
        'border-radius'?: string,
        'container-background-color'?: string,
        'height'?: string,
        'padding'?: string,
        'css-class'?: string,
        'fluid-on-mobile'?: 'true'|'false',
        'rel'?: string,
        'srcset'?: string,
        'target'?: string,
        'width'?: string
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface SpacerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'height': string,
        'padding': string,
        'css-class': string,
        'vertical-align': string,
        'width'?: string
    };
}
/**
 * text element to be rendered in the view
 */
export interface TextI extends ContentElementI {
    content: string;
    attributes: {
        'color'?: string,
        'container-background-color'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'line-height'?: string,
        'letter-spacing'?: string,
        'height'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'align'?: string,
        'padding'?: string,
        'css-class'?: string
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface HTMLCodeI extends ContentElementI {
    content: string;
}
/**
 * available panel element
 */
export interface PanelElementI extends ContentElementI {
    icon: string;
    label: string;
    content?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface EditorAttributeI {
    name: string;
    type: string;
    label?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface AttributeObjectI {
    name: string;
    type: 'color'|'text'|'sides'|'textSuffix';
}











































































