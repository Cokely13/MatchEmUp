import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import singleMovieReducer from './singleMovieStore'
import singleActorReducer from './singleActorStore'
import actorsReducer from './allActorsStore'
import moviesReducer from './allMoviesStore'
import singleQuarterbackReducer from './singleQuarterbackStore'
import allQuarterbacksReducer from './allQuarterbacksStore'
import allReceiversReducer from './allReceiverStore'
import singleReceiverReducer from './singleReceiverStore'
import allArtistsReducer from './allArtistsStore'
import allAlbumsReducer from './allAlbumsStore'
import singleFranchiseReducer from './singleFranchiseStore'
import singlePlayerReducer from './singlePlayerStore'
import franchisesReducer from './allFranchisesStore'
import playersReducer from './allPlayersStore'
import singleCityReducer from './singleCityStore'
import singleStateReducer from './singleStateStore'
import citiesReducer from './allCitiesStore'
import statesReducer from './allStatesStore'
import showsReducer from './allShowsStore'
import charactersReducer from './allCharactersStore'
import singleShowReducer from './singleShowStore'
import singleCharacterReducer from './singleCharacterStore'
import usersReducer from './allUsersStore'
import singleUserReducer from './singleUserStore'

const reducer = combineReducers({ auth,
singleActor: singleActorReducer,
allActors: actorsReducer,
allMovies: moviesReducer,
singleMovie: singleMovieReducer,
singleQuarterback: singleQuarterbackReducer,
allQuarterbacks: allQuarterbacksReducer,
allReceivers: allReceiversReducer,
singleReceiver: singleReceiverReducer,
allArtists: allArtistsReducer,
allAlbums: allAlbumsReducer,
allFranchises: franchisesReducer,
singleFranchise: singleFranchiseReducer,
allPlayers: playersReducer,
singlePlayer: singlePlayerReducer,
singleCity: singleCityReducer,
singleState: singleStateReducer,
allCities: citiesReducer,
allStates: statesReducer,
allShows: showsReducer,
singleShow: singleShowReducer,
allCharacters: charactersReducer,
allShows: showsReducer,
singleCharacter: singleCharacterReducer,
allUsers: usersReducer,
singleUser: singleUserReducer
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
