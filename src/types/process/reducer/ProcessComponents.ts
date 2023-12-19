import { Component } from "types/Component";
export type ProcessComponents = {
    [key: string]: Component[];
};

export type ProcessComponentsTarget = {
    target: 'server' | 'custom';
    processes: ProcessComponents;
};
