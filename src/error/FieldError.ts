import { Component } from '../types/Component';

export class FieldError extends Error {
    path: string;
    message: string;
    constructor(component: Component, message: string) {
        super(message);
        this.path = component.key;
        this.message = message;
    }
}
