// Real API service for user operations

import { http } from '../http'
import type { IUserService } from './types'
import type { User, UserCreate, UserLogin, Token } from '../types'

export const userService: IUserService = {
  async register(user: UserCreate): Promise<User> {
    const response = await http.post<User>('/users/register', user)
    return response.data
  },

  async login(credentials: UserLogin): Promise<Token> {
    const response = await http.post<Token>('/users/login', credentials)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await http.get<User>('/users/me')
    return response.data
  },
}
