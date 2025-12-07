# Implementation Plan

- [x] 1. Wait for Swagger specification from user
  - User will provide the Swagger/OpenAPI specification document
  - Review the specification to understand all endpoints, schemas, and requirements
  - Identify all API resources and operations
  - _Requirements: All_

- [x] 2. Set up API infrastructure and type system
  - [x] 2.1 Create directory structure for API layer
    - Create `src/api/types/` directory for TypeScript type definitions
    - Create `src/api/services/` directory for real API service implementations
    - Create `src/api/mock/` directory for mock service implementations
    - _Requirements: 7.1, 7.2_
  
  - [x] 2.2 Create common API types
    - Define `ApiResponse<T>` generic wrapper type
    - Define `ApiError` interface for error handling
    - Define `PaginationParams` and `PaginatedResponse<T>` types
    - Create `src/api/types/common.types.ts`
    - _Requirements: 1.1, 1.4_
  
  - [x] 2.3 Generate TypeScript types from Swagger specification
    - Analyze Swagger schemas and create corresponding TypeScript interfaces
    - Create domain-specific type files (e.g., `function.types.ts`, `log.types.ts`)
    - Ensure proper nesting for complex objects
    - Export all types from `src/api/types/index.ts`
    - _Requirements: 1.1, 1.4, 7.2_

- [x] 3. Implement service layer with mock/real switching
  - [x] 3.1 Create service interfaces
    - Define TypeScript interfaces for each service (e.g., `IFunctionService`, `ILogService`)
    - Ensure interfaces cover all CRUD operations and custom endpoints
    - Create `src/api/services/types.ts` for service interfaces
    - _Requirements: 2.1, 4.3_
  
  - [x] 3.2 Implement real API services
    - Create service implementations for each resource using axios HTTP client
    - Implement proper HTTP methods (GET, POST, PUT, DELETE, PATCH) for each operation
    - Ensure correct URL construction with base URL and endpoint paths
    - Add request/response transformation as needed
    - Create files like `src/api/services/function.service.ts`
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [ ]* 3.3 Write property test for service HTTP methods
    - **Property 1: Service HTTP method correctness**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.4 Write property test for service URL construction
    - **Property 2: Service URL construction**
    - **Validates: Requirements 2.5**
  
  - [x] 3.5 Implement mock API services
    - Create mock implementations that satisfy the same service interfaces
    - Use existing mock data from `src/features/*/data/mock*.ts`
    - Add realistic delays using `setTimeout` or `delay` utility
    - Implement error scenarios for testing
    - Create files like `src/api/mock/function.mock.ts`
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ]* 3.6 Write unit tests for mock services
    - Test that mock services return expected data structures
    - Test that delays are simulated
    - Test error scenarios
    - _Requirements: 4.1, 4.4_
  
  - [x] 3.7 Create service factory with environment-based switching
    - Create `src/api/services/index.ts` that exports API object
    - Use `VITE_USE_MOCK_DATA` environment variable to switch between mock and real services
    - Export unified API interface: `api.functions`, `api.logs`, etc.
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ]* 3.8 Write example tests for service factory switching
    - Test that mock services are used when `VITE_USE_MOCK_DATA=true`
    - Test that real services are used when `VITE_USE_MOCK_DATA=false`
    - _Requirements: 4.1, 4.2_

- [x] 4. Enhance HTTP client error handling
  - [x] 4.1 Improve axios interceptors for error handling
    - Enhance response interceptor to transform errors into `ApiError` format
    - Add error categorization (4xx client errors, 5xx server errors, network errors)
    - Add error logging for debugging
    - Keep existing 401 redirect behavior
    - Update `src/api/http.ts`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 4.2 Write property test for error categorization
    - **Property 11: Error type handling**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ]* 4.3 Write property test for error logging
    - **Property 12: Error logging**
    - **Validates: Requirements 6.5**
  
  - [ ]* 4.4 Write example test for network error handling
    - Test that network errors display connectivity messages
    - _Requirements: 6.3_
  
  - [ ]* 4.5 Write example test for authentication error redirect
    - Test that 401 errors trigger redirect to login page
    - _Requirements: 6.4_

- [x] 5. Update existing hooks to use new service layer
  - [x] 5.1 Refactor `useFunctions` hook
    - Update to use `api.functions` from service factory
    - Remove direct mock data imports
    - Ensure loading, error, and data states work correctly
    - Add cleanup to prevent state updates on unmount
    - Update `src/features/gallery/hooks/useFunctions.ts`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2_
  
  - [ ]* 5.2 Write property tests for useFunctions hook states
    - **Property 3: Hook loading state during API calls**
    - **Property 4: Hook error state on failure**
    - **Property 5: Hook data state on success**
    - **Validates: Requirements 3.2, 3.3, 3.4**
  
  - [ ]* 5.3 Write property test for hook unmount safety
    - **Property 6: Hook unmount safety**
    - **Validates: Requirements 3.5**
  
  - [x] 5.4 Create or update other hooks as needed
    - Identify other features that need API integration
    - Create hooks following the same pattern (e.g., `useFunction`, `useLogs`)
    - Ensure consistent error handling and state management
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6. Checkpoint - Verify existing features work with new service layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement UI components for new API endpoints
  - [x] 7.1 Identify missing UI components
    - Review Swagger spec for endpoints without corresponding UI
    - List required pages/components for complete API coverage
    - _Requirements: 5.1_
  
  - [x] 7.2 Create new pages and components
    - Implement pages for new endpoints (e.g., function execution, log viewing)
    - Add loading indicators using `LoadingSpinner` component
    - Add error display using `ErrorMessage` component
    - Ensure UI updates when data changes
    - Add forms with validation where needed
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 7.3 Write property tests for UI loading indicators
    - **Property 8: UI loading indicators**
    - **Validates: Requirements 5.2**
  
  - [ ]* 7.4 Write property tests for UI error display
    - **Property 9: UI error display**
    - **Validates: Requirements 5.3**
  
  - [ ]* 7.5 Write property tests for UI data updates
    - **Property 10: UI data updates**
    - **Validates: Requirements 5.4**

- [x] 8. Add routing for new pages
  - [x] 8.1 Update routing configuration
    - Add routes for new pages in the router
    - Ensure navigation works correctly
    - Update navigation components if needed
    - _Requirements: 5.1_

- [x] 9. Testing and validation
  - [ ]* 9.1 Write integration tests
    - Test complete flows from user action to API call to UI update
    - Test with mock services
    - Test error scenarios
    - _Requirements: All_
  
  - [x] 9.2 Manual testing with mock data
    - Set `VITE_USE_MOCK_DATA=true`
    - Test all features with mock data
    - Verify loading states, error handling, and data display
    - _Requirements: 4.1, 4.4_
  
  - [x] 9.3 Manual testing with real API
    - Set `VITE_USE_MOCK_DATA=false` and configure `VITE_API_URL`
    - Test all features with real API
    - Verify API calls are made correctly
    - Test error scenarios (network errors, 4xx, 5xx)
    - _Requirements: 4.2, 6.1, 6.2, 6.3_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Documentation and cleanup
  - [x] 11.1 Update README with API configuration instructions
    - Document how to set `VITE_USE_MOCK_DATA` and `VITE_API_URL`
    - Provide examples for different environments
    - _Requirements: 4.1, 4.2_
  
  - [x] 11.2 Add code comments and documentation
    - Document service interfaces
    - Add JSDoc comments to public functions
    - Document error handling patterns
    - _Requirements: All_
