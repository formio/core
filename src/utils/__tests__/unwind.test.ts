import assert from 'assert';
import { unwind, rewind } from '../unwind';

describe('Test Unwinder', function () {
  it('Should unwind a form with datagrid and submission data', function () {
    const form = {
      components: [
        {
          type: 'datagrid',
          key: 'units',
          label: 'Units',
          components: [
            {
              type: 'textfield',
              key: 'a',
              label: 'A',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'textfield',
              key: 'b',
              label: 'B',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
          },
          {
            a: 'three',
            b: 'four',
          },
          {
            a: 'five',
            b: 'six',
          },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(submissions.length, 3);
    assert.equal(form.components[0].components[0].key, 'units.a');
    assert.equal(form.components[0].components[1].key, 'units.b');
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
          },
        ],
      },
    });
    assert.deepEqual(submissions[1], {
      data: {
        units: [
          {
            a: 'three',
            b: 'four',
          },
        ],
      },
    });
    assert.deepEqual(submissions[2], {
      data: {
        units: [
          {
            a: 'five',
            b: 'six',
          },
        ],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });

  it('Should unwind a form with nested datagrids and submission data', function () {
    const form = {
      components: [
        {
          type: 'datagrid',
          key: 'units',
          label: 'Units',
          components: [
            {
              type: 'textfield',
              key: 'a',
              label: 'A',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'textfield',
              key: 'b',
              label: 'B',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'datagrid',
              key: 'subunits',
              label: 'Sub Units',
              components: [
                {
                  type: 'textfield',
                  key: 'c',
                  label: 'C',
                  overlay: {
                    width: '100px',
                    height: '20px',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'three',
              },
              {
                c: 'four',
              },
            ],
          },
          {
            a: 'five',
            b: 'six',
            subunits: [
              {
                c: 'seven',
              },
            ],
          },
          {
            a: 'eight',
            b: 'nine',
          },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(submissions.length, 4);
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'three',
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[1], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'four',
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[2], {
      data: {
        units: [
          {
            a: 'five',
            b: 'six',
            subunits: [
              {
                c: 'seven',
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[3], {
      data: {
        units: [
          {
            a: 'eight',
            b: 'nine',
          },
        ],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });

  it('Should unwind a form with deep nested datagrids and submission data', function () {
    const form = {
      components: [
        {
          type: 'datagrid',
          key: 'units',
          label: 'Units',
          components: [
            {
              type: 'textfield',
              key: 'a',
              label: 'A',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'textfield',
              key: 'b',
              label: 'B',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'datagrid',
              key: 'subunits',
              label: 'Sub Units',
              components: [
                {
                  type: 'textfield',
                  key: 'c',
                  label: 'C',
                  overlay: {
                    width: '100px',
                    height: '20px',
                  },
                },
                {
                  type: 'datagrid',
                  key: 'deepgrid',
                  label: 'deep',
                  components: [
                    {
                      type: 'textfield',
                      key: 'd',
                      label: 'd',
                      overlay: {
                        width: '100px',
                        height: '20px',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'three',
                deepgrid: [
                  {
                    d: 'four',
                  },
                  {
                    d: 'five',
                  },
                ],
              },
              {
                c: 'six',
                deepgrid: [],
              },
            ],
          },
          {
            a: 'seven',
            b: 'eight',
            subunits: [
              {
                c: 'nine',
                deepgrid: [
                  {
                    d: 'ten',
                  },
                  {
                    d: 'eleven',
                  },
                  {
                    d: 'twelve',
                  },
                ],
              },
            ],
          },
          {
            a: 'thirteen',
            b: 'fourteen',
            subunits: [
              {
                c: 'fiveteen',
              },
            ],
          },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(submissions.length, 7);
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'three',
                deepgrid: [
                  {
                    d: 'four',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[1], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'three',
                deepgrid: [
                  {
                    d: 'five',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[2], {
      data: {
        units: [
          {
            a: 'one',
            b: 'two',
            subunits: [
              {
                c: 'six',
                deepgrid: [],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[3], {
      data: {
        units: [
          {
            a: 'seven',
            b: 'eight',
            subunits: [
              {
                c: 'nine',
                deepgrid: [
                  {
                    d: 'ten',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[4], {
      data: {
        units: [
          {
            a: 'seven',
            b: 'eight',
            subunits: [
              {
                c: 'nine',
                deepgrid: [
                  {
                    d: 'eleven',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[5], {
      data: {
        units: [
          {
            a: 'seven',
            b: 'eight',
            subunits: [
              {
                c: 'nine',
                deepgrid: [
                  {
                    d: 'twelve',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[6], {
      data: {
        units: [
          {
            a: 'thirteen',
            b: 'fourteen',
            subunits: [
              {
                c: 'fiveteen',
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });

  it('Should also handle fields with the multiple setting.', function () {
    const form = {
      components: [
        {
          type: 'datagrid',
          key: 'units',
          label: 'Units',
          components: [
            {
              type: 'textfield',
              key: 'a',
              label: 'A',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'textfield',
              key: 'b',
              label: 'B',
              overlay: {
                width: '100px',
                height: '20px',
              },
            },
            {
              type: 'datagrid',
              key: 'subunits',
              label: 'Sub Units',
              components: [
                {
                  type: 'textfield',
                  key: 'c',
                  label: 'C',
                  overlay: {
                    width: '100px',
                    height: '20px',
                  },
                },
                {
                  type: 'datagrid',
                  key: 'deepgrid',
                  label: 'deep',
                  components: [
                    {
                      type: 'textfield',
                      key: 'd',
                      label: 'd',
                      multiple: true,
                      overlay: {
                        width: '100px',
                        height: '20px',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['4', '5'],
                  },
                  {
                    d: ['6', '7', '8'],
                  },
                ],
              },
              {
                c: '9',
                deepgrid: [],
              },
            ],
          },
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['13', '14'],
                  },
                  {
                    d: ['15'],
                  },
                  {
                    d: ['16', '17', '18'],
                  },
                ],
              },
              {
                c: '19',
                deepgrid: [
                  {
                    d: ['20'],
                  },
                ],
              },
            ],
          },
          {
            a: '21',
            b: '22',
            subunits: [
              {
                c: '23',
              },
            ],
          },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(submissions.length, 14);
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['4'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[1], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['5'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[2], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['6'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[3], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['7'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[4], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '3',
                deepgrid: [
                  {
                    d: ['8'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[5], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            subunits: [
              {
                c: '9',
                deepgrid: [],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[6], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['13'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[7], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['14'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[8], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['15'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[9], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['16'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[10], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['17'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[11], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '12',
                deepgrid: [
                  {
                    d: ['18'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[12], {
      data: {
        units: [
          {
            a: '10',
            b: '11',
            subunits: [
              {
                c: '19',
                deepgrid: [
                  {
                    d: ['20'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    assert.deepEqual(submissions[13], {
      data: {
        units: [
          {
            a: '21',
            b: '22',
            subunits: [
              {
                c: '23',
              },
            ],
          },
        ],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });

  it('Should allow the path variable within the components.', function () {
    const form = {
      components: [
        {
          type: 'textfield',
          key: 'a1',
          label: 'a1',
          properties: {
            dataPath: 'units[0].a',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'a2',
          label: 'a2',
          properties: {
            dataPath: 'units[1].a',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'b1',
          label: 'b1',
          properties: {
            dataPath: 'units[0].b',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'b2',
          label: 'b2',
          properties: {
            dataPath: 'units[1].b',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
      ],
    };

    const submission = {
      data: {
        units: [
          { a: '1', b: '2' },
          { a: '3', b: '4' },
          { a: '5', b: '6' },
          { a: '7', b: '8' },
          { a: '9', b: '10' },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(form.components[0].key, 'units[0].a');
    assert.equal(form.components[1].key, 'units[1].a');
    assert.equal(form.components[2].key, 'units[0].b');
    assert.equal(form.components[3].key, 'units[1].b');
    assert.equal(submissions.length, 3);
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          { a: '1', b: '2' },
          { a: '3', b: '4' },
        ],
      },
    });
    assert.deepEqual(submissions[1], {
      data: {
        units: [
          { a: '5', b: '6' },
          { a: '7', b: '8' },
        ],
      },
    });
    assert.deepEqual(submissions[2], {
      data: {
        units: [{ a: '9', b: '10' }],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });

  it('Should allow complex path variables within the components.', function () {
    const form = {
      components: [
        {
          type: 'textfield',
          key: 'a1',
          label: 'a1',
          properties: {
            dataPath: 'units[0].a',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub1c1',
          label: 'sub1c1',
          properties: {
            dataPath: 'units[0].sub[0].c',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub1c2',
          label: 'sub1c2',
          properties: {
            dataPath: 'units[0].sub[1].c',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub1d1',
          label: 'sub1d1',
          properties: {
            dataPath: 'units[0].sub[0].d',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub1d2',
          label: 'sub1d2',
          properties: {
            dataPath: 'units[0].sub[1].d',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'a2',
          label: 'a2',
          properties: {
            dataPath: 'units[1].a',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub2c1',
          label: 'sub2c1',
          properties: {
            dataPath: 'units[1].sub[0].c',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub2c2',
          label: 'sub2c2',
          properties: {
            dataPath: 'units[1].sub[1].c',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub2d1',
          label: 'sub2d1',
          properties: {
            dataPath: 'units[1].sub[0].d',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'sub2d2',
          label: 'sub2d2',
          properties: {
            dataPath: 'units[1].sub[1].d',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'b1',
          label: 'b1',
          properties: {
            dataPath: 'units[0].b',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
        {
          type: 'textfield',
          key: 'b2',
          label: 'b2',
          properties: {
            dataPath: 'units[1].b',
          },
          overlay: {
            width: '100px',
            height: '20px',
          },
        },
      ],
    };

    const submission = {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            sub: [
              { c: '3', d: '4' },
              { c: '5', d: '6' },
              { c: '7', d: '8' },
            ],
          },
          {
            a: '9',
            b: '10',
            sub: [
              { c: '11', d: '12' },
              { c: '13', d: '14' },
              { c: '15', d: '16' },
            ],
          },
          { a: '15', b: '16', sub: [{ c: '17' }] },
          { a: '18', b: '19', sub: [{ c: '20', d: '21' }] },
          {
            a: '22',
            b: '23',
            sub: [
              { c: '24', d: '25' },
              { c: '26', d: '27' },
              { c: '28', d: '29' },
              { c: '30', d: '31' },
            ],
          },
        ],
      },
    };

    const submissions = unwind(form, submission);
    assert.equal(submissions.length, 5);
    assert.deepEqual(submissions[0], {
      data: {
        units: [
          {
            a: '1',
            b: '2',
            sub: [
              { c: '3', d: '4' },
              { c: '5', d: '6' },
            ],
          },
          {
            a: '9',
            b: '10',
            sub: [
              { c: '11', d: '12' },
              { c: '13', d: '14' },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[1], {
      data: {
        units: [
          { a: '1', b: '2', sub: [{ c: '7', d: '8' }] },
          { a: '9', b: '10', sub: [{ c: '15', d: '16' }] },
        ],
      },
    });
    assert.deepEqual(submissions[2], {
      data: {
        units: [
          { a: '15', b: '16', sub: [{ c: '17' }] },
          { a: '18', b: '19', sub: [{ c: '20', d: '21' }] },
        ],
      },
    });
    assert.deepEqual(submissions[3], {
      data: {
        units: [
          {
            a: '22',
            b: '23',
            sub: [
              { c: '24', d: '25' },
              { c: '26', d: '27' },
            ],
          },
        ],
      },
    });
    assert.deepEqual(submissions[4], {
      data: {
        units: [
          {
            a: '22',
            b: '23',
            sub: [
              { c: '28', d: '29' },
              { c: '30', d: '31' },
            ],
          },
        ],
      },
    });
    assert.deepEqual(rewind(submissions), submission);
  });
});
