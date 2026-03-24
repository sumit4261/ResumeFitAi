const pdfParse = require('pdf-parse')
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

async function generateReportController(req,res){
    try {
        console.log("generateReportController called. req.file:", !!req.file, "req.body:", req.body);
        
        let resumeContentText = ""
        const selfDescription = req.body.selfDescription?.trim() || ""

        if (req.file) {
            try {
                console.log("Parsing PDF file:", req.file.originalname, "| mimetype:", req.file.mimetype, "| buffer size:", req.file.buffer?.length ?? "NO BUFFER");
                const isPdf = req.file.mimetype === "application/pdf"

                if (!isPdf) {
                    if (selfDescription) {
                        console.warn("Unsupported resume type, continuing with selfDescription only:", req.file.mimetype);
                    } else {
                        return res.status(400).json({ message: "Only PDF resume files are supported" })
                    }
                } else if (!req.file.buffer || req.file.buffer.length === 0) {
                    console.error("PDF buffer is empty or missing!");
                    if (!selfDescription) {
                        return res.status(400).json({ message: "Resume file appears to be empty. Please try uploading again." })
                    }
                    console.warn("Empty PDF buffer, continuing with selfDescription only.");
                } else {
                    const pdfData = await pdfParse(req.file.buffer)
                    resumeContentText = pdfData.text
                    console.log("PDF parsed successfully. Text length:", resumeContentText.length);
                    if (!resumeContentText.trim()) {
                        console.warn("PDF parsed but extracted no text — likely a scanned/image-only PDF.");
                    }
                }
            } catch (pdfError) {
                console.error("PDF parsing error name:", pdfError.name);
                console.error("PDF parsing error message:", pdfError.message);
                console.error("PDF parsing error stack:", pdfError.stack);
                if (!selfDescription) {
                    return res.status(400).json({ message: "Could not read the PDF. Make sure it contains selectable text (not a scanned image). Or fill in the Self Description instead." })
                }
                console.warn("Unable to parse resume PDF, continuing with selfDescription only.");
            }
        } else {
            console.log("No resume file provided");
        }

        const jobDescription = req.body.jobDescription?.trim() || ""

        if (!jobDescription) {
            return res.status(400).json({ message: "jobDescription is required" });
        }

        if (!selfDescription && !resumeContentText) {
            return res.status(400).json({ message: "Provide either a resume file or selfDescription" });
        }

        console.log("Calling AI service...");
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        })

        if (!interviewReportByAi) {
            throw new Error("Failed to generate report from AI service");
        }

        console.log("AI service returned:", Object.keys(interviewReportByAi));

        // Ensure title is present (required by model)
        const reportData = {
            user: req.user.id,
            resume: resumeContentText,
            selfDescription,
            jobDescription,
            title: interviewReportByAi.title || "Interview Preparation Report",
            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan
        }

        console.log("Saving to DB...");
        const interviewReport = await interviewReportModel.create(reportData)
        console.log("Report saved successfully");
        
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

        const pdfBuffer = await generateResumePdf({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        })

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
            'Content-Length': pdfBuffer.length
        })

        return res.status(200).send(pdfBuffer)
    } catch (err) {
        console.error("Error generating resume PDF:", err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {generateReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}
