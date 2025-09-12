import { Suspense } from "react";
import { ApplicationDetailPage } from "@/modules/recruitment/applications/application-detail-page";
import { ApplicationDetailSkeleton } from "@/modules/recruitment/components/skeletons";

interface ApplicationDetailPageProps {
  params: {
    applicationId: string;
  };
}

export default function ApplicationDetail({ params }: ApplicationDetailPageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ApplicationDetailSkeleton />}>
        <ApplicationDetailPage applicationId={params.applicationId} />
      </Suspense>
    </div>
  );
}
