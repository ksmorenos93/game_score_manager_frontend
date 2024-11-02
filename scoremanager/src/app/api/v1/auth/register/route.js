import {NextResponse} from 'next/server';

export async function POST() {

  const user = {
    username: "routeAPI nuevo usuario registrado exitosamente"
  
  }
  return NextResponse.json(user, {status: 201});
}