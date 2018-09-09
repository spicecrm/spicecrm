import {CommonModule} from '@angular/common';
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges, Pipe} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule}   from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';

import {Subject, Observable} from 'rxjs';


import {loginService, loginCheck} from '../../services/login.service';
import {metadata, aclCheck} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modelutilities} from '../../services/modelutilities.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {assistant} from '../../services/assistant.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {toast} from '../../services/toast.service';
import {fts} from '../../services/fts.service';
import {configurationService} from '../../services/configuration.service';
import {mediafiles} from '../../services/mediafiles.service';
import {modal} from '../../services/modal.service';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {GlobalUtilityComponents}      from '../../globalutilitycomponents/globalutilitycomponents';
import {ModuleMediaFiles}      from '../mediafiles/modulemediafiles';

import /*embed*/ {QuestionsManager} from './components/questionsmanager';
import /*embed*/ {QuestionsManagerEditMulti} from "./components/questionsmanagereditmulti";
import /*embed*/ {QuestionsManagerAddModal} from './components/questionsmanageraddmodal';
import /*embed*/ {QuestionsetTypeParameters} from './components/questionsettypeparameters';
import /*embed*/ {QuestionsetTypeParametersRating} from './components/questionsettypeparametersrating';
import /*embed*/ {QuestionsetTypeParametersText} from './components/questionsettypeparameterstext';
import /*embed*/ {QuestionsManagerEditRating} from './components/questionsmanagereditrating';
import /*embed*/ {QuestionsManagerEditBinary} from "./components/questionsmanagereditbinary";
import /*embed*/ {QuestionsManagerEditBinaryOption} from "./components/questionsmanagereditbinaryoption";
import /*embed*/ {QuestionsManagerEditSingle} from "./components/questionsmanagereditsingle";
import /*embed*/ {QuestionsManagerEditText} from "./components/questionsmanageredittext";
import /*embed*/ {QuestionsManagerEditIst} from "./components/questionsmanagereditist";
import /*embed*/ {QuestionsManagerEditOptionIst} from "./components/questionsmanagereditoptionist";
import /*embed*/ {QuestionsManagerEditOptionSingleMulti} from "./components/questionsmanagereditoptionsinglemulti";
import /*embed*/ {QuestionnairePreviewButton} from './components/questionnairepreviewbutton';
import /*embed*/ {QuestionnairePreview} from './components/questionnairepreview';
import /*embed*/ {QuestionnaireRender} from './components/questionnairerender';
import /*embed*/ {QuestionsetPreviewButton} from './components/questionsetpreviewbutton';
import /*embed*/ {QuestionsetPreview} from './components/questionsetpreview';
import /*embed*/ {QuestionsetRender} from './components/questionsetrender';
import /*embed*/ {QuestionsetRenderRating} from './components/questionsetrenderrating';
import /*embed*/ {QuestionsetRenderText} from './components/questionsetrendertext';
import /*embed*/ {QuestionsetRenderIST, QuestionTypeISTTextPipe, QuestionTypeISTOptionsPipe} from './components/questionsetrenderist';
import /*embed*/ {QuestionsetCategoryPool} from './components/questionsetcategorypool';
import /*embed*/ {QuestionsManagerEditCategories} from './components/questionsmanagereditcategories';
import /*embed*/ {QuestionnaireEvaluation} from './components/questionnaireevaluation';
import /*embed*/ {QuestionnaireEvaluationDefault} from './components/questionnaireevaluationdefault';
import /*embed*/ {QuestionnaireEvaluationBar} from './components/questionnaireevaluationbar';
import /*embed*/ {QuestionnaireEvaluationSpiderweb} from './components/questionnaireevaluationspiderweb';
import /*embed*/ {QuestionnaireInterpretationCategories} from './components/questionnaireinterpretationcategories';
import /*embed*/ {QuestionnaireInterpretationAssignment} from './components/questionnaireinterpretationassignment';
import /*embed*/ {QuestionsetRenderBinarySingleMulti} from './components/questionsetrenderbinarysinglemulti';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents,
        ModuleMediaFiles
    ],
    declarations: [
        QuestionsManager,
        QuestionsManagerAddModal,
        QuestionsetTypeParameters,
        QuestionsetTypeParametersRating,
        QuestionsetTypeParametersText,
        QuestionsManagerEditRating,
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
        QuestionsetRenderIST,
        QuestionsetRenderRating,
        QuestionsetRenderText,
        QuestionsetRenderBinarySingleMulti,
        QuestionTypeISTTextPipe,
        QuestionTypeISTOptionsPipe,
        QuestionnairePreviewButton,
        QuestionnairePreview,
        QuestionnaireRender,
        QuestionsetCategoryPool,
        QuestionsManagerEditCategories,
        QuestionnaireEvaluation,
        QuestionnaireEvaluationDefault,
        QuestionnaireEvaluationBar,
        QuestionnaireEvaluationSpiderweb,
        QuestionnaireInterpretationCategories,
        QuestionnaireInterpretationAssignment
    ]
})
export class ModuleQuestionnaires {}