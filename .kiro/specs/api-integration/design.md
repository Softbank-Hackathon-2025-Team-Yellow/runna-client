# Design Document

## Overview

This design implements a comprehensive API integration system for the serverless function management platform. The system will support both mock data (for development) and real API calls (for production) through environment variable configuration. The implementation will be based on a Swagger/OpenAPI specification document provided by the user.

The architecture follows a layered approach:
1. **Type Layer**: TypeScript interfaces generated from Swagger spec
2. **Service Layer**: API call functions organized by domain
3. **Hook Layer**: React hooks for state management and API integration
4. **Component Layer**: UI components that consume the hooks

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                        │
│                    (UI/Presentation Layer)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Custom Hooks Layer                       │
│              (State Management & API Integration)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ useFunctions │  │ useFunction  │  │  useLogs     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Environment Switch Layer                      │
│         (Mock vs Real API Decision Point)                    │
│                                                               │
│    if (USE_MOCK_DATA) → Mock Services                       │
│    else → Real API Services                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Mock Services   │          │  API Services    │
│  (Static Data)   │          │  (HTTP Calls)    │
└──────────────────┘          └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   HTTP Client    │
                              │   (Axios)        │
                              └──────────────────┘
```

### Directory Structure

```
src/
├── api/
│   ├── http.ts                    # Axios instance (existing)
│   ├── types/                     # Generated from Swagger
│   │   ├── index.ts
│   │   ├── function.types.ts
│   │   ├── log.types.ts
│   │   └── common.types.ts
│   ├── services/                  # Real API services
│   │   ├── index.ts
│   │   ├── function.service.ts
│   │   ├── log.service.ts
│   │   └── auth.service.ts
│   └── mock/                      # Mock services
│       ├── index.ts
│       ├── function.mock.ts
│       └── log.mock.ts
├── features/
│   └── [feature-name]/
│       ├── hooks/
│       │   └── use[Feature].ts    # Hooks that switch between mock/real
│       ├── data/
│       │   └── mock[Feature].ts   # Mock data (existing)
│       └── types/
│           └── [feature].types.ts # Feature-specific types
```

## Components and Interfaces

### 1. Type Generation System

Types will be manually created based on the Swagger specification. While automated generation tools exist (like `swagger-typescript-api` or `openapi-typescript`), we'll create types manually for better control and understanding.

**Type Organization:**
- `common.types.ts`: Shared types (ApiResponse, ApiError, Pagination, etc.)
- `function.types.ts`: Function-related types
- `log.types.ts`: Log-related types
- Additional files as needed based on Swagger spec

### 2. Service Layer

**Interface Pattern:**
```typescript
// Service interface that both mock and real implementations follow
export interface IFunctionService {
  getFunctions(params?: GetFunctionsParams): Promise<FunctionItem[]>
  getFunction(id: string): Promise<FunctionDetail>
  createFunction(data: CreateFunctionRequest): Promise<FunctionDetail>
  updateFunction(id: string, data: UpdateFunctionRequest): Promise<FunctionDetail>
  deleteFunction(id: string): Promise<void>
  executeFunction(id: string, payload?: any): Promise<ExecutionResult>
}
```

**Real API Service Implementation:**
```typescript
// src/api/services/function.service.ts
import { http } from '../http'
import type { IFunctionService } from './types'

export const functionService: IFunctionService = {
  async getFunctions(params) {
    const response = await http.get('/functions', { params })
    return response.data
  },
  
  async getFunction(id) {
    const response = await http.get(`/functions/${id}`)
    return response.data
  },
  
  // ... other methods
}
```

**Mock Service Implementation:**
```typescript
// src/api/mock/function.mock.ts
import type { IFunctionService } from '../services/types'
import { MOCK_FUNCTIONS } from '@/features/gallery/data/mockFunctions'

