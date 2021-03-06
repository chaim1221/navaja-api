var assert = require("chai").assert;
var db = require(__dirname + "/../../../data/db.js");

describe("module: db", function() {
    describe("provides a wrapper for the execution of queries", function () {
        var profile = {
            returnCustomer: true,
            receiveUpdates: true, 
            name: 'Chaim Eliyah', 
            email: 'ce@spam.org', 
            password: 'change_me', 
            active: true
        };
    
        it("can create rows", function(done) {
            db.create('employer.profile', profile)
                .then(function (returnedValue) { 
                    assert.ok(returnedValue);
                    profile.id = parseInt(returnedValue);
                    done();
                })
        });
        
        it("can read rows by column name and value", function (done) {
            db.read('employer.profile', 'email', profile.email).then(function (result) {
                assert.equal(result.id, profile.id);
                done();
            });
        });
        
        it("can read rows by id", function(done) {
            db.readById('employer.profile', profile.id).then(function (result) {
                assert.equal(result.id, profile.id);
                assert.equal(result.returncustomer, profile.returncustomer);
                assert.equal(result.receiveupdates, profile.receiveupdates);
                assert.equal(result.name, profile.name);
                assert.equal(result.email, profile.email);
                assert.equal(result.password, profile.password);
                assert.equal(result.active, profile.active);
                done();
            });
        });
        
        it("can update rows", function(done) {
            profile.active = false;
            db.update('employer.profile', profile)
                .then(function(returnedValue) {
                    assert.ok(returnedValue);
                    done();
                });
        });
        
        it("can delete rows", function(done) {
            db.delete('employer.profile', profile.id)
                .then(function(rowsAffected) {
                    assert.isAbove(rowsAffected, 0);
                    done();
                });
        });
    });
}); 

