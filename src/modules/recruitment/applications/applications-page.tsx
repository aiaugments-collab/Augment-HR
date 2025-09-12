"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  User,
  Search,
  Brain,
  Briefcase,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { APPLICATION_STATUSES } from "../consts";
import { ResumeScreeningDialog } from "../resume-screening/resume-screening-dialog";
import { ApplicationsSkeleton } from "../components/skeletons";
import type { ApplicationStatus } from "../types";

export function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const applicationsQuery = api.recruitment.getAllApplications.useQuery({
    status: activeTab,
    limit: 50,
  });

  const getStatusVariant = (status: string) => {
    const statusConfig = APPLICATION_STATUSES.find((s) => s.value === status);
    return statusConfig?.variant || "default";
  };

  const filteredApplications = applicationsQuery.data?.applications.filter(
    (app) =>
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobPosting?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobPosting?.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (applicationsQuery.isLoading) {
    return <ApplicationsSkeleton />;
  }

  if (applicationsQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Failed to load applications</p>
            <Button
              variant="outline"
              onClick={() => applicationsQuery.refetch()}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage all job applications across your organization
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Applications Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ApplicationStatus)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Applications</CardTitle>
              <TabsList>
                <TabsTrigger value="all">
                  All ({applicationsQuery.data?.applications.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Review
                </TabsTrigger>
                <TabsTrigger value="screened">
                  AI Screened
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="mt-0">
              {filteredApplications.length === 0 ? (
                <div className="py-12 text-center">
                  <User className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {searchQuery ? "No matching applications" : "No applications found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Applications will appear here once candidates start applying to your jobs."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-3">
                          {/* Avatar */}
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {application.candidateName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Application Details */}
                          <div className="flex-1 space-y-2">
                            {/* Name, Status, and Job */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">
                                {application.candidateName}
                              </h4>
                              <Badge variant={getStatusVariant(application.status)}>
                                {
                                  APPLICATION_STATUSES.find(
                                    (s) => s.value === application.status,
                                  )?.label
                                }
                              </Badge>
                              {application.jobPosting && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Briefcase className="h-3 w-3" />
                                  <span>{application.jobPosting.title}</span>
                                  <span>•</span>
                                  <span>{application.jobPosting.department}</span>
                                </div>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <a
                                  href={`mailto:${application.candidateEmail}`}
                                  className="hover:text-primary"
                                >
                                  {application.candidateEmail}
                                </a>
                              </div>

                              {application.candidatePhone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <a
                                    href={`tel:${application.candidatePhone}`}
                                    className="hover:text-primary"
                                  >
                                    {application.candidatePhone}
                                  </a>
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Applied{" "}
                                  {formatDistanceToNow(
                                    new Date(application.appliedAt),
                                    { addSuffix: true },
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Cover Letter Preview */}
                            {application.coverLetter && (
                              <div className="text-sm">
                                <p className="text-muted-foreground line-clamp-2">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}

                            {/* AI Screening Results */}
                            {application.aiScreeningResult && (
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Brain className="h-3 w-3" />
                                  <span className="text-muted-foreground">AI Score:</span>
                                  <Badge variant="secondary">
                                    {application.aiScreeningResult.matchScore}%
                                  </Badge>
                                </div>
                                <Badge
                                  variant={
                                    application.aiScreeningResult.recommendation === "shortlist"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {application.aiScreeningResult.recommendation === "shortlist"
                                    ? "Recommended"
                                    : "Not Recommended"}
                                </Badge>
                              </div>
                            )}

                            {/* Review Information */}
                            {application.reviewedAt &&
                              application.reviewedByEmployee && (
                                <div className="text-muted-foreground text-xs">
                                  Reviewed by {application.reviewedByEmployee.name} on{" "}
                                  {format(new Date(application.reviewedAt), "PPP")}
                                </div>
                              )}

                            {/* Interview Date */}
                            {application.interviewDate && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">
                                  Interview scheduled:{" "}
                                </span>
                                <span className="font-medium">
                                  {format(
                                    new Date(application.interviewDate),
                                    "PPP 'at' p",
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-start gap-2">
                          {application.resumeUrl && (
                            <>
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={application.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="mr-1 h-4 w-4" />
                                  Resume
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              </Button>

                              {application.jobPosting && (
                                <ResumeScreeningDialog
                                  resumeUrl={application.resumeUrl}
                                  candidateName={application.candidateName}
                                  jobId={application.jobPosting.id}
                                  applicationId={application.id}
                                  trigger={
                                    <Button variant="outline" size="sm">
                                      <Brain className="mr-1 h-4 w-4" />
                                      AI Screen
                                    </Button>
                                  }
                                />
                              )}
                            </>
                          )}

                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
