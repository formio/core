export default [
  {
    title: "Page 1",
    breadcrumbClickable: false,
    buttonSettings: {
      previous: true,
      cancel: true,
      next: true
    },

    key: "page1",
    type: "panel",
    label: "Page 1",
    tableView: false,
    components: [
      {
        label: "Text Field",
        tableView: true,
        key: "textField",
        type: "textfield",
        input: true
      },
    ],
    input: false,
    allowPrevious: false
  },
  {
    title: "Page 2",
    breadcrumbClickable: false,
    buttonSettings: {
      previous: true,
      cancel: true,
      next: true
    },
    key: "page2",
    type: "panel",
    label: "Page 2",
    allowPrevious: false,
    input: false,
    tableView: false,
    components: [
      {
        label: "Component",
        cellAlignment: "left",
        key: "table",
        type: "components",
        component: {
          type: "table",
          rows: [
            [
              {
                components: [
                  {
                    label: "Url",
                    tableView: true,
                    key: "url1",
                    type: "url",
                    input: true
                  }
                ]
              },
            ]
          ]
        }
      }
    ]
  },
]