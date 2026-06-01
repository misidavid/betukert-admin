import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('published_packages')
    .select('manifest')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No published package found' }, { status: 404 });
  }

  return NextResponse.json(data.manifest, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
