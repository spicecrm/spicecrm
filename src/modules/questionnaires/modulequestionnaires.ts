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

import {questionnaireParticipationService} from "./services/questionnaireparticipation.service";

import {QuestionsManager} from './components/questionsmanager';
import {QuestionsetTypeParameters} from './components/questionsettypeparameters';
import {QuestionsetTypeParametersRating} from './components/questionsettypeparametersrating';
import {QuestionsetTypeParametersNPS} from './components/questionsettypeparametersnps';
import {QuestionsetTypeParametersText} from './components/questionsettypeparameterstext';
import {QuestionsManagerEditBasic} from './components/questionsmanagereditbasic';
import {QuestionsManagerEditBasicWithOptions} from './components/questionsmanagereditbasicwithoptions';
import {QuestionsManagerEditMulti} from "./components/questionsmanagereditmulti";
import {QuestionsManagerEditRating} from './components/questionsmanagereditrating';
import {QuestionsManagerEditNPS} from './components/questionsmanagereditnps';
import {QuestionsManagerEditBinary} from "./components/questionsmanagereditbinary";
import {QuestionsManagerEditBinaryOption} from "./components/questionsmanagereditbinaryoption";
import {QuestionsManagerEditSingle} from "./components/questionsmanagereditsingle";
import {QuestionsManagerEditText} from "./components/questionsmanageredittext";
import {QuestionsManagerEditIst} from "./components/questionsmanagereditist";
import {QuestionsManagerEditOptionIst} from "./components/questionsmanagereditoptionist";
import {QuestionsManagerEditOptionSingleMulti} from "./components/questionsmanagereditoptionsinglemulti";
import {QuestionsManagerAddModal} from './components/questionsmanageraddmodal';
import {QuestionnairePreviewButton} from './components/questionnairepreviewbutton';
import {QuestionnairePreview} from './components/questionnairepreview';
import {QuestionnaireRender} from './components/questionnairerender';
import {QuestionsetPreviewButton} from './components/questionsetpreviewbutton';
import {QuestionsetPreview} from './components/questionsetpreview';
import {QuestionsetRender} from './components/questionsetrender';
import {QuestionsetRenderBasic} from './components/questionsetrenderbasic';
import {QuestionsetRenderRating} from './components/questionsetrenderrating';
import {QuestionnaireCategoryPool} from './components/questionnairecategorypool';
import {QuestionsManagerEditCategories} from './components/questionsmanagereditcategories';
import {QuestionnaireEvaluation} from './components/questionnaireevaluation';
import {QuestionnaireEvaluationDefault} from './components/questionnaireevaluationdefault';
import {QuestionnaireEvaluationBar} from './components/questionnaireevaluationbar';
import {QuestionnaireEvaluationSpiderweb} from './components/questionnaireevaluationspiderweb';
import {QuestionnaireInterpretationCategories} from './components/questionnaireinterpretationcategories';
import {QuestionnaireInterpretationAssignment} from './components/questionnaireinterpretationassignment';
import {QuestionnaireEditor} from './components/questionnaireeditor';
import {QuestionnaireEditorQuestionsetAdd} from './components/questionnaireeditorquestionsetadd';
import {QuestionsetManager} from './components/questionsetmanager';
import {QuestionnaireResults} from './components/questionnaireresults';
import {QuestionnaireSingleEvaluationValues} from './components/questionnairesingleevaluationvalues';
import {QuestionnaireEntireEvaluation} from './components/questionnaireentireevaluation';
import {QuestionnaireFillOutButton} from './components/questionnairefilloutbutton';
import {QuestionnaireFillOutModal} from './components/questionnairefilloutmodal';
import {QuestionRenderBasic} from './components/questionrenderbasic';
import {QuestionRenderHeader} from './components/questionrenderheader';
import {QuestionRenderRadioButton} from './components/questionrenderradiobutton';
import {QuestionRenderCheckbox} from './components/questionrendercheckbox';
import {QuestionRenderIST, QuestionTypeISTTextPipe, QuestionTypeISTOptionsPipe} from './components/questionrenderist';
import {QuestionRenderRating} from './components/questionrenderrating';
import {QuestionRenderText} from './components/questionrendertext';
import {QuestionRenderNPS} from './components/questionrendernps';
import {QuestionsManagerEditRatingGroup} from './components/questionsmanagereditratinggroup';
import {fieldQuestionnaire} from './fields/fieldquestionnaire';
import {QuestionnaireFillOutActionItem} from './components/QuestionnaireFillOutActionItem';
import {QuestionRenderSingle} from "./components/questionrendersingle";
import {QuestionRenderBinary} from "./components/questionrenderbinary";
import {QuestionRenderMulti} from "./components/questionrendermulti";

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
        QuestionRenderHeader,
        QuestionRenderRadioButton,
        QuestionRenderCheckbox,
        QuestionRenderSingle,
        QuestionRenderBinary,
        QuestionRenderMulti,
        QuestionRenderText,
        QuestionRenderRating,
        QuestionRenderNPS,
        QuestionRenderIST,
        QuestionsManagerEditRatingGroup,
        fieldQuestionnaire,
        QuestionnaireFillOutActionItem
    ],
    exports: [ QuestionnaireFillOutActionItem ]
})
export class ModuleQuestionnaires {}
