import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { WorkspacesPage } from './pages/WorkspacesPage'
import { WorkspaceDetailPage } from './pages/WorkspaceDetailPage'
import FunctionGalleryPage from './pages/FunctionGalleryPage'
import CreateFunctionPage from './pages/CreateFunctionPage'
import FunctionDetailPage from './pages/FunctionDetailPage'
import FunctionLogsPage from './pages/FunctionLogsPage'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspaces/:workspaceId" element={<WorkspaceDetailPage />} />
        <Route path="/gallery" element={<FunctionGalleryPage />} />
        <Route path="/create" element={<CreateFunctionPage />} />
        <Route path="/functions/:functionId" element={<FunctionDetailPage />} />
        <Route path="/functions/:functionId/logs" element={<FunctionLogsPage />} />
        <Route path="/edit/:functionId" element={<CreateFunctionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
