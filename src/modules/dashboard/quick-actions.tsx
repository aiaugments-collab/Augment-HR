"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAbility } from "@/providers/ability-context";

export function QuickActions() {
  const router = useRouter();
  const ability = useAbility();

  const handleActionClick = (route: string) => {
    router.push(route);
  };

  // Define actions based on user abilities
  const actions = [
    ...(ability.can("manage", "Employee")
      ? [
          {
            icon: UserPlus,
            title: "Deploy Agent",
            description: "Initialize new workforce agent",
            route: "/dashboard/employees",
            onClick: () => handleActionClick("/employees"),
          },
          {
            icon: Users,
            title: "Workforce Intelligence",
            description: "Monitor and optimize agents",
            route: "/dashboard/employees",
            onClick: () => handleActionClick("/employees"),
          },
        ]
      : []),

    // Payroll management (HR and Admin)
    ...(ability.can("manage", "Payroll") || ability.can("create", "Payroll")
      ? [
          {
            icon: DollarSign,
            title: "Compensation Engine",
            description: "Execute automated payroll",
            route: "/dashboard/payroll",
            onClick: () => handleActionClick("/payroll"),
          },
        ]
      : []),

    // Leave management (HR, Admin, and Project Managers)
    ...(ability.can("manage", "LeaveRequests") ||
    ability.can("update", "LeaveRequests")
      ? [
          {
            icon: Calendar,
            title: "Absence Orchestration",
            description: "AI-powered leave management",
            route: "/leaves",
            onClick: () => handleActionClick("/leaves"),
          },
        ]
      : []),

    // Attendance management (available to most roles)
    ...(ability.can("create", "Attendance") || ability.can("read", "Attendance")
      ? [
          {
            icon: Clock,
            title: "Presence Analytics",
            description: "Monitor workforce activity",
            route: "/dashboard/attendance",
            onClick: () => handleActionClick("/attendance"),
          },
        ]
      : []),

    // Employee-specific actions
    ...(!ability.can("manage", "Employee") && !ability.can("update", "Employee")
      ? [
          {
            icon: FileText,
            title: "Absence Request",
            description: "Automated leave processing",
            route: "/leaves/request",
            onClick: () => handleActionClick("/leaves/request"),
          },
          {
            icon: Clock,
            title: "Activity Dashboard",
            description: "Personal analytics view",
            route: "/attendance/my",
            onClick: () => handleActionClick("/attendance/my"),
          },
          {
            icon: DollarSign,
            title: "Compensation Data",
            description: "Personal financial analytics",
            route: "/payroll/my",
            onClick: () => handleActionClick("/payroll/my"),
          },
        ]
      : []),

    // Analytics for managers and above
    ...(ability.can("update", "Employee") || ability.can("manage", "Employee")
      ? [
          {
            icon: BarChart3,
            title: "Intelligence Hub",
            description: "Predictive workforce analytics",
            route: "/analytics",
            onClick: () => handleActionClick("/analytics"),
          },
        ]
      : []),
  ];

  // Show only first 4 actions to maintain layout
  const displayedActions = actions.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligent Operations</CardTitle>
        <CardDescription>
          {ability.can("manage", "Employee")
            ? "AI-powered workforce management"
            : ability.can("update", "Employee")
              ? "Cognitive team orchestration"
              : "Autonomous agent interface"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                onClick={action.onClick}
                className="hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors"
              >
                <IconComponent className="text-primary h-8 w-8" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {actions.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            <p>No intelligent operations available</p>
            <p className="text-sm">Contact your system administrator for access</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
