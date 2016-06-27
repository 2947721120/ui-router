import {isString, isFunction} from "../common/predicates"
import {Transition} from "../transition/transition";
import {services} from "../common/coreservices";
import {TargetState} from "../state/targetState";

/**
 * A hook that redirects to a different state or params
 *
 * See [[StateDeclaration.redirectTo]]
 */
export const redirectToHook = (trans: Transition) => {
  let redirect = trans.to().redirectTo;
  if (!redirect) return;

  function handleResult(result) {
    let $state = trans.router.stateService;

    if (result instanceof TargetState) return result;
    if (isString(result)) return $state.target(<any> result, trans.params(), trans.options());
    if (result['state'] || result['params'])
      return $state.target(result['state'] || trans.to(), result['params'] || trans.params(), trans.options());
  }

  if (isFunction(redirect)) {
    return services.$q.when(redirect(trans)).then(handleResult);
  }
  return handleResult(redirect);
};