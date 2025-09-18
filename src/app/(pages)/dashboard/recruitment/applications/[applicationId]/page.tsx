import { Suspense } from "react";
import { ApplicationDetailSkeleton } from "@/modules/recruitment/components/skeletons";
import { ApplicationDetailPage } from "@/modules/recruitment/applications/application-detail-page";

interface ApplicationDetailPageProps {
  params: Promise<{
    applicationId: string;
  }>;
}

export default async function ApplicationDetail({ params }: ApplicationDetailPageProps) {
  const { applicationId } = await params;
  
  return (
    <div className="space-y-6">
      <Suspense fallback={<ApplicationDetailSkeleton />}>
        <ApplicationDetailPage applicationId={applicationId} />
      </Suspense>
    </div>
  );
}
