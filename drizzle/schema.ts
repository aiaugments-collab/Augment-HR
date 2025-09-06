import { pgTable, foreignKey, unique, text, timestamp, uuid, integer, boolean, numeric, date, json, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const aiRecommendation = pgEnum("ai_recommendation", ['shortlist', 'reject'])
export const applicationStatus = pgEnum("application_status", ['applied', 'shortlisted', 'interviewed', 'hired', 'rejected'])
export const attachmentTypes = pgEnum("attachment_types", ['image', 'video', 'audio', 'document'])
export const attendanceStatus = pgEnum("attendance_status", ['clocked_in', 'clocked_out', 'break_start', 'break_end'])
export const department = pgEnum("department", ['engineering', 'product', 'system_administration', 'business_analysis', 'founder_office', 'human_resources'])
export const documentType = pgEnum("document_type", ['policy', 'handbook', 'form', 'contract', 'notice', 'procedure', 'manual', 'other'])
export const documentVisibility = pgEnum("document_visibility", ['all', 'employees', 'managers', 'hr', 'private'])
export const employeeDesignation = pgEnum("employee_designation", ['software_engineer', 'product_manager', 'designer', 'data_scientist', 'quality_assurance', 'devops_engineer', 'system_administrator', 'business_analyst', 'project_manager', 'hr', 'founder'])
export const employeeStatus = pgEnum("employee_status", ['active', 'invited', 'terminated', 'resigned', 'on_leave'])
export const invitationRole = pgEnum("invitation_role", ['admin', 'member', 'guest'])
export const invitationStatus = pgEnum("invitation_status", ['pending', 'accepted', 'rejected', 'canceled'])
export const jobLocationType = pgEnum("job_location_type", ['remote', 'onsite', 'hybrid'])
export const jobStatus = pgEnum("job_status", ['open', 'closed', 'draft'])
export const leaveStatus = pgEnum("leave_status", ['pending', 'approved', 'rejected', 'cancelled'])
export const leaveType = pgEnum("leave_type", ['annual', 'sick', 'casual', 'maternity', 'paternity', 'emergency'])
export const orgMemberRole = pgEnum("org_member_role", ['owner', 'admin', 'member'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'paid', 'cancelled'])
export const userRole = pgEnum("user_role", ['super_admin', 'user'])


export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	impersonatedBy: text("impersonated_by"),
	activeOrganizationId: text("active_organization_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const organizations = pgTable("organizations", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text(),
	logo: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	metadata: text(),
}, (table) => [
	unique("organizations_slug_unique").on(table.slug),
]);

export const invitations = pgTable("invitations", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	email: text().notNull(),
	role: invitationRole(),
	status: invitationStatus().default('pending').notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	inviterId: text("inviter_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "invitations_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [users.id],
			name: "invitations_inviter_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const members = pgTable("members", {
	id: text().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),
	role: orgMemberRole().default('member').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "members_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "members_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const employees = pgTable("employees", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id"),
	organizationId: text("organization_id").notNull(),
	memberId: text("member_id"),
	invitationId: text("invitation_id"),
	designation: employeeDesignation().notNull(),
	department: department().notNull(),
	status: employeeStatus().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "employees_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "employees_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "employees_member_id_members_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitationId],
			foreignColumns: [invitations.id],
			name: "employees_invitation_id_invitations_id_fk"
		}).onDelete("set null"),
]);

export const leaveBalances = pgTable("leave_balances", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	leaveType: leaveType("leave_type").notNull(),
	totalAllowed: integer("total_allowed").default(0).notNull(),
	used: integer().default(0).notNull(),
	remaining: integer().default(0).notNull(),
	year: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "leave_balances_employee_id_employees_id_fk"
		}).onDelete("cascade"),
]);

export const leavePolicies = pgTable("leave_policies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	leaveType: leaveType("leave_type").notNull(),
	defaultAllowance: integer("default_allowance").notNull(),
	carryForward: boolean("carry_forward").default(false).notNull(),
	maxCarryForward: integer("max_carry_forward").default(0),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	role: userRole().notNull(),
	banned: boolean(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const attendanceRecords = pgTable("attendance_records", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	clockInTime: timestamp("clock_in_time", { mode: 'string' }).notNull(),
	clockOutTime: timestamp("clock_out_time", { mode: 'string' }),
	breakStartTime: timestamp("break_start_time", { mode: 'string' }),
	breakEndTime: timestamp("break_end_time", { mode: 'string' }),
	totalWorkingMinutes: integer("total_working_minutes").default(0),
	totalBreakMinutes: integer("total_break_minutes").default(0),
	status: attendanceStatus().default('clocked_out').notNull(),
	notes: text(),
	locationClockIn: text("location_clock_in"),
	locationClockOut: text("location_clock_out"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "attendance_records_employee_id_employees_id_fk"
		}).onDelete("cascade"),
]);

export const employeeSalarySettings = pgTable("employee_salary_settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	baseSalary: numeric("base_salary", { precision: 12, scale:  2 }).notNull(),
	currency: text().default('USD').notNull(),
	taxPercentage: numeric("tax_percentage", { precision: 5, scale:  2 }).default('13'),
	customTaxAmount: numeric("custom_tax_amount", { precision: 12, scale:  2 }),
	monthlyAllowances: numeric("monthly_allowances", { precision: 12, scale:  2 }).default('0'),
	isActive: boolean("is_active").default(true).notNull(),
	updatedBy: uuid("updated_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "employee_salary_settings_employee_id_employees_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [employees.id],
			name: "employee_salary_settings_updated_by_employees_id_fk"
		}),
	unique("employee_salary_settings_employee_id_unique").on(table.employeeId),
]);