export const mockFunctionService: IFunctionService = {
  async getFunctions(params) {
    await delay(500) // Simulate network delay
    return MOCK_FUNCTIONS
  },
  
  async getFunction(id) {
    await delay(300)
    const func = MOCK_FUNCTIONS.find(f => f.id === id)
    if (!func) throw new Error('Function not found')
    return func
  },
  
  // ... other methods
}
```

### 3. Service Factory

A factory pattern to switch between mock and real services:

```typescript
// src/api/services/index.ts
import { functionService } from './function.service'
import { mockFunctionService } from '../mock/function.mock'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const api = {
  functions: USE_MOCK_DATA ? mockFunctionService : functionService,
  logs: USE_MOCK_DATA ? mockLogService : logService,
  // ... other services
}
```

### 4. Custom Hooks

Hooks will use the service factory and provide React-friendly state management:

```typescript
// src/features/gallery/hooks/useFunctions.ts
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/api/services'
import type { FunctionItem } from '@/api/types'

export const useFunctions = () => {
  const [functions, setFunctions] = useState<FunctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFunctions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.functions.getFunctions()
      setFunctions(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFunctions()
  }, [fetchFunctions])

  return { functions, loading, error, refresh: fetchFunctions }
}
```

## Data Models

### Core API Types

```typescript
// Common response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Error handling
export interface ApiError {
  message: string
  status: number
  code?: string
  errors?: Record<string, string[]>
}
```

### Function Types (Example - will be based on actual Swagger spec)

```typescript
export interface FunctionItem {
  id: string
  name: string
  description?: string
  language: string
  runtime: string
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}

export interface FunctionDetail extends FunctionItem {
  code: string
  environment: Record<string, string>
  timeout: number
  memory: number
  lastExecution?: ExecutionSummary
}

export interface CreateFunctionRequest {
  name: string
  description?: string
  language: string
  runtime: string
  code: string
  environment?: Record<string, string>
  timeout?: number
  memory?: number
}

export interface UpdateFunctionRequest extends Partial<CreateFunctionRequest> {}

