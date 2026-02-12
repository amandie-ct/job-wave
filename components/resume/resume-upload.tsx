"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_FILE_SIZE } from "@/lib/constants";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function ResumeUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      toast.error("Only PDF and DOCX files are accepted");
      setLoading(false);
      return;
    }

    if (file.size > MAX_RESUME_FILE_SIZE) {
      toast.error("File must be under 5MB");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/resumes", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Failed to upload resume");
      setLoading(false);
      return;
    }

    toast.success("Resume uploaded and parsed successfully");
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Resume Name</Label>
            <Input id="name" name="name" placeholder="e.g. Frontend Resume v2" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File (PDF or DOCX)</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.docx" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading & Parsing..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
