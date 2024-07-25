import { expect } from "chai";
import { Component } from "types";
import { getComponentAbsolutePath, eachComponent } from "utils/formUtil";

describe("getComponentAbsolutePath", () => {
    it.only('should return the absolute path when iterating throught child components', () => {
        const form = {
            key: 'form',
            display: 'form',
            components: [
            {
                type: 'container',
                key: 'outer-container',
                components: [
                    {
                        type: 'textfield',
                        key: 'textfield',
                    },
                    {
                        type: 'container',
                        key: 'inner-container',
                        components: [
                            {
                                type: 'textfield',
                                key: 'innerTextfield',
                            }
                        ]
                    }
                ]
            }
        ],
    }
        // when passed child components, absolute path returns relative to the parent component/
        eachComponent(form.components[0].components[1].components, (component: Component, path: string) => {
            const absolutePath = getComponentAbsolutePath(component);
            
            expect(absolutePath).to.equal('outer-container.inner-container.innerTextfield', 'absolute path path is incomplete');
            
            
        });


    });
});