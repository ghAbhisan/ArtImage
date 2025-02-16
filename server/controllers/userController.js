import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import crypto from 'crypto';



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const type = req.body.type || 'user';

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please fill in all fields' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            type
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, creditBalance: user.creditBalance, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        // if (!userId || !planId) {
        //     return res.json({ success: false, message: 'Missing Details' });
        // }

        const userData = await userModel.findById(userId);
        // if (!userData) {
        //     return res.json({ success: false, message: 'User not found' });
        // }

        if (!userId || !planId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        let credits, plan, date, amount

        switch (planId) {
            case 'Basic':
                credits = 100;
                amount = 800;
                plan = 'Basic';
                break;
            case 'Advanced':
                credits = 500;
                amount = 4000;
                plan = 'Advanced';
                break;
            case 'Business':
                credits = 5000;
                amount = 24000;
                plan = 'Business';
                break;
            default:
                return res.json({ success: false, message: 'Invalid Plan' });
        } 
        date = Date.now();

        

        const transactionData = {
            userId,
            plan,
            credits,
            amount,
            date,
        };

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error.message });
            }
            res.json({ success: true, order});
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    // console.log(razorpay_order_id)
    try {
        const { razorpay_order_id } = req.body;

        // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        //     return res.json({ success: false, message: 'Missing payment details' });
        // }

        // const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        //     .update(razorpay_order_id + "|" + razorpay_payment_id)
        //     .digest('hex');

        // if (generated_signature !== razorpay_signature) {
        //     return res.json({ success: false, message: 'Invalid signature' });
        // }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            // console.log('Transaction Data:', transactionData);

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed!' });
            }

            const userData = await userModel.findById(transactionData.userId);
            // console.log('User Data:', userData);

            const creditBalance = userData.creditBalance + transactionData.credits;
            // console.log('New Credit Balance:', creditBalance);
            await userModel.findByIdAndUpdate(userData._id, {creditBalance});

            await transactionModel.findByIdAndUpdate(transactionData._id, {payment: true});

            res.json({ success: true, message: 'Payment Successful, Credits Added :)' });
        } else {
            res.json({ success: false, message: 'Payment Failed!' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };