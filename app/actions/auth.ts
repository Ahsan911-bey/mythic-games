'use server';

import { prisma } from '@/lib/prisma';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  await setSession(user.id);
  redirect('/');
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  await setSession(user.id);
  redirect('/');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}
