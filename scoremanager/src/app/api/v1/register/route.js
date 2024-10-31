import {NextResponse} from 'next/server';

export async function POST() {

  const user = {
    username: "routeAPI respuesta"
  
  }
  return NextResponse.json(user, {status: 201});
}