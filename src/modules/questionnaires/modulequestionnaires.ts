/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleQuestionnaires
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {ModuleMediaFiles} from '../../modules/mediafiles/modulemediafiles';
import {DirectivesModule} from '../../directives/directives';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";

import /*embed*/ {questionnaireParticipationService} from "./services/questionnaireparticipation.service";

import /*embed*/ {QuestionsManager} from './components/questionsmanager';
import /*embed*/ {QuestionsetTypeParameters} from './components/questionsettypeparameters';
import /*embed*/ {QuestionsetTypeParametersRating} from './components/questionsettypeparametersrating';
import /*embed*/ {QuestionsetTypeParametersNPS} from './components/questionsettypeparametersnps';
import /*embed*/ {QuestionsetTypeParametersText} from './components/questionsettypeparameterstext';
import /*embed*/ {QuestionsManagerEditBasic} from './components/questionsmanagereditbasic';
import /*embed*/ {QuestionsManagerEditBasicWithOptions} from './components/questionsmanagereditbasicwithoptions';
import /*embed*/ {QuestionsManagerEditMulti} from "./components/questionsmanagereditmulti";
import /*embed*/ {QuestionsManagerEditRating} from './components/questionsmanagereditrating';
import /*embed*/ {QuestionsManagerEditNPS} from './components/questionsmanagereditnps';
import /*embed*/ {QuestionsManagerEditBinary} from "./components/questionsmanagereditbinary";
import /*embed*/ {QuestionsManagerEditBinaryOption} from "./components/questionsmanagereditbinaryoption";
import /*embed*/ {QuestionsManagerEditSingle} from "./components/questionsmanagereditsingle";
import /*embed*/ {QuestionsManagerEditText} from "./components/questionsmanageredittext";
import /*embed*/ {QuestionsManagerEditIst} from "./components/questionsmanagereditist";
import /*embed*/ {QuestionsManagerEditOptionIst} from "./components/questionsmanagereditoptionist";
import /*embed*/ {QuestionsManagerEditOptionSingleMulti} from "./components/questionsmanagereditoptionsinglemulti";
import /*embed*/ {QuestionsManagerAddModal} from './components/questionsmanageraddmodal';
import /*embed*/ {QuestionnairePreviewButton} from './components/questionnairepreviewbutton';
import /*embed*/ {QuestionnairePreview} from './components/questionnairepreview';
import /*embed*/ {QuestionnaireRender} from './components/questionnairerender';
import /*embed*/ {QuestionsetPreviewButton} from './components/questionsetpreviewbutton';
import /*embed*/ {QuestionsetPreview} from './components/questionsetpreview';
import /*embed*/ {QuestionsetRender} from './components/questionsetrender';
import /*embed*/ {QuestionsetRenderBasic} from './components/questionsetrenderbasic';
import /*embed*/ {QuestionsetRenderRating} from './components/questionsetrenderrating';
import /*embed*/ {QuestionnaireCategoryPool} from './components/questionnairecategorypool';
import /*embed*/ {QuestionsManagerEditCategories} from './components/questionsmanagereditcategories';
import /*embed*/ {QuestionnaireEvaluation} from './components/questionnaireevaluation';
import /*embed*/ {QuestionnaireEvaluationDefault} from './components/questionnaireevaluationdefault';
import /*embed*/ {QuestionnaireEvaluationBar} from './components/questionnaireevaluationbar';
import /*embed*/ {QuestionnaireEvaluationSpiderweb} from './components/questionnaireevaluationspiderweb';
import /*embed*/ {QuestionnaireInterpretationCategories} from './components/questionnaireinterpretationcategories';
import /*embed*/ {QuestionnaireInterpretationAssignment} from './components/questionnaireinterpretationassignment';
import /*embed*/ {QuestionnaireEditor} from './components/questionnaireeditor';
import /*embed*/ {QuestionnaireEditorQuestionsetAdd} from './components/questionnaireeditorquestionsetadd';
import /*embed*/ {QuestionsetManager} from './components/questionsetmanager';
import /*embed*/ {QuestionnaireResults} from './components/questionnaireresults';
import /*embed*/ {QuestionnaireSingleEvaluationValues} from './components/questionnairesingleevaluationvalues';
import /*embed*/ {QuestionnaireEntireEvaluation} from './components/questionnaireentireevaluation';
import /*embed*/ {QuestionnaireFillOutButton} from './components/questionnairefilloutbutton';
import /*embed*/ {QuestionnaireFillOutModal} from './components/questionnairefilloutmodal';
import /*embed*/ {QuestionRenderBasic} from './components/questionrenderbasic';
import /*embed*/ {QuestionRenderIST, QuestionTypeISTTextPipe, QuestionTypeISTOptionsPipe} from './components/questionrenderist';
import /*embed*/ {QuestionRenderRating} from './components/questionrenderrating';
import /*embed*/ {QuestionRenderText} from './components/questionrendertext';
import /*embed*/ {QuestionRenderNPS} from './components/questionrendernps';
import /*embed*/ {QuestionRenderBinarySingleMulti} from './components/questionrenderbinarysinglemulti';
import /*embed*/ {QuestionsManagerEditRatingGroup} from './components/questionsmanagereditratinggroup';
import /*embed*/ {fieldQuestionnaire} from './fields/fieldquestionnaire';

@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        ModuleMediaFiles,
        DirectivesModule, DragDropModule
    ],
    declarations: [
        QuestionsManager,
        QuestionsManagerAddModal,
        QuestionsetTypeParameters,
        QuestionsetTypeParametersRating,
        QuestionsetTypeParametersNPS,
        QuestionsetTypeParametersText,
        QuestionsManagerEditBasic,
        QuestionsManagerEditBasicWithOptions,
        QuestionsManagerEditRating,
        QuestionsManagerEditNPS,
        QuestionsManagerEditBinary,
        QuestionsManagerEditBinaryOption,
        QuestionsManagerEditSingle,
        QuestionsManagerEditMulti,
        QuestionsManagerEditText,
        QuestionsManagerEditIst,
        QuestionsManagerEditOptionIst,
        QuestionsManagerEditOptionSingleMulti,
        QuestionsetPreviewButton,
        QuestionsetPreview,
        QuestionsetRender,
        QuestionsetRenderBasic,
        QuestionsetRenderRating,
        QuestionTypeISTTextPipe,
        QuestionTypeISTOptionsPipe,
        QuestionnairePreviewButton,
        QuestionnairePreview,
        QuestionnaireRender,
        QuestionnaireCategoryPool,
        QuestionsManagerEditCategories,
        QuestionnaireEditor,
        QuestionnaireEditorQuestionsetAdd,
        QuestionsetManager,
        QuestionnaireEvaluation,
        QuestionnaireEvaluationDefault,
        QuestionnaireEvaluationBar,
        QuestionnaireEvaluationSpiderweb,
        QuestionnaireInterpretationCategories,
        QuestionnaireInterpretationAssignment,
        QuestionnaireResults,
        QuestionnaireSingleEvaluationValues,
        QuestionnaireEntireEvaluation,
        QuestionnaireFillOutButton,
        QuestionnaireFillOutModal,
        QuestionRenderBasic,
        QuestionRenderText,
        QuestionRenderRating,
        QuestionRenderNPS,
        QuestionRenderIST,
        QuestionRenderBinarySingleMulti,
        QuestionsManagerEditRatingGroup,
        fieldQuestionnaire
    ]
})
export class ModuleQuestionnaires {}