export interface ExecutionResult {
  executionId: string
  status: 'success' | 'error'
  output?: any
  error?: string
  duration: number
  timestamp: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN the Swagger specification is provided THEN the system SHALL generate TypeScript interfaces for all request and response models
Thoughts: This is about the process of creating types from a spec. Since we're doing manual type creation, this is more of a development task than a testable property. The correctness comes from TypeScript's compile-time checking.
Testable: no

1.2 WHEN API models are updated in the Swagger spec THEN the system SHALL allow regeneration of types without breaking existing code
Thoughts: This is about maintainability and the development process, not a runtime property we can test.
Testable: no

1.3 WHEN generated types are used THEN the system SHALL provide compile-time type checking for API calls
Thoughts: This is handled by TypeScript's type system itself, not something we test at runtime.
Testable: no

1.4 WHEN nested objects exist in the API spec THEN the system SHALL generate properly nested TypeScript interfaces
Thoughts: This is about the structure of type definitions, verified by TypeScript compilation.
Testable: no

2.1 WHEN an API endpoint is defined in the Swagger spec THEN the system SHALL create a corresponding service function
Thoughts: This is about completeness of implementation - ensuring all endpoints are covered. We can verify this by checking that all expected service methods exist.
Testable: yes - example

2.2 WHEN a service function is called THEN the system SHALL use the correct HTTP method (GET, POST, PUT, DELETE, PATCH)
Thoughts: This is about ensuring each service function uses the right HTTP verb. We can test this across all service functions.
Testable: yes - property

2.3 WHEN a service function requires parameters THEN the system SHALL validate parameter types at compile time
Thoughts: This is TypeScript's compile-time checking, not a runtime property.
Testable: no

2.4 WHEN a service function returns data THEN the system SHALL return properly typed response data
Thoughts: TypeScript ensures this at compile time.
Testable: no

2.5 WHEN the API base URL is configured THEN the system SHALL construct full endpoint URLs correctly
Thoughts: This is about URL construction. We can test that service calls construct the expected URLs.
Testable: yes - property

3.1 WHEN a component needs API data THEN the system SHALL provide a custom hook that handles the API call
Thoughts: This is about architecture and completeness, not a testable property.
Testable: no

3.2 WHEN an API call is in progress THEN the system SHALL expose a loading state
Thoughts: This is a property that should hold for all hooks - during an API call, loading should be true.
Testable: yes - property

3.3 WHEN an API call fails THEN the system SHALL expose error information
Thoughts: This is a property that should hold for all hooks - when an error occurs, the error state should be populated.
Testable: yes - property

3.4 WHEN an API call succeeds THEN the system SHALL expose the response data
Thoughts: This is a property that should hold for all hooks - on success, data should be available.
Testable: yes - property

3.5 WHEN a component unmounts during an API call THEN the system SHALL prevent state updates on unmounted components
Thoughts: This is about preventing React warnings and memory leaks. We can test this behavior.
Testable: yes - property

4.1 WHEN `VITE_USE_MOCK_DATA` is true THEN the system SHALL use mock data implementations
Thoughts: This is a configuration test - we can verify the right service is used based on the env var.
Testable: yes - example

4.2 WHEN `VITE_USE_MOCK_DATA` is false THEN the system SHALL use real API service functions
Thoughts: This is a configuration test - we can verify the right service is used based on the env var.
Testable: yes - example

4.3 WHEN switching between mock and real data THEN the system SHALL maintain the same interface and return types
Thoughts: This is about interface compatibility. Both implementations should satisfy the same interface.
Testable: yes - property

4.4 WHEN mock data is used THEN the system SHALL simulate realistic API response delays
Thoughts: This is about mock service behavior - we can verify delays are present.
Testable: yes - example

4.5 WHEN the environment variable changes THEN the system SHALL apply the change after application restart
Thoughts: This is about how environment variables work in Vite, not something we can test in our code.
Testable: no

5.1 WHEN an API endpoint requires a UI screen THEN the system SHALL provide a corresponding page or component
Thoughts: This is about completeness of UI implementation, not a testable property.
Testable: no

5.2 WHEN a user performs an action that calls an API THEN the system SHALL display loading indicators
Thoughts: This is a UI behavior that should hold across all API-calling components.
Testable: yes - property

5.3 WHEN an API call fails THEN the system SHALL display user-friendly error messages
Thoughts: This is a UI behavior that should hold across all components.
Testable: yes - property

5.4 WHEN an API call succeeds THEN the system SHALL update the UI with the new data
Thoughts: This is a general UI behavior - when data changes, UI should reflect it.
Testable: yes - property

5.5 WHEN a form is needed for API input THEN the system SHALL provide proper validation and error handling
Thoughts: This is about form implementation quality, which varies by form.
Testable: no

6.1 WHEN an API call returns a 4xx error THEN the system SHALL display client error messages to the user
Thoughts: This is about error handling behavior across all API calls.
Testable: yes - property

6.2 WHEN an API call returns a 5xx error THEN the system SHALL display server error messages to the user
Thoughts: This is about error handling behavior across all API calls.
Testable: yes - property

6.3 WHEN a network error occurs THEN the system SHALL display connectivity error messages
Thoughts: This is about error handling for network failures.
Testable: yes - example

6.4 WHEN an authentication error occurs THEN the system SHALL redirect to the login page
Thoughts: This is a specific behavior for 401 errors, already implemented in the HTTP interceptor.
Testable: yes - example

6.5 WHEN an error occurs THEN the system SHALL log error details for debugging purposes
Thoughts: This is about logging behavior across all errors.
Testable: yes - property

7.1 WHEN API endpoints are grouped by resource in the Swagger spec THEN the system SHALL organize service functions by the same grouping
Thoughts: This is about code organization, not a testable property.
Testable: no

7.2 WHEN types are generated THEN the system SHALL organize them by domain or resource
Thoughts: This is about code organization, not a testable property.
Testable: no

7.3 WHEN hooks are created THEN the system SHALL organize them by feature or domain
Thoughts: This is about code organization, not a testable property.
Testable: no

7.4 WHEN new endpoints are added THEN the system SHALL follow the established organizational structure
Thoughts: This is about maintaining consistency, not a testable property.
Testable: no

### Property Reflection

After reviewing all testable properties, here are potential redundancies:

- Properties 3.2, 3.3, 3.4 (hook states) and 5.2, 5.3, 5.4 (UI display) are related but test different layers. 3.x tests hook behavior, 5.x tests UI rendering. Both are valuable.
- Properties 6.1, 6.2 test similar error handling patterns but for different error types. These can be combined into one property about error categorization.
- Property 3.5 (unmount safety) is unique and important for React applications.
- Property 4.3 (interface compatibility) is crucial and unique.

**Consolidated Properties:**
- Combine 6.1 and 6.2 into a single property about error type handling
- Keep all other properties as they test distinct behaviors

### Correctness Properties

Property 1: Service HTTP method correctness
*For any* service function, the HTTP method used should match the operation type (GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes)
**Validates: Requirements 2.2**

Property 2: Service URL construction
*For any* service function call, the constructed URL should correctly combine the base URL with the endpoint path
**Validates: Requirements 2.5**

Property 3: Hook loading state during API calls
*For any* custom hook making an API call, the loading state should be true while the call is in progress and false after completion
**Validates: Requirements 3.2**

Property 4: Hook error state on failure
*For any* custom hook making an API call, when the call fails, the error state should contain error information
**Validates: Requirements 3.3**

Property 5: Hook data state on success
*For any* custom hook making an API call, when the call succeeds, the data state should contain the response data
**Validates: Requirements 3.4**

Property 6: Hook unmount safety
*For any* custom hook making an API call, if the component unmounts before the call completes, no state updates should occur
**Validates: Requirements 3.5**

Property 7: Mock and real service interface compatibility
*For any* service interface, both mock and real implementations should satisfy the same TypeScript interface
**Validates: Requirements 4.3**

Property 8: UI loading indicators
*For any* component that triggers an API call, a loading indicator should be displayed while the call is in progress
**Validates: Requirements 5.2**

Property 9: UI error display
*For any* component that makes an API call, when the call fails, an error message should be displayed to the user
**Validates: Requirements 5.3**

Property 10: UI data updates
*For any* component that fetches data via API, when new data is received, the UI should reflect the updated data
**Validates: Requirements 5.4**

Property 11: Error type handling
*For any* API error response, the system should categorize it correctly (4xx as client error, 5xx as server error) and display appropriate messages
**Validates: Requirements 6.1, 6.2**

Property 12: Error logging
*For any* error that occurs during API calls, error details should be logged for debugging purposes
**Validates: Requirements 6.5**

## Error Handling

### HTTP Client Error Handling

The existing HTTP client (axios) already has interceptors for:
- Adding authentication tokens to requests
- Handling 401 errors with redirect to login

We'll enhance this with:
- Centralized error transformation
- Error categorization (client vs server vs network)
- Retry logic for transient failures (optional)

```typescript
// src/api/http.ts enhancements
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 0,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    }
    
    // Log error for debugging
    console.error('[API Error]', apiError)
    
    // Handle specific status codes
    if (apiError.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    return Promise.reject(apiError)
  }
)
```

### Hook-Level Error Handling

Each hook will:
1. Catch errors from service calls
2. Store error in state
3. Provide error information to components
4. Allow error clearing/retry

### Component-Level Error Handling

Components will:
1. Display error messages using ErrorMessage component
2. Provide retry mechanisms where appropriate
3. Show user-friendly error messages

## Testing Strategy

### Unit Testing

We'll use Vitest for unit testing. Focus areas:

1. **Service Layer Tests**
   - Test that service functions call the HTTP client with correct parameters
   - Test URL construction
   - Test request/response transformation
   - Mock axios to avoid real HTTP calls

2. **Mock Service Tests**
   - Test that mock services return expected data structures
   - Test that delays are simulated
   - Test error scenarios

3. **Hook Tests**
   - Test loading states
   - Test error handling
   - Test data fetching
   - Test cleanup on unmount
   - Use React Testing Library

4. **Error Handling Tests**
   - Test error transformation
   - Test error categorization
   - Test 401 redirect behavior

### Property-Based Testing

We'll use `fast-check` for property-based testing in TypeScript/React applications.

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference the design document property with format: `**Feature: api-integration, Property {number}: {property_text}**`

**Property Test Examples:**

1. **Service Interface Compatibility** (Property 7)
   - Generate random service method calls
   - Verify both mock and real services have the same methods
   - Verify return types are compatible

2. **Hook State Transitions** (Properties 3, 4, 5)
   - Generate random API responses (success/error)
   - Verify loading → false transition
   - Verify error state populated on failure
   - Verify data state populated on success

3. **Error Categorization** (Property 11)
   - Generate random HTTP status codes
   - Verify 4xx categorized as client errors
   - Verify 5xx categorized as server errors

### Integration Testing

1. **End-to-End Hook Tests**
   - Test complete flow from hook call to UI update
   - Test with both mock and real services (using test API)

2. **Component Integration Tests**
   - Test components with real hooks
   - Verify loading, error, and success states render correctly

### Testing Organization

```
src/
├── api/
│   ├── services/
│   │   ├── function.service.test.ts
│   │   └── log.service.test.ts
│   ├── mock/
│   │   ├── function.mock.test.ts
│   │   └── log.mock.test.ts
│   └── http.test.ts
├── features/
│   └── [feature]/
│       └── hooks/
│           └── use[Feature].test.ts
```

## Implementation Notes

### Swagger Specification Handling

1. User will provide Swagger/OpenAPI spec (JSON or YAML)
2. We'll manually review the spec to understand:
   - Available endpoints
   - Request/response schemas
   - Authentication requirements
   - Error responses
3. Create TypeScript types based on schemas
4. Implement service functions for each endpoint
5. Update or create hooks as needed
6. Create/update UI components for new endpoints

### Migration Strategy

1. **Phase 1**: Set up infrastructure
   - Create type definitions
   - Set up service layer structure
   - Create service factory

2. **Phase 2**: Migrate existing features
   - Update existing hooks to use new service layer
   - Ensure mock data still works
   - Test with VITE_USE_MOCK_DATA=true

3. **Phase 3**: Implement real API services
   - Implement service functions based on Swagger
   - Test with VITE_USE_MOCK_DATA=false
   - Handle any API-specific requirements

4. **Phase 4**: Add new features
   - Create UI for any missing endpoints
   - Implement corresponding hooks and services

### Environment Configuration

```env
# Development with mock data
VITE_USE_MOCK_DATA=true
VITE_API_URL=

# Development/Production with real API
VITE_USE_MOCK_DATA=false
VITE_API_URL=https://api.example.com
```

## Dependencies

Existing dependencies should be sufficient:
- `axios`: HTTP client (already installed)
- `react`: For hooks
- `typescript`: For type safety

For testing:
- `vitest`: Unit testing
- `@testing-library/react`: React component testing
- `@testing-library/react-hooks`: Hook testing
- `fast-check`: Property-based testing
- `msw`: Mock Service Worker for API mocking in tests (optional)

## Next Steps

After design approval, the implementation plan will:
1. Wait for user to provide Swagger specification
2. Analyze Swagger spec and create type definitions
3. Implement service layer (both real and mock)
4. Update existing hooks to use new service layer
5. Create new hooks for additional endpoints
6. Implement UI components for new features
7. Write tests (unit and property-based)
8. Validate with both mock and real API modes
