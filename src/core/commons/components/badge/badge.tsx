export const getStatusBadge = (status: string) => {
  const baseClass = 'px-2 py-1 rounded-2xl px-2 text-[13px]';
  switch (status.toLowerCase()) {
    case 'active':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>
          Active
        </span>
      );
    case 'verified':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>
          Verified
        </span>
      );
    case 'inactive':
      return (
        <span className={`${baseClass} bg-gray-200 text-red-500`}>
          Inactive
        </span>
      );
    case 'not verified':
      return (
        <span className={`${baseClass} bg-gray-200 text-red-500`}>
          Not Verified
        </span>
      );
    case 'pending':
      return (
        <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Pending
        </span>
      );
    case 'draft':
      return (
        <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Draft
        </span>
      );
    case 'used':
      return (
        <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Used
        </span>
      );
    case 'running':
      return (
        <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>
          Running
        </span>
      );
    case 'sent':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>Sent</span>
      );
    case 'approved':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>
          Approved
        </span>
      );
    case 'completed':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>
          Completed
        </span>
      );
    case 'finished':
      return (
        <span className={`${baseClass} bg-green-200 text-green-800`}>
          finished
        </span>
      );
    case 'writing':
      return (
        <span className={`${baseClass} bg-purple-200 text-purple-800`}>
          writing
        </span>
      );
    case 'blocked':
      return (
        <span className={`${baseClass} bg-red-200 text-red-800`}>Blocked</span>
      );
    case 'suspended':
      return (
        <span className={`${baseClass} bg-red-200 text-red-800`}>
          Suspended
        </span>
      );
    default:
      return (
        <span className={`${baseClass} bg-red-200 text-red-800`}>Unknown</span>
      );
  }
};
