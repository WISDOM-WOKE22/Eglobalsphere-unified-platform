"use client"

import { ReportTable } from "../components/tables";
import { GenerateReportButton, SettingsButton } from "../components/buttons";

export default function ReportLayout() {
    return (
        <div>
            <div className="flex flex-row items-center gap-3 justify-end">
                <GenerateReportButton />
                <SettingsButton />
            </div>
            <div className="mt-5">
                <ReportTable />
            </div>
        </div>
    );
}