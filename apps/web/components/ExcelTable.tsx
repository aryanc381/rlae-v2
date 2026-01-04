import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { VscCallOutgoing } from "react-icons/vsc";
import { Button } from "./ui/button";
import { selectUser } from "@/lib/store/slice/excelSlice";
import { toast } from "sonner";

export default function ExcelTable() {
    const sheet = useAppSelector((state) => state.excel.data?.all_rows);
    const dispatch = useAppDispatch();
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
                        <TableCell><Button className="rounded-[0.10vw] cursor-pointer" onClick={() => {dispatch(selectUser(data)); toast.success('User selected.')}}><VscCallOutgoing /></Button></TableCell>
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