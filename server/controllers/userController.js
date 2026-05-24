import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from '../models/transactionModel.js';

// Register a new user
const registerUser  = async (req,res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData= {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({success: true, token, user: {name: user.name}});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false,message: 'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            return res.json({success: true, token, user: {name: user.name}});
        }
        else{
            return res.json({success: false, message: 'Invalid Credentials'});
        }
    }catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const userCredits = async (req,res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        res.json({success: true, credits: user.creditBalance, user: {name: user.name}});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }

}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});






const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { planId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            console.log("DEBUG PAYLOAD:", { userId, planId });
            return res.json({ success: false, message: `Missing Details - userId: ${userId}, planId: ${planId}` });
        }

        let credits, plan, amount, date;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.json({ success: false, message: 'Invalid Plan Selected' });
        }

        date = Date.now();

        const transactionData = {
            userId,
            plan,
            credits,
            amount,
            date
        };

        // Fixed: Added 'new' keyword and saved to DB to persist the transaction 
        const newTransaction = new transactionModel(transactionData);
        await newTransaction.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: newTransaction._id.toString(), // Convert ObjectId to string safely
        };

        // Fixed: Use modern async/await for Razorpay order generation without error-prone callbacks
        const order = await razorpayInstance.orders.create(options);

        // Update transaction record with the generated order ID
        await transactionModel.findByIdAndUpdate(newTransaction._id, { orderId: order.id });

        // Return order directly to the React frontend
        return res.json({ success: true, order });

    } catch (error) {
        console.log("Razorpay Order Creation Error:", error);
        return res.json({ success: false, message: error.message });
    }
}









import crypto from 'crypto'; // Ensure this is at the very top of your userController.js file

const verifyRazorPay = async (req, res) => {
    try {
        // 1. Destructure the full payload sent by the Razorpay frontend handler
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Missing Razorpay payment fields." });
        }

        // 2. Generate the expected signature using your local Secret Key
        const secureString = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(secureString.toString())
            .digest('hex');

        // 3. Match the signature to prove the payment is valid
        if (expectedSignature === razorpay_signature) {
            
            // Fetch order information from Razorpay to locate our database receipt ID
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
            const transactionData = await transactionModel.findById(orderInfo.receipt);

            if (!transactionData) {
                return res.json({ success: false, message: 'Transaction record not found in database.' });
            }

            // Check if this transaction has already been added to avoid duplicates
            if (transactionData.payment === true) {
                return res.json({ success: false, message: 'Payment already processed and credits added.' });
            }

            // 4. Update the user's credit balance
            const userData = await userModel.findById(transactionData.userId);
            const updatedCreditBalance = userData.creditBalance + transactionData.credits;
            
            await userModel.findByIdAndUpdate(transactionData.userId, { creditBalance: updatedCreditBalance });
            
            // 5. Update the transaction status to true
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            return res.json({ 
                success: true, 
                message: 'Credits added successfully!', 
                credits: updatedCreditBalance 
            });

        } else {
            return res.json({ success: false, message: 'Payment verification failed. Invalid signature.' });
        }

    } catch (error) {
        console.log("Verification error log:", error);
        res.json({ success: false, message: error.message });
    }
}





export {registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorPay};