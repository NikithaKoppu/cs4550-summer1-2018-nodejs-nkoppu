var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
    'EnrollmentModel',
    enrollmentSchema
);

function enrollStudentInSection(enrollment) {
    return enrollmentModel.create(enrollment);
}

function unenrollStudentInSection(studentId, sectionId) {
    return enrollmentModel.remove(
        {student: studentId,
        section: sectionId}, function(err) {});
}

function deleteSectionFromEnrollment(sectionId) {
    return enrollmentModel.remove({section: sectionId});
}

function findSectionsForStudent(studentId) {
    return enrollmentModel
        .find({student: studentId})
        .populate('section')
        .exec();
}

module.exports = {
    enrollStudentInSection: enrollStudentInSection,
    findSectionsForStudent: findSectionsForStudent,
    unenrollStudentInSection: unenrollStudentInSection,
    deleteSectionFromEnrollment: deleteSectionFromEnrollment

};