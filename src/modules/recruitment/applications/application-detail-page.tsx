"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  User,
  Briefcase,
  Brain,
  Eye,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { APPLICATION_STATUSES } from "../consts";
import { ResumeScreeningDialog } from "../resume-screening/resume-screening-dialog";
import { AIResultsViewer } from "../resume-screening/ai-results-viewer";
import { getResumeViewerUrl, getResumeDownloadUrl } from "@/lib/resume-utils";
import Link from "next/link";
import { toast } from "sonner";

interface ApplicationDetailPageProps {
  applicationId: string;
}

export function ApplicationDetailPage({ applicationId }: ApplicationDetailPageProps) {
  const applicationQuery = api.recruitment.getApplicationById.useQuery({
    applicationId,
  });

  const handleDownloadResume = (resumeUrl: string, candidateName: string) => {
    const link = document.createElement('a');
    link.href = getResumeDownloadUrl(resumeUrl);
    link.download = `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
    toast.success("Resume download started");
  };

  if (applicationQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (applicationQuery.error || !applicationQuery.data) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Application not found</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/recruitment/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const application = applicationQuery.data;
  const statusConfig = APPLICATION_STATUSES.find((s) => s.value === application.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/recruitment/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{application.candidateName}</h1>
            <p className="text-muted-foreground">
              Applied {format(new Date(application.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <Badge variant={statusConfig?.variant || "default"}>
          {statusConfig?.label || application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-lg">
                    {application.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{application.candidateName}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.candidateEmail}
                    </div>
                    {application.candidatePhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {application.candidatePhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {application.coverLetter && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Cover Letter</h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Job Information */}
          {application.jobPosting && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Applied Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{application.jobPosting.title}</h3>
                    <p className="text-muted-foreground">{application.jobPosting.department}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{application.jobPosting.location}</span>
                    <span>•</span>
                    <span className="capitalize">{application.jobPosting.type}</span>
                    <span>•</span>
                    <span className="capitalize">{application.jobPosting.level}</span>
                  </div>
                  {application.jobPosting.salaryRange && (
                    <p className="text-sm font-medium">
                      Salary: {application.jobPosting.salaryRange}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Screening Results */}
          {application.aiScreeningResult?.recommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Screening Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIResultsViewer
                  application={application}
                  trigger={
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Detailed AI Analysis
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resume Actions */}
          {application.resumeUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <a
                    href={getResumeViewerUrl(application.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Resume
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownloadResume(application.resumeUrl!, application.candidateName)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>

                {application.jobPosting && (
                  <ResumeScreeningDialog
                    resumeUrl={application.resumeUrl}
                    candidateName={application.candidateName}
                    jobId={application.jobPosting.id}
                    applicationId={application.id}
                    trigger={
                      <Button variant="outline" className="w-full">
                        <Brain className="mr-2 h-4 w-4" />
                        Run AI Screening
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Application Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(application.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                
                {application.aiScreeningResult?.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">AI Screening Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(application.aiScreeningResult.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(application.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full">
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
