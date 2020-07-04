export * from './core/Engine'
export * from './core/Entity'
export * from './core/System'
export * from './core/EventHandler'
export * from './core/IComponent'
export * from './core/IScheduler'


import {HashMap} from './utils/HashMap';
export const utils = {HashMap}

import {RAFScheduler} from './schedulers/RAFScheduler'
export const schedulers = {RAFScheduler}


//import * as _eee from './core';
//export import eee= _eee;
//export const eee = {Engine, Entity, System, EventHandler};
//export const eee = {Engine, Entity, System, EventHandler, IComponent, IScheduler}

