import { AppSidebar } from "@/components/app-sidebar";
import ModelTree from "@/components/ModelTree";

export default function() {
    return(
        <div className="flex">
            <AppSidebar />
            <ModelTree />
        </div>
    )
}