const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    const subjects = await Subject.find({ userId: req.session.userId });
    res.render('attendance', { subjects });
});

router.post('/mark', async (req, res) => {
    const { date, status, subjectId } = req.body;
    const attendance = new Attendance({
        date,
        status,
        subjectId,
        userId: req.session.userId
    });
    await attendance.save();
    res.redirect('/attendance');
});

router.get('/track', async (req, res) => {
    const subjects = await Subject.find({ userId: req.session.userId });
    const attendanceRecords = await Attendance.find({ userId: req.session.userId }).populate('subjectId');
    const attendanceData = subjects.map(subject => {
        const totalClasses = attendanceRecords.filter(record => record.subjectId._id.equals(subject._id)).length;
        const attendedClasses = attendanceRecords.filter(record => record.subjectId._id.equals(subject._id) && record.status === 'present').length;
        const attendancePercentage = totalClasses === 0 ? 0 : (attendedClasses / totalClasses) * 100;
        return { name: subject.name, attendancePercentage };
    });
    res.render('track', { subjects: attendanceData });
});

module.exports = router;
