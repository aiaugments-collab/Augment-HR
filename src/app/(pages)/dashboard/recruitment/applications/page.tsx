import { Suspense } from "react";

import { ApplicationsSkeleton } from "@/modules/recruitment/components/skeletons";
import { ApplicationsPage } from "@/modules/recruitment/applications/applications-page";

export default function RecruitmentApplicationsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ApplicationsSkeleton />}>
        <ApplicationsPage />
      </Suspense>
    </div>
  );
}
 