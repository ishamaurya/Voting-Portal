const express = require("express");
const { 
    registercontroller, 
    loginController, 
    forgotPasswordController, 
    emailController} = require("../controller/authController");
const { voterController } = require("../controller/voteController");
const { updateVoteController } = require("../controller/updateVoteController");
const { getAllVoteController } = require("../controller/getAllVoteController");
const rashtrapatiController = require("../controller/rashtrapatiController");
const formidable  = require("express-formidable");
const { updateRashtrapatiController } = require("../controller/updateRashtrapatiController");
const getAllCandidateController = require("../controller/getAllCandidatesController");
const router = express.Router();

router.post("/register",registercontroller);
router.post("/login",loginController);
router.post("/forgot-password",forgotPasswordController);
router.post('/voter', voterController);
router.post('/sendEmail', emailController);

router.put('/updateVoter', updateVoteController); // Voter Database Updating Path

router.get('/all-vote', getAllVoteController)

router.post('/rashtrapatiRegister', 
            formidable(),
            rashtrapatiController); // Reguister for rashtrapati candidate

router.put('/updatedRashtrapatiVote', updateRashtrapatiController); // updating them after any vote

router.get('/all-candidates', getAllCandidateController); // getting all candidates of rashtrapati elections
            
module.exports = router;