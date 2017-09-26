import { createStore, applyMiddleware} from 'redux';
import reducer from './ducks/users.js';
import promideMiddleware from 'redux-promise-middleware';

export default createStore( reducer, applyMiddleware( promideMiddleware() ));