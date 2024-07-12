const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    const subjects = await Subject.find({ userId: req.session.userId });
    res.render('subjects', { subjects });
});

router.post('/add', async (req, res) => {
    const { name } = req.body;
    const subject = new Subject({ name, userId: req.session.userId });
    await subject.save();
    res.redirect('/subject');
});

router.post('/delete', async (req, res) => {
    const { subjectId } = req.body;
    await Subject.deleteOne({ _id: subjectId, userId: req.session.userId });
    res.redirect('/subject');
});

module.exports = router;
