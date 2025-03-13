import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { NextRequest, NextResponse } from 'next/server';

import { middleware, resetAuthClient } from '../middleware';

describe('Middleware', () => {
  // HTTP kérés szimulálása
  // A kérés tartalmaz egy cookie fejlécet
  // hogy utánozza egy bejelentkezett felhasználó böngészőjét
  // middleware(mockRequest) az admin oldalra irányítást szimulálja (?)
  const mockRequest = new NextRequest('http://localhost:3000/admin', {
    headers: new Headers({
      cookie: 'test-cookie',
    }),
  });

  // Minden teszt előtt meghívódik
  beforeEach(() => {
    // Visszaállítja az authentikációs klienst
    resetAuthClient();
    // Visszaállítja az összes kamu adatot
    mock.restore();
  });

  test('should allow admin users to access admin routes', async () => {
    // A createAuthClient-et indítom kamu adatokkal (admin felhasználót ad vissza)
    mock.module('better-auth/client', () => ({
      createAuthClient: () => ({
        getSession: () =>
          Promise.resolve({
            data: {
              user: {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                emailVerified: true,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }),
      }),
    }));

    const response = await middleware(mockRequest);
    // A bejelentkezett admin felhasználótól várt válasz
    expect(response).toBeInstanceOf(NextResponse);
    // A válaszban nem szerepelhet átirányítás
    const location = response.headers.get('location');
    expect(location).toBeNull(); // nincs átirányítás
  });

  test('should redirect non-admin users from admin routes', async () => {
    // A createAuthClient-et indítom kamu adatokkal (sima felhasználót ad vissza)
    mock.module('better-auth/client', () => ({
      createAuthClient: () => ({
        getSession: () =>
          Promise.resolve({
            data: {
              user: {
                id: '2',
                name: 'Regular User',
                email: 'user@example.com',
                emailVerified: true,
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }),
      }),
    }));

    const response = await middleware(mockRequest);
    // A válaszban átirányítás kell legyen !!
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  test('should redirect when no session exists', async () => {
    // a createAuthClient-et indítom kamu adatokkal (nincs bejelentkezett felhasználó)
    mock.module('better-auth/client', () => ({
      createAuthClient: () => ({
        getSession: () =>
          Promise.resolve({
            data: null,
          }),
      }),
    }));

    const response = await middleware(mockRequest);
    // A válaszban átirányítás kell legyen !!
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });
});
