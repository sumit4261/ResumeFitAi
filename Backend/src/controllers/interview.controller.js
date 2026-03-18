const pdfParse = require('pdf-parse')
const generateInterviewReport = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

async function generateReportController(req,res){
    try {
        let resumeContentText = ""
        if (req.file) {
            resumeContentText = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeContentText = resumeContentText.text
        }

        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume: resumeContentText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,

        })
        
        res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        })
    } catch(err) {
        console.error("Error generating report:", err)
        res.status(500).json({
            message: "Error generating report: " + err.message
        })
    }
}

const mongoose = require('mongoose');

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        if(!mongoose.isValidObjectId(interviewId)) {
            return res.status(400).json({
                message: "Invalid interview report format"
            })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch(err) {
        console.error("Error formatting getInterviewReportById:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
     const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        // Resume PDF generation service is not implemented yet.
        return res.status(501).json({
            message: "Resume PDF generation is not implemented yet."
        })
    } catch (err) {
        console.error("Error generating resume PDF:", err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {generateReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}
