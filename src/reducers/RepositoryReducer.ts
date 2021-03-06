import {
  RepositoryState,
  generateRepositoryStateFromResponse
} from "../states/RepositoriesState";
import { Action } from "redux";
import * as Actions from "../actions/FetchAction";

export function repositoryReducer(state?: RepositoryState, action?: Action) {
  if (!state) {
    return RepositoryState
      ? new RepositoryState()
      : ({ repositories: [] } as any);
  }
  if (action) {
    switch (action.type) {
      case "FETCH": {
        const fetchAction = action as Actions.FetchAction;
        return generateRepositoryStateFromResponse(
          fetchAction.repositoriesResponse
        );
      }
    }
  }
  return state;
}
