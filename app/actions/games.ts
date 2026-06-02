'use server';

import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function checkAdmin() {
  const userId = await getSessionId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === 'ADMIN';
}

export async function createGameAction(formData: FormData) {
  if (!(await checkAdmin())) return { error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const coverImage = formData.get('coverImage') as string;
  const releaseDateStr = formData.get('releaseDate') as string;
  const categoryId = parseInt(formData.get('categoryId') as string, 10);

  if (!title || !description || isNaN(price) || !coverImage || !releaseDateStr || isNaN(categoryId)) {
    return { error: 'All fields are required' };
  }

  await prisma.game.create({
    data: {
      title,
      description,
      price,
      coverImage,
      releaseDate: new Date(releaseDateStr),
      categoryId,
    },
  });

  revalidatePath('/admin/games');
  revalidatePath('/');
  revalidatePath('/games');
  redirect('/admin/games');
}

export async function deleteGameAction(gameId: number) {
  if (!(await checkAdmin())) return { error: 'Unauthorized' };

  await prisma.game.delete({ where: { id: gameId } });

  revalidatePath('/admin/games');
  revalidatePath('/');
  revalidatePath('/games');
}
