import { NextResponse } from 'next/server'; 

export async function GET() {
  const user = {
    username: `scores cargados exitosamente, 
                después lo modificaré cuando cree el backend`
  };
  return NextResponse.json(user, { status: 201 });
}