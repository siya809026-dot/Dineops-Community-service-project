import express from 'express';

import Enquiry from '../models/Enquiry.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUBLIC: "Get Started" form on the landing page
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.ownerName || !body.email || !body.phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required.'
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(String(body.email))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const enquiry = await Enquiry.create({
      ownerName: body.ownerName,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp,
      city: body.city,
      state: body.state,
      restaurantName: body.restaurantName,
      brandName: body.brandName,
      restaurantType: body.restaurantType,
      branches: String(body.branches ?? ''),
      centralKitchen: String(body.centralKitchen ?? ''),
      currentSoftware: body.currentSoftware,
      modules: Array.isArray(body.modules) ? body.modules.slice(0, 20).map(String) : [],
      preferredPlan: body.preferredPlan,
      onboardingDate: body.onboardingDate,
      address: body.address,
      requirements: body.requirements
    });

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully! Our team will contact you soon.',
      enquiryId: enquiry._id
    });
  } catch (error) {
    console.error('Create Enquiry Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your enquiry. Please try again.'
    });
  }
});

// OWNER ONLY: view enquiries
router.get('/', protect, authorize('OWNER'), async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(200);
    return res.status(200).json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    console.error('Get Enquiries Error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load enquiries.' });
  }
});

export default router;
