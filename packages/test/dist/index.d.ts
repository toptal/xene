import { Bot } from '@xene/core';
import { Tester } from './tester';
export declare const wrap: <B extends Bot<any>>(bot: B) => Tester<B>;
