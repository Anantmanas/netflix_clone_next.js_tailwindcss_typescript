import bcrypt from 'bcrypt';
import {NextApiRequest, NextApiResponse} from 'next'
import prismadb from '@/lib/prismadb';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== 'POST'){
         res.status(405).end();
         return;
    }
    try{
     const {email, name, password} = req.body;

     if (!email || !name || !password) {
        res.status(400).json({ error: 'Missing required fields' });
      }

     const existingUser = await prismadb.user.findUnique({
        where:{
            email,
        }
     })
     if(existingUser){
        res.status(422).json({error:'Email is already taken'});
        return;
     }
     
     const hashedPassword = await bcrypt.hash(password,12)
     const user = await prismadb.user.create({
        data:{
            email,
            name,
            hashedPassword,
            image:'',
            emailVerified: new Date(),
        }
     })
     res.status(200).json(user);
    }
    catch(err){
        console.log(err);
         res.status(400).json({ error: `Something went wrong: ${err}` });
    }
}