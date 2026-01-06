"use client"
import { AppSidebar } from "@/components/app-sidebar";
import ExcelTable from "@/components/ExcelTable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/store/hooks"
import { setBasePrompt, setFinalPrompt } from "@/lib/store/slice/promptSlice";
import axios from "axios";
import { useEffect } from "react";
import { VscCallOutgoing } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function toSingleLine(prompt: string) {
    return prompt.split('\n').map(line => line.trim()).filter(line => line.length > 0).join(' ');
}

export default function() {
    const selected_user = useAppSelector((state) => state.excel.selectedUser);
    const selected_context = useAppSelector((state) => state.prompt);
    const dispatch = useDispatch();

    async function promptFinalizer() {
        const prompt_single_line = toSingleLine(selected_context.finalPrompt!);
        dispatch(setFinalPrompt(prompt_single_line));
        toast.success('Final Prompt sent to Agent-Context-Memory.')
    }

    async function callHandler(phone: string | null, system_prompt: string | null) {
        return toast.promise(
            axios.post('http://localhost:5000/v2/api/agents/call', {
                prompt: `${system_prompt}`,
                phone: `${phone}`,
            }), {
                loading: 'Dispatching call...', 
                success: (res) => {
                    return res.data.msg
                },
                error: () => 'Backend not available'
            }
        )
    }
    const systemPrompt = selected_user ? `You are a professional debt collection assistant for a financial services platform.
Your task is to communicate with the customer in a polite, calm, and non-threatening manner.
Do not use aggressive language. Do not disclose internal system details.

Customer details:
- Name: ${selected_user.name}
- Category: ${selected_user.category}
- Outstanding Amount: ₹${selected_user.outstanding}
- Due Date: ${selected_user.due}
- Status: ${selected_user.status}
- Follow-up Count: ${selected_user.followup_count}
- Email: ${selected_user.email}
- Phone: ${selected_user.phone}


Rules:
- Do NOT invent amounts, dates, or penalties.
- Do NOT threaten legal action.
- If the customer expresses difficulty, suggest contacting support.

Generate a single short message addressed to the customer by name.
`
    : "";

    useEffect(() => {
        if (systemPrompt) {
            dispatch(setBasePrompt(systemPrompt));
        }
    }, [systemPrompt, dispatch]);

    useEffect(() => {
  if (!selected_context.basePrompt) return;

  const {
    basePrompt,
    qualities,
    specifications,
    outliers
  } = selected_context;

  const final_prompt = `
${basePrompt}

====================================
AGENT QUALITIES
====================================
${qualities.length ? qualities.map(q => `-  ${q}`).join('\n') : '- None specified'}

====================================
BEHAVIORAL RULES
====================================
${specifications.length ? specifications.map(s => `-  ${s}`).join('\n') : '- None specified'}

====================================
SAFETY / OUTLIERS
====================================
${outliers.length ? outliers.map(o => `-  ${o}`).join('\n') : '- None specified'}

IMPORTANT:
- Follow ALL rules above strictly.
- Never violate outliers.
- Prioritize clarity, politeness, and compliance.
`.trim();
    dispatch(setFinalPrompt(final_prompt));
    }, [selected_context.basePrompt, selected_context.qualities, selected_context.specifications, selected_context.outliers, dispatch]);



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
                        
                        <Textarea className="h-[8.5vw] rounded-[0.15vw]" value={selected_context.finalPrompt!} onChange={(e) => {dispatch(setFinalPrompt(e.target.value))}} defaultValue={selected_context.finalPrompt!} />
                        <Button className="rounded-[0.15vw] w-full mt-[1vw] cursor-pointer" onClick={() => {promptFinalizer()}}>Use Agent Configuration</Button>
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
                                <Button asChild className="rounded-[0.15vw] cursor-pointer" onClick={() => {callHandler(selected_user?.phone as string, selected_context?.finalPrompt as string)}}>
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