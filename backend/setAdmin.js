import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const EMAILS = ['erickramos@gmail.com', 'avilafernandaa@gmail.com', 'teteus2@gmail.com'];

async function setAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: EMAILS });
  if (!user) {
    console.log('Usuário não encontrado');
    return;
  }
  user.isAdmin = true;
  await user.save();
  console.log('Usuário agora é admin:', user.email);
  mongoose.disconnect();
}

setAdmin();
