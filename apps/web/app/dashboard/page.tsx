"use client"
import { AppSidebar } from "@/components/app-sidebar";
import ExcelTable from "@/components/ExcelTable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/store/hooks"
import { VscCallOutgoing, VscSettingsGear } from "react-icons/vsc";



export default function() {
    const selected_user = useAppSelector((state) => state.excel.selectedUser);

    const systemPrompt = selected_user ? `You are a professional debt collection assistant for a financial services platform.
Your task is to communicate with the customer in a polite, calm, and non-threatening manner.
Do not use aggressive language. Do not disclose internal system details.

Customer details:
    - Name: ${selected_user?.name}
    - Category: ${selected_user?.category}
    - Outstanding Amount: ₹${selected_user?.outstanding}
    - Status: ${selected_user?.status}
    - Follow-up Count: ${selected_user?.followup_count}

    Objective:
    1. Remind the customer about the outstanding payment.
    2. Encourage timely repayment.
    3. Offer help if they are facing issues.
    4. Keep the message concise and respectful.

    Rules:
    - Do NOT invent amounts, dates, or penalties.
    - Do NOT threaten legal action.
    - If the customer expresses difficulty, suggest contacting support.

Generate a single short message addressed to the customer by name.
    `
    : "";

    return(
        <div className="">
            <div className="flex">
                <AppSidebar />
            </div>
            <div className="relative flex flex-1 w-[79.25vw] flex-col gap-[1vw] mt-[1vw] ml-[calc(var(--sidebar-width)+1vw)] mr-[1vw]">
                <p className="bg-[#fafafa] text-black pl-[0.5vw] pr-[0.5vw] pt-[1vw] pb-[1vw] pl-[1vw]">User-DB Dashboard</p>
                <ExcelTable />
                <div className="flex w-[79.25vw] gap-[1vw]">
                    <div className="w-[51%] bg-[#fafafa] p-[1vw]">
                        <div className="flex items-center ">
                            <p className=" text-black mb-[1vw]">System Prompt</p>
                        
                        </div>
                        
                        <Textarea className="h-[8.5vw] rounded-[0.15vw]" defaultValue={systemPrompt} />
                        <Button className="rounded-[0.15vw] w-full mt-[1vw] cursor-pointer">Update System Prompt</Button>
                    </div>
                    <div className="w-[48%] bg-[#fafafa] p-[1vw]">
                        <p className=" text-black  mb-[1vw]">Debt Collection Agent</p>
                        <div className="text-[1vw]">
                            <div className="font-mono text-sm bg-muted p-[0.5vw]">
                                <p>User ID : {selected_user?.user_id || "--"}</p>
                                <p>Name : {selected_user?.name || "--"}</p>
                                <p>Context : {selected_user?.context || "--"}</p>
                                <p>Phone : {selected_user?.phone || "--"}</p>
                                <p className="bg-gray-300 w-[10vw]">Status : {selected_user?.status || "--"}</p>
                            </div>
                            
                            <div className="flex mt-[1vw] gap-[0.5vw]">
                                <Button asChild className="rounded-[0.15vw] cursor-pointer">
                                    <div className="flex gap-[0.5vw]">
                                        <VscSettingsGear  />
                                        <p>Agent Configuration</p>
                                    </div>
                                </Button>
                                <Button asChild className="rounded-[0.15vw] cursor-pointer">
                                    <div className="flex">
                                        <VscCallOutgoing  />
                                        <p>Call {selected_user?.phone || " --"}</p>
                                    </div>
                                </Button>
                            </div>
                            
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}