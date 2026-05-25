const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no args', () => {
    const emp = new Employee({});
    emp.validateSync(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" is missing', () => {
    const emp = new Employee({ lastName: 'Doe', department: 'IT' });
    emp.validateSync(err => {
      expect(err.errors.firstName).to.exist;
    });
  });

  it('should throw an error if "lastName" is missing', () => {
    const emp = new Employee({ firstName: 'John', department: 'IT' });
    emp.validateSync(err => {
      expect(err.errors.lastName).to.exist;
    });
  });

  it('should throw an error if "department" is missing', () => {
    const emp = new Employee({ firstName: 'John', lastName: 'Doe' });
    emp.validateSync(err => {
      expect(err.errors.department).to.exist;
    });
  });

  it('should not throw an error if all fields are correct', () => {
    const emp = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
    emp.validateSync(err => {
      expect(err).to.not.exist;
    });
  });
});