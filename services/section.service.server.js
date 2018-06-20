module.exports = function (app) {

    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
    app.get('/api/student/section', findSectionsForStudent);
    app.delete('/api/student/section/:sectionId', unenrollStudentInSection);
    app.get('/api/section/:sectionId', findSectionById);
    app.put('/api/section/:sectionId', updateSection);
    app.delete('/api/section/:sectionId', deleteSection);

    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function unenrollStudentInSection(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var sectionId = req.params.sectionId;

        sectionModel
            .incrementSectionSeats(sectionId)
            .then(function () {
                return enrollmentModel
                    .unenrollStudentInSection(studentId, sectionId)
            })
            .then(function() {
                res.send(200);
            });
    }

    function updateSection(req, res) {
        var newSection = req.body;
        var id = req.params['sectionId'];
        sectionModel.updateSection(id, newSection)
            .then(res.send(200));
    }

    function deleteSection(req, res) {
        var id = req.params['sectionId'];
        sectionModel.deleteSection(id)
            .then(function () {
                 enrollmentModel.deleteSectionFromEnrollment(id);
            })
            .then(function() {
                res.send(200)
            });
    }

    function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function(enrollments) {
                res.json(enrollments);
            });
    }

    function enrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .decrementSectionSeats(sectionId)
            .then(function () {
                return enrollmentModel
                    .enrollStudentInSection(enrollment)
            })
            .then(function (enrollment) {
                res.json(enrollment);
            })
    }

    function findSectionById(req, res) {
        var sectionId = req.params['sectionId'];
        sectionModel.findSectionById(sectionId)
            .then(function(section) {
                res.json(section);
            })
    }

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }

    function createSection(req, res) {
        var section = req.body;
        sectionModel
            .createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }
};