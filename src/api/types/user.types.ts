// User related types from OpenAPI spec

export interface User {
  id: number
  username: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserCreate {
  username: string
  name: string
  password: string
}

export interface UserLogin {
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}
