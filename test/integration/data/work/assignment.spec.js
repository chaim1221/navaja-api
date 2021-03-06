var assert = require('chai').assert;
var EmployerProfileRepository = require(__dirname + '/../../../../data/employer/profile.js').Repository;
var WorkerProfileRepository = require(__dirname + '/../../../../data/worker/profile.js').Repository;
var WorkerSkillRepository = require(__dirname + '/../../../../data/worker/skill.js').Repository;
var WorkOrderRepository = require(__dirname + '/../../../../data/work/order.js').Repository;
var WorkOfferRepository = require(__dirname + '/../../../../data/work/offer.js').Repository;
var WorkAssignmentRepository = require(__dirname + '/../../../../data/work/assignment.js').Repository;

describe('When we want to keep track of an worker assignment', function () {
    var workAssignmentRepository = new WorkAssignmentRepository();
    var employerProfileRepository = new EmployerProfileRepository();
    var workOrderRepository = new WorkOrderRepository();
    var workOfferRepository = new WorkOfferRepository();
    
    var assignment = {
        offerId: null,
        acceptedWage: 11,
        active: true
    }

    var employerProfile = {
        returnCustomer: true,
        receiveUpdates: true, 
        name: 'Barack Obama', 
        email: 'obama@spam.org', 
        password: 'change_me', 
        active: true
    };

    var order = {
        employerProfileId: null,
        englishMasteryRequired: 5,
        workerSkillId: null,
        masteryRequired: 5,
        timeNeeded: new Date(),
        proposedWage: 10.80,
        active: true
    };
                
    var offer = {
        orderId: null,
        workerProfileId: null,
        meetsSponsorshipRequirements: true,
        location: "(45.516666667, 122.683333333)",
        transportationMethodId: 1, // US English
        timePromised: new Date(),
        counterOffer: 11.00,
        active: true
    }

    before(function (done) {
        var workerProfileRepository = new WorkerProfileRepository();
        var workerSkillRepository = new WorkerSkillRepository();
        
        var workerProfile = {
            returnCustomer: true,
            receiveUpdates: true, 
            name: 'Kaisar Sose', 
            email: 'ks@spam.org', 
            password: 'change_me', 
            phonePrimary: '503-867-5309',
            phoneSecondary: '800-555-1212',
            active: true
        };

        var skill = {
            name: "Find Loose Firewood",
            active: true
        };
        
        employerProfileRepository.add(employerProfile).then(function (returnedValue) {
            var iValue = parseInt(returnedValue);
            employerProfile.id = iValue;
            order.employerProfileId = iValue;
            complete();
        });
        
        workerSkillRepository.add(skill).then(function (returnedValue) {
            order.workerSkillId = parseInt(returnedValue);
            complete();
        });

        workerProfileRepository.add(workerProfile).then(function (returnedValue) {
            var iValue = parseInt(returnedValue);
            workerProfile.id = iValue;
            offer.workerProfileId = iValue;
            complete();
        });

        function complete() {
            if (order.employerProfileId !== null 
            && order.workerSkillId !== null
            && offer.workerProfileId !== null) {
                 workOrderRepository.add(order).then(function (returnedValue) {
                    var iValue = parseInt(returnedValue);
                    order.id = iValue;
                    offer.orderId = iValue;
                })
                .then(function () {
                    workOfferRepository.add(offer).then(function (returnedValue) {
                        var iValue = parseInt(returnedValue);
                        offer.id = iValue;
                        assignment.offerId = iValue;
                        done();
                    });
                });
            }
        }
    });
    
    describe("Repository: WorkerAssignmentRepository", function () {
        it('Can add worker assignmentes', function (done) {
            workAssignmentRepository.add(assignment).then(function (returnedValue) {
                assert.ok(returnedValue);
                assignment.id = parseInt(returnedValue);
                done();
            });
        });
        
        it('Can get worker assignmentes by id', function (done) {
            workAssignmentRepository.getById(assignment.id).then(function (result) {
                assert.equal(result.id, assignment.id);
                assert.equal(result.offerId, assignment.offerId);
                assert.equal(result.acceptedWage, assignment.acceptedWage);
                assert.equal(result.active, assignment.active);
                done();
            });
        });
        
        it('Can update worker assignmentes', function (done) {
            assignment.active = false;
            workAssignmentRepository.update(assignment).then(function (returnedValue) {
                assert.ok(returnedValue);
                done();
            });
        });
        
        it("can delete rows", function(done) {
            workAssignmentRepository.remove(assignment.id)
                .then(function(rowsAffected) {
                    assert.isAbove(rowsAffected, 0);
                    done();
                });
        });
    });
    
    after(function (done) {
        var i = 0;
        
        workOfferRepository.remove(offer.id)
            .then(function(rowsAffected) {
                assert.equal(rowsAffected, 1);
                i++;
                complete(i);
            });
        
        workOrderRepository.remove(order.id)
            .then(function(rowsAffected) {
                assert.equal(rowsAffected, 1);
                i++;
                complete(i);
            });
            
        function complete(count) {
            if (count == 2) {
                employerProfileRepository.remove(employerProfile.id)
                    .then(function(rowsAffected) {
                        assert.equal(rowsAffected, 1);
                        done();
                    });
            }
        }
    });
});

