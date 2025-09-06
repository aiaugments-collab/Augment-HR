import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  json,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { organizations } from "./organizations";

export const jobStatusEnum = pgEnum("job_status", ["open", "closed", "draft"]);

export const jobLocationTypeEnum = pgEnum("job_location_type", [
  "remote",
  "onsite",
  "hybrid",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "shortlisted",
  "interviewed",
  "hired",
  "rejected",
]);

export const aiRecommendationEnum = pgEnum("ai_recommendation", [
  "shortlist",
  "reject",
]);

// Job Postings Table
export const jobPostings = pgTable("job_postings", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdByEmployeeId: uuid("created_by_employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),

  // Job Details
  title: text("title").notNull(),
  department: text("department").notNull(),
  description: text("description").notNull(),
  locationType: jobLocationTypeEnum("location_type")
    .notNull()
    .default("onsite"),
  location: text("location"),
  status: jobStatusEnum("status").notNull().default("draft"),

  // Optional Fields
  salaryRangeMin: integer("salary_range_min"),
  salaryRangeMax: integer("salary_range_max"),
  salaryCurrency: text("salary_currency").default("USD"),
  experienceRequired: text("experience_required"),
  skills: json("skills").$type<string[]>().default([]),
  requirements: text("requirements"),

  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
});

// Job Applications Table
export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobPostingId: uuid("job_posting_id")
    .notNull()
    .references(() => jobPostings.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),

  candidateName: text("candidate_name").notNull(),
  candidateEmail: text("candidate_email").notNull(),
  candidatePhone: text("candidate_phone"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),

  status: applicationStatusEnum("status").notNull().default("applied"),

  // HR Management Fields
  internalNotes: text("internal_notes"),
  reviewedByEmployeeId: uuid("reviewed_by_employee_id").references(
    () => employees.id,
    { onDelete: "set null" },
  ),
  interviewDate: timestamp("interview_date"),
  interviewNotes: text("interview_notes"),
  rejectionReason: text("rejection_reason"),

  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export const aiScreeningResults = pgTable("ai_screening_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobApplicationId: uuid("job_application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),

  matchScore: integer("match_score").notNull(),
  confidence: integer("confidence").notNull(),
  recommendation: aiRecommendationEnum("recommendation").notNull(),
  matchedSkills: json("matched_skills").$type<string[]>().notNull().default([]),
  missingSkills: json("missing_skills").$type<string[]>().notNull().default([]),
  summary: text("summary").notNull(),

  aiModel: text("ai_model"),
  processingTime: integer("processing_time"),

  screenedAt: timestamp("screened_at").defaultNow().notNull(),
  screenedByEmployeeId: uuid("screened_by_employee_id").references(
    () => employees.id,
    { onDelete: "set null" },
  ),
});

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [jobPostings.organizationId],
    references: [organizations.id],
  }),
  createdByEmployee: one(employees, {
    fields: [jobPostings.createdByEmployeeId],
    references: [employees.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one, many }) => ({
    jobPosting: one(jobPostings, {
      fields: [jobApplications.jobPostingId],
      references: [jobPostings.id],
    }),
    organization: one(organizations, {
      fields: [jobApplications.organizationId],
      references: [organizations.id],
    }),
    reviewedByEmployee: one(employees, {
      fields: [jobApplications.reviewedByEmployeeId],
      references: [employees.id],
    }),
    aiScreeningResults: many(aiScreeningResults),
  }),
);

export const aiScreeningResultsRelations = relations(
  aiScreeningResults,
  ({ one }) => ({
    jobApplication: one(jobApplications, {
      fields: [aiScreeningResults.jobApplicationId],
      references: [jobApplications.id],
    }),
    organization: one(organizations, {
      fields: [aiScreeningResults.organizationId],
      references: [organizations.id],
    }),
    screenedByEmployee: one(employees, {
      fields: [aiScreeningResults.screenedByEmployeeId],
      references: [employees.id],
    }),
  }),
);
