import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/i18n/translation.service';
import { Translation } from '../../core/i18n/translations/en';

type DeepValue<T, K extends string> =
  K extends `${infer A}.${infer B}`
    ? A extends keyof T ? DeepValue<T[A], B> : never
    : K extends keyof T ? T[K] : never;

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly svc = inject(TranslationService);

  transform(key: string): string {
    const parts = key.split('.');
    let node: unknown = this.svc.t();
    for (const part of parts) {
      if (node && typeof node === 'object' && part in (node as object)) {
        node = (node as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    return typeof node === 'string' ? node : key;
  }
}
