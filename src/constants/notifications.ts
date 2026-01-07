export interface Notification {
    id: string
    title: string
    description: string
    content: string
    type: 'system' | 'activity' | 'alert'
    category: string
    isRead: boolean
    createdAt: string
    priority: 'high' | 'medium' | 'low'
}

export const notifications: Notification[] = [
    {
        id: "1",
        title: "Security Update Required",
        description: "A critical security patch is available for your system",
        content: "We've identified a security vulnerability that requires immediate attention. Please update your system to the latest version to ensure your data remains secure. This update includes important security patches and performance improvements.",
        type: "system",
        category: "security",
        isRead: false,
        createdAt: "2026-11-25T19:30:00Z",
        priority: "high"
    },
    {
        id: "2",
        title: "Employee Check-in Detected",
        description: "Seun Alagbe checked in at Zone A",
        content: "Employee Seun Alagbe (ID: SEAL8765) successfully checked in at Zone A using face recognition. Confidence score: 96.5%. Timestamp: 08:45 AM",
        type: "activity",
        category: "check-in",
        isRead: false,
        createdAt: "2026-11-25T07:45:00Z",
        priority: "low"
    },
    {
        id: "3",
        title: "Unauthorized Access Attempt",
        description: "Failed access attempt detected at Gate 3",
        content: "An unauthorized access attempt was detected at Gate 3. License plate ABC-1234 attempted entry but was denied due to expired access permissions. Security team has been notified.",
        type: "alert",
        category: "access",
        isRead: false,
        createdAt: "2026-11-25T14:20:00Z",
        priority: "high"
    },
    {
        id: "4",
        title: "System Maintenance Scheduled",
        description: "Scheduled maintenance on November 26, 2026",
        content: "We will be performing routine system maintenance on November 26, 2026, from 2:00 AM to 4:00 AM GMT+1. Some services may be temporarily unavailable during this period. We apologize for any inconvenience.",
        type: "system",
        category: "maintenance",
        isRead: true,
        createdAt: "2026-11-24T10:00:00Z",
        priority: "medium"
    },
    {
        id: "5",
        title: "New Employee Registered",
        description: "Ismail Makhlouf has been added to the system",
        content: "A new employee, Ismail Makhlouf (ID: ISMA4532), has been successfully registered in the system. Access permissions have been granted for Zones A, B, and C. Face recognition profile has been created.",
        type: "activity",
        category: "registration",
        isRead: true,
        createdAt: "2026-11-24T16:30:00Z",
        priority: "low"
    },
    {
        id: "6",
        title: "High Temperature Alert",
        description: "Abnormal temperature detected in Zone B",
        content: "Temperature sensors in Zone B have detected readings above the normal threshold (35°C). Please investigate immediately. Current reading: 42°C. Alert triggered at 11:15 AM.",
        type: "alert",
        category: "environmental",
        isRead: false,
        createdAt: "2026-11-25T10:15:00Z",
        priority: "high"
    },
    {
        id: "7",
        title: "Attendance Report Generated",
        description: "Weekly attendance report is ready",
        content: "Your weekly attendance report for November 18-24, 2026 has been generated and is ready for review. Total attendance: 94.5%. Download the full report from the Reports section.",
        type: "system",
        category: "reports",
        isRead: true,
        createdAt: "2026-11-24T09:00:00Z",
        priority: "low"
    },
    {
        id: "8",
        title: "Vehicle Exit Logged",
        description: "Vehicle XYZ-5678 exited through Gate 2",
        content: "License plate XYZ-5678 successfully exited the premises through Gate 2 at 5:30 PM. Total duration on premises: 8 hours 45 minutes. All checks completed.",
        type: "activity",
        category: "vehicle",
        isRead: true,
        createdAt: "2026-11-24T17:30:00Z",
        priority: "low"
    },
    {
        id: "9",
        title: "Low Disk Space Warning",
        description: "Storage capacity reaching limit",
        content: "Your system storage is at 87% capacity. We recommend freeing up space or upgrading your storage plan. Current usage: 174GB / 200GB. Consider archiving old logs and reports.",
        type: "alert",
        category: "system",
        isRead: false,
        createdAt: "2026-11-25T12:00:00Z",
        priority: "medium"
    },
    {
        id: "10",
        title: "Multiple Check-outs Recorded",
        description: "15 employees checked out in the last hour",
        content: "Batch check-out activity detected. 15 employees have checked out between 4:00 PM and 5:00 PM, which is within normal shift end parameters. All check-outs completed successfully.",
        type: "activity",
        category: "check-out",
        isRead: true,
        createdAt: "2026-11-24T17:00:00Z",
        priority: "low"
    },
    {
        id: "11",
        title: "Face Recognition Accuracy Update",
        description: "Improved accuracy with latest model",
        content: "The face recognition system has been updated to version 2.4. New improvements include: 15% better accuracy in low-light conditions, faster processing time, and reduced false positive rate. Average confidence score increased to 94.2%.",
        type: "system",
        category: "updates",
        isRead: false,
        createdAt: "2026-11-25T08:00:00Z",
        priority: "medium"
    },
    {
        id: "12",
        title: "Suspicious Activity Detected",
        description: "Multiple failed access attempts from same vehicle",
        content: "License plate DEF-9876 has attempted access 5 times in the last 30 minutes, all attempts denied. This has been flagged as suspicious activity. Security team alerted. Consider blocking this vehicle.",
        type: "alert",
        category: "security",
        isRead: false,
        createdAt: "2026-11-25T15:45:00Z",
        priority: "high"
    },
    {
        id: "13",
        title: "Zone Assignment Updated",
        description: "Rahman Badran's zone permissions modified",
        content: "Zone access permissions for employee Rahman Badran (ID: RABA2341) have been updated. Added: Zone D, Zone E. Removed: Zone F. Changes made by Admin: Farouq Admin. Effective immediately.",
        type: "activity",
        category: "permissions",
        isRead: true,
        createdAt: "2026-11-23T14:20:00Z",
        priority: "medium"
    },
    {
        id: "14",
        title: "Backup Completed Successfully",
        description: "Daily system backup finished",
        content: "Daily automated backup completed at 2:30 AM. All data successfully backed up to secure cloud storage. Backup size: 45.2 GB. Next scheduled backup: November 26, 2026 at 2:00 AM.",
        type: "system",
        category: "backup",
        isRead: true,
        createdAt: "2026-11-25T02:30:00Z",
        priority: "low"
    },
    {
        id: "15",
        title: "Shift Change Notification",
        description: "Day shift ending, night shift beginning",
        content: "Shift change at 6:00 PM. Day shift employees completing check-out procedures. Night shift employees beginning check-in. Total day shift attendance: 47 employees. Expected night shift: 23 employees.",
        type: "activity",
        category: "shift",
        isRead: true,
        createdAt: "2026-11-24T18:00:00Z",
        priority: "low"
    }
]
