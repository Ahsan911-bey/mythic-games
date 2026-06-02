import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

async function isAdmin(): Promise<boolean> {
  const userId = await getSessionId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === 'ADMIN';
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const query: string = (body.query || '').trim();

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  // Special command: "/" → parse schema.prisma for model names
  if (query === '/') {
    try {
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      const modelMatches = [...schemaContent.matchAll(/^model\s+(\w+)\s*\{/gm)];
      const models = modelMatches.map((m) => m[1]);

      return NextResponse.json({
        type: 'schema',
        output: models,
      });
    } catch (err: any) {
      return NextResponse.json({ error: `Failed to read schema: ${err.message}` }, { status: 500 });
    }
  }

  // Detect query type: SELECT/SHOW return rows, others use executeRawUnsafe
  const isSelect = /^\s*(SELECT|SHOW|DESCRIBE|DESC|EXPLAIN)\s/i.test(query);

  try {
    if (isSelect) {
      const rows = await prisma.$queryRawUnsafe(query);
      // Prisma returns BigInt values which JSON.stringify can't handle — serialize safely
      const serialized = JSON.parse(
        JSON.stringify(rows, (_key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
      return NextResponse.json({ type: 'select', rows: serialized });
    } else {
      const affected = await prisma.$executeRawUnsafe(query);
      return NextResponse.json({ type: 'execute', affected });
    }
  } catch (err: any) {
    const msg =
      err?.meta?.message || err?.message || 'Unknown database error';
    return NextResponse.json({ type: 'error', error: msg }, { status: 200 });
  }
}
