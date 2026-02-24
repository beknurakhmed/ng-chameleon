import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CHAMELEON_COMPONENTS } from 'ng-chameleon';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { LangSwitcherComponent }  from './components/lang-switcher/lang-switcher.component';
import { TranslatePipe }          from './pipes/translate.pipe';

@NgModule({
  declarations: [
    ThemeSwitcherComponent,
    LangSwitcherComponent,
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...CHAMELEON_COMPONENTS,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
    LangSwitcherComponent,
    TranslatePipe,
    ...CHAMELEON_COMPONENTS,
  ],
})
export class SharedModule {}
