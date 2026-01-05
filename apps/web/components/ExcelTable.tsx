import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { VscCallOutgoing } from "react-icons/vsc";
import { Button } from "./ui/button";
import { selectUser } from "@/lib/store/slice/excelSlice";
import { toast } from "sonner";
import axios from "axios";
import { setPromptConfig } from "@/lib/store/slice/promptSlice";

export default function ExcelTable() {
    const sheet = useAppSelector((state) => state.excel.data?.all_rows);
    const dispatch = useAppDispatch();
    async function promptCreator(input_context: string, data: any) {
        return toast.promise(
            axios.post('http://localhost:5000/v2/api/agents/context-mapper', {
            context: input_context
        }), 
        {
            loading: 'Fetching context...',
            success: (res) => {
                dispatch(selectUser(data));
                dispatch(setPromptConfig({
                    qualities: res.data.qualities ?? [],
                    specifications: res.data.specifications ?? [],
                    outliers: res.data.outliers ?? [],
                    matchedUseCaseId: res.data.matched_use_case_id ?? "",
                    matchedUseCase: res.data.matched_use_case ?? "",
                    similarity: res.data.theta ?? 0
                }));
                return res.data.msg;
                
            },
            error: () => 'Backend not available.'
        }
    );
        
        
    }

    
    return(
        <div className=" border overflow-x-auto overflow-y-auto [scrollbar-width:none] h-[22.5vw]">
            <Table>
                <TableCaption >A list of your recent debtors.</TableCaption>
                <TableHeader className="">
                    <TableRow>
                    <TableHead className="w-[100px]">User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead>Email-ID</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Due Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>FUC</TableHead>
                    <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sheet?.map((data, idx) => (
                    <TableRow key={idx}>
                        <TableCell className="font-medium">{data.user_id}</TableCell>
                        <TableCell className="w-[1vw]">{data.name}</TableCell>
                        <TableCell>{data.category}</TableCell>
                        <TableCell>{data.context}</TableCell>
                        <TableCell>{data.email}</TableCell>
                        <TableCell>{data.phone}</TableCell>
                        <TableCell>{data.outstanding}</TableCell>
                        <TableCell>{data.due}</TableCell>
                        <TableCell>{data.status}</TableCell>
                        <TableCell>{data.followup_count}</TableCell>
                        <TableCell><Button className="rounded-[0.10vw] cursor-pointer" onClick={() => {promptCreator(data.context, data)}}><VscCallOutgoing /></Button></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
        </div>
        
    )
}