/// <reference types="node" />
import * as Koa from 'koa';
import * as Express from 'express';
import { MiddlewareHandler } from '../types';
export declare const koa: (handler: MiddlewareHandler, ctx: Koa.Context, next: any) => Promise<any>;
export declare const express: (handler: MiddlewareHandler, req: Express.Request, res: Express.Response, next: any) => Promise<any>;
