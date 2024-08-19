const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID || '529460717218-ctu9i5t0j1rpa4queenuhvbv0hgtbsvm.apps.googleusercontent.com');
const jwt = require('jsonwebtoken');
const config = require('./../../config.json');

async function googleAuth(req, res) {

    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.CLIENT_ID || '529460717218-ctu9i5t0j1rpa4queenuhvbv0hgtbsvm.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      
      const authToken = jwt.sign({ userId: userid, email: payload.email }, config.secret, { expiresIn: '10m' });

      // Send a success response
      res.status(200).json({
        message: 'Token verified successfully',
        userId: userid,
        payload: payload,
        authtoken: authToken,
        success: true
      });
    } catch (error) {
      console.error('Error verifying token:', error);
  
      // Send an error response
      res.status(401).json({
        message: 'Invalid token',
        error: error.message,
        success: false
      });
    }
  }
  

module.exports = {
    googleAuth: googleAuth,
  };
  