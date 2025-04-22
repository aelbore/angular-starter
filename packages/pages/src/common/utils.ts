import { Injector, assertInInjectionContext, inject, runInInjectionContext } from '@angular/core'

export function assertInjector(
	fn: Function,
	injector: Injector | undefined | null,
	runner?: () => any,
) {
	!injector && assertInInjectionContext(fn);
	const assertedInjector = injector ?? inject(Injector)

	if (!runner) return assertedInjector;
	return runInInjectionContext(assertedInjector, runner) as Injector
}

export const createUrl = (type: string) => {
  return `/api/powersearch/${type}/Search`
}