import { Button } from "@/components/ui/button";
import { ReportTable } from "../components/tables";
import { Settings, Send } from "lucide-react";

export default function ReportLayout() {
    return (
        <div>
            <div className="flex flex-row items-center gap-3 justify-end">
                <Button variant="outline" className="flex flex-row items-center">
                    <Send />
                    <p>Generate Report</p>
                </Button>
                <Button className="flex flex-row items-center">
                    <Settings />
                    <p>Settings</p>
                </Button>
            </div>
            <div className="mt-5">
                <ReportTable />
            </div>
        </div>
    );
}