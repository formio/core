const { forEach } = require("lodash");

const form = [{
    components: [{
        textField1: "first",
        path: "data[0].textField",
        components: [
            {
                path: "data[0].textField3",
                textField3: 'text3',
                components: [{
                    number: '1',
                    path: 'data[0].grid[1].textField'
                },
                {
                    number: '2',
                    path: 'data[2].grid[1].textField'
                },
               ]
            },
            {
                path: "data[0].textField4",
                textField3: 'text4'
            }
        ]
    },
    {
        textField1: "second",
        path: "data[0].textField1"
    }],
    someFields:"sad",
    key:"dataGrid",
    path: 'dataGrid[0]'
},

{
    // components: [],
    someFields:"sad",
    key:'other',
    path:'other[0]'
}
]



const recursionFunc = (form)=> {
    form.forEach(x=> {
        if(x.path){
            x.path = x.path.replace(/\[[0-9]+\]/g, '');
        }
        if(x.components) {
            recursionFunc(x.components)
        }
   })
  return form;
}


const newForm = recursionFunc(form);
console.log(newForm, "NEWFORM")