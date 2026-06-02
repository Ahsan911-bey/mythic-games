'use server';

import { prisma } from '@/lib/prisma';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  await setSession(user.id);
  redirect('/');
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: 'User already exists' };
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
