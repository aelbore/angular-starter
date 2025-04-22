import { assertInInjectionContext, computed, inject, Injector, runInInjectionContext, Signal, untracked } from '@angular/core'

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

export const computedPrevious = <T>(s: Signal<T>) => {
  let current = null as T
  let previous = untracked(() => s())
  return computed(() => {
    current = s()
    const result = previous
    previous = current
    return result
  }) 
}