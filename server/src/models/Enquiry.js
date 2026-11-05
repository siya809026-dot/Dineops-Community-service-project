import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    whatsapp: { type: String, trim: true, maxlength: 30, default: '' },
    city: { type: String, trim: true, maxlength: 100, default: '' },
    state: { type: String, trim: true, maxlength: 100, default: '' },
    restaurantName: { type: String, trim: true, maxlength: 150, default: '' },
    brandName: { type: String, trim: true, maxlength: 150, default: '' },
    restaurantType: { type: String, trim: true, maxlength: 100, default: '' },
    branches: { type: String, trim: true, maxlength: 20, default: '' },
    centralKitchen: { type: String, trim: true, maxlength: 20, default: '' },
    currentSoftware: { type: String, trim: true, maxlength: 150, default: '' },
    modules: { type: [String], default: [] },
    preferredPlan: { type: String, trim: true, maxlength: 60, default: '' },
    onboardingDate: { type: String, trim: true, maxlength: 40, default: '' },
    address: { type: String, trim: true, maxlength: 400, default: '' },
    requirements: { type: String, trim: true, maxlength: 2000, default: '' },
    status: { type: String, enum: ['NEW', 'CONTACTED', 'CLOSED'], default: 'NEW' }
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);
