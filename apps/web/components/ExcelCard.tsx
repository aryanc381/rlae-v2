"use client"
import axios from "axios";
import { useRef } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

export default function Excel2JSON() {
    const file_input_ref = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        file_input_ref.current?.click();
    }

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!file.name.endsWith('.xlsx') && !file.name.endsWith(".xls")) { alert('Please upload valid excel file.'); return; }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('http://localhost:5000/v2/api/data/exceltojson', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log('Upload success: ' + response.data);
        } catch(err) {
            console.error('Upload failed: ' + err);
        }
    }
    return(
        <div className="">
            <Card className="text-center flex flex-col rounded-[0vw] w-[30vw]">
                <CardHeader>
                    <CardTitle>Submit Excel Sheet</CardTitle>
                    <CardDescription>This is to convert Excel data to a format that RLAE to further process. Make sure the excel sheet is in the correct format.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="hidden">
                        <input type="file" accept=".xlsx,.xls" ref={file_input_ref} onChange={handleFileChange} className="hidden" />
                    </div>
                    <div className="flex gap-[0.5vw] w-full justify-center">
                        <Button className="rounded-[0.15vw] cursor-pointer" variant={'secondary'}>Go Back</Button>
                        <Button className="rounded-[0.15vw] cursor-pointer" onClick={handleClick}>Add .xlsx / xls file</Button>
                    </div>
                </CardContent>
                
            </Card>
        </div>
    );
}