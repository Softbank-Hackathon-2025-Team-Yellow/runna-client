// Mock service for user operations

import type { IUserService } from '../services/types'
import type { User, UserCreate, UserLogin, Token } from '../types'
import { delay } from './utils'

const MOCK_USER: User = {
  id: 1,
  username: 'testuser',
  name: 'Test User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const MOCK_TOKEN: Token = {
  access_token: 'mock_jwt_token_12345',
  token_type: 'bearer',
}

export const mockUserService: IUserService = {
  async register(user: UserCreate): Promise<User> {
    await delay(500)
    return {
      ...MOCK_USER,
      username: user.username,
      name: user.name,
      id: Math.floor(Math.random() * 1000),
    }
  },

  async login(credentials: UserLogin): Promise<Token> {
    await delay(300)
    if (credentials.username === 'error') {
      throw new Error('Invalid credentials')
    }
    return MOCK_TOKEN
  },

  async getCurrentUser(): Promise<User> {
    await delay(200)
    return MOCK_USER
  },
}
