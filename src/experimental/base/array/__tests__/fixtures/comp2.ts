export default {
  type: 'array',
  key: 'employees',
  components: [
    {
      type: 'component',
      key: 'firstName',
    },
    {
      type: 'component',
      key: 'lastName',
    },
    {
      type: 'data',
      key: 'department',
      components: [
        {
          type: 'component',
          key: 'name',
        },
        {
          type: 'component',
          key: 'phoneNumber',
        },
      ],
    },
    {
      type: 'array',
      key: 'children',
      components: [
        {
          type: 'component',
          key: 'firstName',
        },
        {
          type: 'component',
          key: 'dob',
        },
      ],
    },
  ],
};
