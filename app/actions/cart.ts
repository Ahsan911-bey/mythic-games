'use server';

import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToCartAction(gameId: number) {
  const userId = await getSessionId();
  if (!userId) {
    redirect('/login');
  }

  // Check if game is already in user library
  const inLibrary = await prisma.userLibrary.findUnique({
    where: {
      userId_gameId: { userId, gameId },
    },
  });

  if (inLibrary) {
    return { error: 'You already own this game' };
  }

  // Check if already in cart
  const inCart = await prisma.cartItem.findUnique({
    where: {
      userId_gameId: { userId, gameId },
    },
  });

  if (!inCart) {
    await prisma.cartItem.create({
      data: { userId, gameId, quantity: 1 },
    });
  }

  revalidatePath('/cart');
  redirect('/cart');
}

export async function removeFromCartAction(cartItemId: number) {
  const userId = await getSessionId();
  if (!userId) return { error: 'Unauthorized' };

  await prisma.cartItem.delete({
    where: { id: cartItemId, userId },
  });

  revalidatePath('/cart');
}

export async function checkoutAction() {
  const userId = await getSessionId();
  if (!userId) redirect('/login');

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { game: true },
  });

  if (cartItems.length === 0) {
    return { error: 'Cart is empty' };
  }

  const totalAmount = cartItems.reduce((acc, item) => acc + item.game.price * item.quantity, 0);

  // Create Order and Library Entries in a transaction
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
      },
    });

    for (const item of cartItems) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          gameId: item.gameId,
          priceAtPurchase: item.game.price,
          quantity: item.quantity,
        },
      });

      await tx.userLibrary.create({
        data: {
          userId,
          gameId: item.gameId,
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { userId },
    });
  });

  revalidatePath('/library');
  revalidatePath('/cart');
  redirect('/library');
}
