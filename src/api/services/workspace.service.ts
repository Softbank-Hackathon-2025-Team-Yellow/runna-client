// Real API service for workspace operations

import { http } from "../http";
import type { IWorkspaceService } from "./types";
import type {
	Workspace,
	WorkspaceCreate,
	WorkspaceUpdate,
	WorkspaceAuthKey,
	WorkspaceMetrics,
	FunctionItem,
	ApiResponse,
} from "../types";

// Helper function to extract workspace from various response formats
const extractWorkspace = (data: ApiResponse<any>): Workspace => {
	console.log("[Workspace API - single] Response data:", data);

	return data.data as Workspace;
};

// Helper function to extract workspaces array from various response formats
const extractWorkspaces = (data: ApiResponse<any>): Workspace[] => {
	console.log("[Workspaces API] Response data:", data.data);

	return data.data?.workspaces || [];
};

// Helper function to extract functions array from various response formats
const extractFunctions = (data: ApiResponse<any>): FunctionItem[] => {
	console.log("[Functions API] Response data:", data.data);

	return data.data?.functions || [];
};

export const workspaceService: IWorkspaceService = {
	async getWorkspaces(): Promise<Workspace[]> {
		const response = await http.get("/workspaces/");
		return extractWorkspaces(response.data);
	},

	async getWorkspace(workspaceId: string): Promise<Workspace> {
		const response = await http.get(`/workspaces/${workspaceId}`);
		return extractWorkspace(response.data);
	},

	async createWorkspace(data: WorkspaceCreate): Promise<Workspace> {
		const response = await http.post("/workspaces/", data);
		return extractWorkspace(response.data);
	},

	async updateWorkspace(
		workspaceId: string,
		data: WorkspaceUpdate
	): Promise<Workspace> {
		const response = await http.put(`/workspaces/${workspaceId}`, data);
		return extractWorkspace(response.data);
	},

	async deleteWorkspace(workspaceId: string): Promise<void> {
		await http.delete(`/workspaces/${workspaceId}`);
	},

	async getApiKey(
		workspaceId: string,
	): Promise<WorkspaceAuthKey> {
		const response = await http.get(`/workspaces/${workspaceId}/api-key`);

		const data = response.data;
		console.log("[Get Workspace API Key API] Response data:", data);
    
    return data.data
	},

	async getMetrics(workspaceId: string): Promise<WorkspaceMetrics> {
		const response = await http.get(`/workspaces/${workspaceId}/metrics`);
		const data = response.data;
		console.log("[Metrics API] Response data:", data);
		// Handle various response formats
		if (data && "total_functions" in data) {
			return data as WorkspaceMetrics;
		}
		if (data && "metrics" in data) {
			return data.metrics as WorkspaceMetrics;
		}
		return data as WorkspaceMetrics;
	},

	async getFunctions(workspaceId: string): Promise<FunctionItem[]> {
		const response = await http.get(`/workspaces/${workspaceId}/functions`);
		return extractFunctions(response.data);
	},
};
