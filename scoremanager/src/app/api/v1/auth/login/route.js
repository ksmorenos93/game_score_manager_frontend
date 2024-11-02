import {NextResponse} from 'next/server';

export async function POST() {

  const user = {
    username: "routeAPI usuario logeado exitosamente"
  
  }
  return NextResponse.json(user, {status: 201});
}