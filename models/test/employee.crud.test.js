const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await empOne.save();
      const empTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await empTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(2);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      expect(employee.firstName).to.be.equal('John');
      expect(employee.lastName).to.be.equal('Doe');
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await empOne.save();
      const empTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await empTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: 'Johnny' } });
      const updated = await Employee.findOne({ firstName: 'Johnny' });
      expect(updated).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.firstName = 'Johnny';
      await employee.save();
      const updated = await Employee.findOne({ firstName: 'Johnny' });
      expect(updated).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Updated' } });
      const employees = await Employee.find({ lastName: 'Updated' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
      await empOne.save();
      const empTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await empTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removed = await Employee.findOne({ firstName: 'John' });
      expect(removed).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Populate', () => {
    before(async () => {
      const dep = new Department({ name: 'Management' });
      await dep.save();
      const emp = new Employee({ firstName: 'John', lastName: 'Doe', department: dep._id });
      await emp.save();
    });

    it('should populate department field with actual document', async () => {
      const employee = await Employee.findOne({ firstName: 'John' }).populate('department');
      expect(employee.department).to.be.an('object');
      expect(employee.department.name).to.be.equal('Management');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

});