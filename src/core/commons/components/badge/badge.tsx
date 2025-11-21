import { Badge } from "@/components/ui/badge";
import { badgeStatus } from "@/types";

export const getStatusBadge = (status: badgeStatus) => {
  const baseClass = 'px-2 py-1 rounded-2xl px-2 text-[13px]';
  switch (status?.toLowerCase()) {
    case 'active':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Active
        </Badge>
      );
    case 'verified':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Verified
        </Badge>
      );
    case 'inactive':
      return (
        <Badge className={`${baseClass} bg-gray-200 text-red-500`}>
          Inactive
        </Badge>
      );
    case 'not verified':
      return (
        <Badge className={`${baseClass} bg-gray-200 text-red-500`}>
          Not Verified
        </Badge>
      );
    case 'pending':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Pending
        </Badge>
      );
    case 'check_out':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Check out
        </Badge>
      );
    case 'draft':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Draft
        </Badge>
      );
    case 'used':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Used
        </Badge>
      );
    case 'running':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Running
        </Badge>
      );
    case 'visitor':
      return (
        <Badge className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Visitor
        </Badge>
      );
    case 'sent':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>Sent</Badge>
      );
    case 'approved':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Approved
        </Badge>
      );
    case 'completed':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Completed
        </Badge>
      );
    case 'accepted':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Accepted
        </Badge>
      );
    case 'check_in':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Check in
        </Badge>
      );
    case 'employee':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          Employee
        </Badge>
      );
    case 'finished':
      return (
        <Badge className={`${baseClass} bg-green-200 text-green-800`}>
          finished
        </Badge>
      );
    case 'writing':
      return (
        <Badge className={`${baseClass} bg-purple-200 text-purple-800`}>
          writing
        </Badge>
      );
    case 'present':
      return (
        <Badge className={`${baseClass} bg-purple-200 text-purple-800`}>
          Present
        </Badge>
      );
    case 'security_guard':
      return (
        <Badge className={`${baseClass} bg-purple-200 text-purple-800`}>
          Security Guard
        </Badge>
      );
    case 'blocked':
      return (
        <Badge className={`${baseClass} bg-red-200 text-red-800`}>Blocked</Badge>
      );
    case 'rejected':
      return (
        <Badge className={`${baseClass} bg-red-200 text-red-800`}>
          Rejected
        </Badge>
      );
    case 'suspended':
      return (
        <Badge className={`${baseClass} bg-red-200 text-red-800`}>
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge className={`${baseClass} bg-red-200 text-red-800`}>Unknown</Badge>
      );
  }
};