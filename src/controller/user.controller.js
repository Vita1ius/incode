import * as userRepository from '../repository/user.repository.js'
import { hash } from '../service/password-hasher.js';
import jwt from 'jsonwebtoken';
const secretKey = 'your-secret-key';


export const createUser = async (req, res) => {
  const { username, password, role, bossId } = req.body;

  try {
    if (role !== 'ADMINISTRATOR' && !bossId) {
      return res.status(400).json({ msg: 'Regular user or boss must have a boss.' });
    }

    if ((role === 'USER' || role === 'BOSS') && bossId) {
      const boss = await userRepository.findById(bossId);
      if (!boss) {
        return res.status(400).json({ msg: 'Invalid boss ID.' });
      }
    
      if (boss.role === 'USER') {
        await userRepository.updateRole(bossId, 'BOSS');
      }
    }

    const hashedPassword = await hash(password);
    const user = await userRepository.create(username, hashedPassword, role, bossId);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export const login = async (req, res) => {
  const {username, password} = req.body
  const user = await userRepository.login(username);
  if(user){
    const hashedPassword = await hash(password);
    if(hashedPassword === user.passwordHash){
      const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });
      res.json({token})
    }else{
      res.status(400).json({msg: 'Wrong username or password'})
    }
  }else{
    res.status(400).json({msg: 'Wrong username or password'})
  }
}

export const getUsersByRole= async (req, res) => {
  const user = req.user;
  const {role, id } =user;
  try {
    const users = await userRepository.getUsersByRole(role, id);
    res.json({users})
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
}

export const changeUserBoss= async (req, res) => {
  const user = req.user;
  const {role, id } =user;
  const {newBossId, subordinateId} = req.body
  
  const newBoss = await userRepository.findById(newBossId)
  if (!newBoss) {
    res.status(400).json({msg: 'New boss not found'})
  }

  if(role === 'BOSS'){
    const subordinate = await userRepository.findById(subordinateId);
    if(id === subordinate.bossId){
      await userRepository.changeBoss(newBossId,subordinate.id)
      if(newBoss.role === 'USER'){
        await userRepository.updateRole(newBoss.id,"BOSS")
      }
      const countOfSubordinates = await userRepository.countOfSubordinates(id)
      if(countOfSubordinates === 0){
        await userRepository.updateRole(id,"USER")
        res.status(200).json({msg: 'The boss has been replaced. You have no more subordinates. Now your role is User'})
      }else{
        res.status(200).json({msg: 'success'})
      }
    }
  }

}

