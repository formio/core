import { assert } from 'chai';
import { ArrayComponent as ArrayComponentBase } from '../ArrayComponent';
import { comp1, comp2 } from './fixtures';
const ArrayComponent = ArrayComponentBase()();

describe('ArrayComponent', function () {
  it('Should create a new Array Component', function () {
    const data = {};
    new ArrayComponent(comp1, {}, data);
    assert.deepEqual(data, { employees: [] });
  });

  it('Should create an Array Component with default data', function () {
    const employees = [
      {
        firstName: 'Joe',
        lastName: 'Smith',
      },
      {
        firstName: 'Sally',
        lastName: 'Thompson',
      },
    ];
    const data = {
      employees: employees,
    };
    const arrComp = new ArrayComponent(comp1, {}, data);
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 2);
    assert.equal(arrComp.rows[0].length, 2);
    assert.equal(arrComp.rows[1].length, 2);
    assert.equal(arrComp.components.length, 4);
    assert.equal(arrComp.components[0].dataValue, 'Joe');
    assert.equal(arrComp.components[1].dataValue, 'Smith');
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.strictEqual(arrComp.rows[1][0], arrComp.components[2]);
    assert.strictEqual(arrComp.rows[1][1], arrComp.components[3]);
    assert.equal(arrComp.components[2].dataValue, 'Sally');
    assert.equal(arrComp.components[3].dataValue, 'Thompson');
  });

  it('Should set the value of the sub components', function () {
    const data = {};
    const arrComp = new ArrayComponent(comp1, {}, data);
    let employees = [
      {
        firstName: 'Joe',
        lastName: 'Smith',
      },
      {
        firstName: 'Sally',
        lastName: 'Thompson',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ];
    arrComp.dataValue = employees;
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 3);
    assert.equal(arrComp.rows[0].length, 2);
    assert.equal(arrComp.rows[1].length, 2);
    assert.equal(arrComp.rows[2].length, 2);
    assert.equal(arrComp.components.length, 6);
    assert.equal(arrComp.components[0].dataValue, 'Joe');
    assert.equal(arrComp.components[1].dataValue, 'Smith');
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.strictEqual(arrComp.rows[1][0], arrComp.components[2]);
    assert.strictEqual(arrComp.rows[1][1], arrComp.components[3]);
    assert.strictEqual(arrComp.rows[2][0], arrComp.components[4]);
    assert.strictEqual(arrComp.rows[2][1], arrComp.components[5]);
    assert.equal(arrComp.components[2].dataValue, 'Sally');
    assert.equal(arrComp.components[3].dataValue, 'Thompson');
    assert.equal(arrComp.components[4].dataValue, 'Jane');
    assert.equal(arrComp.components[5].dataValue, 'Doe');

    // Ensure it removes rows.
    employees = [
      {
        firstName: 'Sally',
        lastName: 'Thompson',
      },
    ];
    arrComp.dataValue = employees;
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 1);
    assert.equal(arrComp.rows[0].length, 2);
    assert.equal(arrComp.components.length, 2);
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.equal(arrComp.components[0].dataValue, 'Sally');
    assert.equal(arrComp.components[1].dataValue, 'Thompson');

    // Ensure it adds another row.
    employees = [
      {
        firstName: 'Sally',
        lastName: 'Thompson',
      },
      {
        firstName: 'Joe',
        lastName: 'Smith',
      },
    ];
    arrComp.dataValue = employees;
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 2);
    assert.equal(arrComp.rows[0].length, 2);
    assert.equal(arrComp.rows[1].length, 2);
    assert.equal(arrComp.components.length, 4);
    assert.equal(arrComp.components[0].dataValue, 'Sally');
    assert.equal(arrComp.components[1].dataValue, 'Thompson');
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.strictEqual(arrComp.rows[1][0], arrComp.components[2]);
    assert.strictEqual(arrComp.rows[1][1], arrComp.components[3]);
    assert.equal(arrComp.components[2].dataValue, 'Joe');
    assert.equal(arrComp.components[3].dataValue, 'Smith');
  });

  const employees = [
    {
      firstName: 'Joe',
      lastName: 'Smith',
      department: {
        name: 'HR',
        phoneNumber: '555-123-4567',
      },
      children: [
        {
          firstName: 'Joe Jr.',
          dob: '5-17-2008',
        },
        {
          firstName: 'Joey',
          dob: '12-2-2010',
        },
      ],
    },
    {
      firstName: 'Sally',
      lastName: 'Thompson',
      department: {
        name: 'Sales',
        phoneNumber: '123-456-7890',
      },
      children: [
        {
          firstName: 'Harry',
          dob: '1-23-2002',
        },
        {
          firstName: 'Sue',
          dob: '3-23-2010',
        },
        {
          firstName: 'Stuart',
          dob: '9-23-2014',
        },
      ],
    },
  ];

  it('Should allow complex data structures', function () {
    const data = { employees };
    const arrComp = new ArrayComponent(comp2, {}, data);
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 2);
    assert.equal(arrComp.rows[0].length, 4);
    assert.equal(arrComp.rows[1].length, 4);
    assert.equal(arrComp.components.length, 8);
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.strictEqual(arrComp.rows[0][2], arrComp.components[2]);
    assert.strictEqual(arrComp.rows[0][3], arrComp.components[3]);
    assert.strictEqual(arrComp.rows[1][0], arrComp.components[4]);
    assert.strictEqual(arrComp.rows[1][1], arrComp.components[5]);
    assert.strictEqual(arrComp.rows[1][2], arrComp.components[6]);
    assert.strictEqual(arrComp.rows[1][3], arrComp.components[7]);
    assert.equal(arrComp.components[0].dataValue, employees[0].firstName);
    assert.equal(arrComp.components[1].dataValue, employees[0].lastName);
    assert.equal(arrComp.components[2].dataValue, employees[0].department);
    assert.equal((arrComp.components[2] as any).components.length, 2);
    assert.equal(
      (arrComp.components[2] as any).components[0].dataValue,
      employees[0].department.name,
    );
    assert.equal(
      (arrComp.components[2] as any).components[1].dataValue,
      employees[0].department.phoneNumber,
    );
    assert.equal(arrComp.components[3].dataValue, employees[0].children);
    assert.equal((arrComp.components[3] as any).components.length, 4);
    assert.equal(
      (arrComp.components[3] as any).components[0].dataValue,
      employees[0].children[0].firstName,
    );
    assert.equal(
      (arrComp.components[3] as any).components[1].dataValue,
      employees[0].children[0].dob,
    );
    assert.equal(
      (arrComp.components[3] as any).components[2].dataValue,
      employees[0].children[1].firstName,
    );
    assert.equal(
      (arrComp.components[3] as any).components[3].dataValue,
      employees[0].children[1].dob,
    );
    assert.equal(arrComp.components[4].dataValue, employees[1].firstName);
    assert.equal(arrComp.components[5].dataValue, employees[1].lastName);
    assert.equal(arrComp.components[6].dataValue, employees[1].department);
    assert.equal((arrComp.components[6] as any).components.length, 2);
    assert.equal(
      (arrComp.components[6] as any).components[0].dataValue,
      employees[1].department.name,
    );
    assert.equal(
      (arrComp.components[6] as any).components[1].dataValue,
      employees[1].department.phoneNumber,
    );
    assert.equal(arrComp.components[7].dataValue, employees[1].children);
    assert.equal((arrComp.components[7] as any).components.length, 6);
    assert.equal(
      (arrComp.components[7] as any).components[0].dataValue,
      employees[1].children[0].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[1].dataValue,
      employees[1].children[0].dob,
    );
    assert.equal(
      (arrComp.components[7] as any).components[2].dataValue,
      employees[1].children[1].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[3].dataValue,
      employees[1].children[1].dob,
    );
    assert.equal(
      (arrComp.components[7] as any).components[4].dataValue,
      employees[1].children[2].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[5].dataValue,
      employees[1].children[2].dob,
    );
  });

  it('Should be able to set complex data structures.', function () {
    const data = {};
    const arrComp = new ArrayComponent(comp2, {}, data);
    arrComp.dataValue = employees;
    assert.deepEqual(data, { employees: employees });
    assert.deepEqual(arrComp.dataValue, employees);
    assert.equal(arrComp.rows.length, 2);
    assert.equal(arrComp.rows[0].length, 4);
    assert.equal(arrComp.rows[1].length, 4);
    assert.equal(arrComp.components.length, 8);
    assert.strictEqual(arrComp.rows[0][0], arrComp.components[0]);
    assert.strictEqual(arrComp.rows[0][1], arrComp.components[1]);
    assert.strictEqual(arrComp.rows[0][2], arrComp.components[2]);
    assert.strictEqual(arrComp.rows[0][3], arrComp.components[3]);
    assert.strictEqual(arrComp.rows[1][0], arrComp.components[4]);
    assert.strictEqual(arrComp.rows[1][1], arrComp.components[5]);
    assert.strictEqual(arrComp.rows[1][2], arrComp.components[6]);
    assert.strictEqual(arrComp.rows[1][3], arrComp.components[7]);
    assert.equal(arrComp.components[0].dataValue, employees[0].firstName);
    assert.equal(arrComp.components[1].dataValue, employees[0].lastName);
    assert.equal(arrComp.components[2].dataValue, employees[0].department);
    assert.equal((arrComp.components[2] as any).components.length, 2);
    assert.equal(
      (arrComp.components[2] as any).components[0].dataValue,
      employees[0].department.name,
    );
    assert.equal(
      (arrComp.components[2] as any).components[1].dataValue,
      employees[0].department.phoneNumber,
    );
    assert.equal(arrComp.components[3].dataValue, employees[0].children);
    assert.equal((arrComp.components[3] as any).components.length, 4);
    assert.equal(
      (arrComp.components[3] as any).components[0].dataValue,
      employees[0].children[0].firstName,
    );
    assert.equal(
      (arrComp.components[3] as any).components[1].dataValue,
      employees[0].children[0].dob,
    );
    assert.equal(
      (arrComp.components[3] as any).components[2].dataValue,
      employees[0].children[1].firstName,
    );
    assert.equal(
      (arrComp.components[3] as any).components[3].dataValue,
      employees[0].children[1].dob,
    );
    assert.equal(arrComp.components[4].dataValue, employees[1].firstName);
    assert.equal(arrComp.components[5].dataValue, employees[1].lastName);
    assert.equal(arrComp.components[6].dataValue, employees[1].department);
    assert.equal((arrComp.components[6] as any).components.length, 2);
    assert.equal(
      (arrComp.components[6] as any).components[0].dataValue,
      employees[1].department.name,
    );
    assert.equal(
      (arrComp.components[6] as any).components[1].dataValue,
      employees[1].department.phoneNumber,
    );
    assert.equal(arrComp.components[7].dataValue, employees[1].children);
    assert.equal((arrComp.components[7] as any).components.length, 6);
    assert.equal(
      (arrComp.components[7] as any).components[0].dataValue,
      employees[1].children[0].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[1].dataValue,
      employees[1].children[0].dob,
    );
    assert.equal(
      (arrComp.components[7] as any).components[2].dataValue,
      employees[1].children[1].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[3].dataValue,
      employees[1].children[1].dob,
    );
    assert.equal(
      (arrComp.components[7] as any).components[4].dataValue,
      employees[1].children[2].firstName,
    );
    assert.equal(
      (arrComp.components[7] as any).components[5].dataValue,
      employees[1].children[2].dob,
    );

    // Ensure parent and root elements are all set correctly.
    assert.strictEqual(
      (arrComp.components[7] as any).components[0].parent,
      arrComp.components[7] as any,
    );
    assert.strictEqual(
      (arrComp.components[7] as any).components[1].parent,
      arrComp.components[7] as any,
    );
    assert.strictEqual((arrComp.components[7] as any).components[0].root, arrComp);
    assert.strictEqual((arrComp.components[7] as any).parent, arrComp);
  });
});
