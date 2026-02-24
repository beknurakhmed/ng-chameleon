import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate(): boolean | Observable<boolean>;
}

/**
 * UnsavedChangesGuard — asks user to confirm navigation when form has unsaved changes.
 *
 * Usage:
 *   { path: 'form', component: MyFormComponent, canDeactivate: [UnsavedChangesGuard] }
 *
 * Component must implement CanComponentDeactivate:
 *   canDeactivate(): boolean { return !this.form.dirty; }
 */
@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> {
    if (!component.canDeactivate || component.canDeactivate()) {
      return true;
    }
    return window.confirm('You have unsaved changes. Leave anyway?');
  }
}