export const payrollRecords = pgTable("payroll_records", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	payrollMonth: text("payroll_month").notNull(),
	baseSalary: numeric("base_salary", { precision: 12, scale:  2 }).notNull(),
	bonuses: numeric({ precision: 12, scale:  2 }).default('0'),
	allowances: numeric({ precision: 12, scale:  2 }).default('0'),
	totalWorkingDays: integer("total_working_days").default(30).notNull(),
	unpaidLeaveDays: integer("unpaid_leave_days").default(0),
	perDayRate: numeric("per_day_rate", { precision: 12, scale:  2 }).notNull(),
	leaveDeduction: numeric("leave_deduction", { precision: 12, scale:  2 }).default('0'),
	taxPercentage: numeric("tax_percentage", { precision: 5, scale:  2 }).default('0'),
	taxDeduction: numeric("tax_deduction", { precision: 12, scale:  2 }).default('0'),
	grossPay: numeric("gross_pay", { precision: 12, scale:  2 }).notNull(),
	totalDeductions: numeric("total_deductions", { precision: 12, scale:  2 }).notNull(),
	netPay: numeric("net_pay", { precision: 12, scale:  2 }).notNull(),
	currency: text().default('USD').notNull(),
	paymentStatus: paymentStatus("payment_status").default('pending').notNull(),
	paymentDate: timestamp("payment_date", { mode: 'string' }),
	paymentReference: text("payment_reference"),
	generatedBy: uuid("generated_by").notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "payroll_records_employee_id_employees_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.generatedBy],
			foreignColumns: [employees.id],
			name: "payroll_records_generated_by_employees_id_fk"
		}),
]);

export const leaveRequests = pgTable("leave_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	leaveType: leaveType("leave_type").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	totalDays: integer("total_days").notNull(),
	reason: text().notNull(),
	status: leaveStatus().default('pending').notNull(),
	approvedBy: uuid("approved_by"),
	approvedAt: date("approved_at"),
	rejectionReason: text("rejection_reason"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "leave_requests_employee_id_employees_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.approvedBy],
			foreignColumns: [employees.id],
			name: "leave_requests_approved_by_employees_id_fk"
		}),
]);

export const aiScreeningResults = pgTable("ai_screening_results", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	jobApplicationId: uuid("job_application_id").notNull(),
	organizationId: text("organization_id").notNull(),
	matchScore: integer("match_score").notNull(),
	confidence: integer().notNull(),
	recommendation: aiRecommendation().notNull(),
	matchedSkills: json("matched_skills").default([]).notNull(),
	missingSkills: json("missing_skills").default([]).notNull(),
	summary: text().notNull(),
	aiModel: text("ai_model"),
	processingTime: integer("processing_time"),
	screenedAt: timestamp("screened_at", { mode: 'string' }).defaultNow().notNull(),
	screenedByEmployeeId: uuid("screened_by_employee_id"),
}, (table) => [
	foreignKey({
			columns: [table.jobApplicationId],
			foreignColumns: [jobApplications.id],
			name: "ai_screening_results_job_application_id_job_applications_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "ai_screening_results_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.screenedByEmployeeId],
			foreignColumns: [employees.id],
			name: "ai_screening_results_screened_by_employee_id_employees_id_fk"
		}).onDelete("set null"),
]);

export const news = pgTable("news", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	authorId: uuid("author_id").notNull(),
	organizationId: text("organization_id").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	type: documentType().notNull(),
	visibility: documentVisibility().notNull(),
	attachmentId: uuid("attachment_id").notNull(),
	uploadedBy: text("uploaded_by").notNull(),
	employeeId: uuid("employee_id"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const attachments = pgTable("attachments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	fileName: text("file_name").notNull(),
	mimeType: text("mime_type").notNull(),
	extension: text().notNull(),
	fullPath: text("full_path").notNull(),
	type: attachmentTypes(),
	title: text(),
	description: text(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const jobApplications = pgTable("job_applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	jobPostingId: uuid("job_posting_id").notNull(),
	organizationId: text("organization_id").notNull(),
	candidateName: text("candidate_name").notNull(),
	candidateEmail: text("candidate_email").notNull(),
	candidatePhone: text("candidate_phone"),
	resumeUrl: text("resume_url"),
	coverLetter: text("cover_letter"),
	status: applicationStatus().default('applied').notNull(),
	internalNotes: text("internal_notes"),
	reviewedByEmployeeId: uuid("reviewed_by_employee_id"),
	interviewDate: timestamp("interview_date", { mode: 'string' }),
	interviewNotes: text("interview_notes"),
	rejectionReason: text("rejection_reason"),
	appliedAt: timestamp("applied_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.jobPostingId],
			foreignColumns: [jobPostings.id],
			name: "job_applications_job_posting_id_job_postings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "job_applications_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reviewedByEmployeeId],
			foreignColumns: [employees.id],
			name: "job_applications_reviewed_by_employee_id_employees_id_fk"
		}).onDelete("set null"),
]);

export const jobPostings = pgTable("job_postings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: text("organization_id").notNull(),
	createdByEmployeeId: text("created_by_employee_id").notNull(),
	title: text().notNull(),
	department: text().notNull(),
	description: text().notNull(),
	locationType: jobLocationType("location_type").default('onsite').notNull(),
	location: text(),
	status: jobStatus().default('draft').notNull(),
	salaryRangeMin: integer("salary_range_min"),
	salaryRangeMax: integer("salary_range_max"),
	salaryCurrency: text("salary_currency").default('USD'),
	experienceRequired: text("experience_required"),
	skills: json().default([]),
	requirements: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	closedAt: timestamp("closed_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "job_postings_organization_id_organizations_id_fk"
		}).onDelete("cascade"),
]);
