import { relations } from "drizzle-orm/relations";
import { users, sessions, organizations, invitations, members, employees, leaveBalances, attendanceRecords, employeeSalarySettings, payrollRecords, leaveRequests, jobApplications, aiScreeningResults, accounts, jobPostings } from "./schema";

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	invitations: many(invitations),
	members: many(members),
	employees: many(employees),
	accounts: many(accounts),
}));

export const invitationsRelations = relations(invitations, ({one, many}) => ({
	organization: one(organizations, {
		fields: [invitations.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [invitations.inviterId],
		references: [users.id]
	}),
	employees: many(employees),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	invitations: many(invitations),
	members: many(members),
	employees: many(employees),
	aiScreeningResults: many(aiScreeningResults),
	jobApplications: many(jobApplications),
	jobPostings: many(jobPostings),
}));

export const membersRelations = relations(members, ({one, many}) => ({
	organization: one(organizations, {
		fields: [members.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [members.userId],
		references: [users.id]
	}),
	employees: many(employees),
}));

export const employeesRelations = relations(employees, ({one, many}) => ({
	user: one(users, {
		fields: [employees.userId],
		references: [users.id]
	}),
	organization: one(organizations, {
		fields: [employees.organizationId],
		references: [organizations.id]
	}),
	member: one(members, {
		fields: [employees.memberId],
		references: [members.id]
	}),
	invitation: one(invitations, {
		fields: [employees.invitationId],
		references: [invitations.id]
	}),
	leaveBalances: many(leaveBalances),
	attendanceRecords: many(attendanceRecords),
	employeeSalarySettings_employeeId: many(employeeSalarySettings, {
		relationName: "employeeSalarySettings_employeeId_employees_id"
	}),
	employeeSalarySettings_updatedBy: many(employeeSalarySettings, {
		relationName: "employeeSalarySettings_updatedBy_employees_id"
	}),
	payrollRecords_employeeId: many(payrollRecords, {
		relationName: "payrollRecords_employeeId_employees_id"
	}),
	payrollRecords_generatedBy: many(payrollRecords, {
		relationName: "payrollRecords_generatedBy_employees_id"
	}),
	leaveRequests_employeeId: many(leaveRequests, {
		relationName: "leaveRequests_employeeId_employees_id"
	}),
	leaveRequests_approvedBy: many(leaveRequests, {
		relationName: "leaveRequests_approvedBy_employees_id"
	}),
	aiScreeningResults: many(aiScreeningResults),
	jobApplications: many(jobApplications),
}));

export const leaveBalancesRelations = relations(leaveBalances, ({one}) => ({
	employee: one(employees, {
		fields: [leaveBalances.employeeId],
		references: [employees.id]
	}),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({one}) => ({
	employee: one(employees, {
		fields: [attendanceRecords.employeeId],
		references: [employees.id]
	}),
}));

export const employeeSalarySettingsRelations = relations(employeeSalarySettings, ({one}) => ({
	employee_employeeId: one(employees, {
		fields: [employeeSalarySettings.employeeId],
		references: [employees.id],
		relationName: "employeeSalarySettings_employeeId_employees_id"
	}),
	employee_updatedBy: one(employees, {
		fields: [employeeSalarySettings.updatedBy],
		references: [employees.id],
		relationName: "employeeSalarySettings_updatedBy_employees_id"
	}),
}));

export const payrollRecordsRelations = relations(payrollRecords, ({one}) => ({
	employee_employeeId: one(employees, {
		fields: [payrollRecords.employeeId],
		references: [employees.id],
		relationName: "payrollRecords_employeeId_employees_id"
	}),
	employee_generatedBy: one(employees, {
		fields: [payrollRecords.generatedBy],
		references: [employees.id],
		relationName: "payrollRecords_generatedBy_employees_id"
	}),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({one}) => ({
	employee_employeeId: one(employees, {
		fields: [leaveRequests.employeeId],
		references: [employees.id],
		relationName: "leaveRequests_employeeId_employees_id"
	}),
	employee_approvedBy: one(employees, {
		fields: [leaveRequests.approvedBy],
		references: [employees.id],
		relationName: "leaveRequests_approvedBy_employees_id"
	}),
}));

export const aiScreeningResultsRelations = relations(aiScreeningResults, ({one}) => ({
	jobApplication: one(jobApplications, {
		fields: [aiScreeningResults.jobApplicationId],
		references: [jobApplications.id]
	}),
	organization: one(organizations, {
		fields: [aiScreeningResults.organizationId],
		references: [organizations.id]
	}),
	employee: one(employees, {
		fields: [aiScreeningResults.screenedByEmployeeId],
		references: [employees.id]
	}),
}));

export const jobApplicationsRelations = relations(jobApplications, ({one, many}) => ({
	aiScreeningResults: many(aiScreeningResults),
	jobPosting: one(jobPostings, {
		fields: [jobApplications.jobPostingId],
		references: [jobPostings.id]
	}),
	organization: one(organizations, {
		fields: [jobApplications.organizationId],
		references: [organizations.id]
	}),
	employee: one(employees, {
		fields: [jobApplications.reviewedByEmployeeId],
		references: [employees.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const jobPostingsRelations = relations(jobPostings, ({one, many}) => ({
	jobApplications: many(jobApplications),
	organization: one(organizations, {
		fields: [jobPostings.organizationId],
		references: [organizations.id]
	}),
}));