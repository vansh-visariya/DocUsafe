"use client";

import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingCard } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocuments, useVerifyDocument, useRejectDocument } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types";

export default function AdminDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const toast = useToast();

  // Fetch documents with filters
  const { data, isLoading, error, refetch } = useDocuments({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const verifyMutation = useVerifyDocument();
  const rejectMutation = useRejectDocument();

  const documents = data?.data || [];

  const getStatusBadge = (status: DocumentStatus) => {
    const variants: Record<DocumentStatus, "pending" | "verified" | "rejected"> = {
      pending: "pending",
      verified: "verified",
      rejected: "rejected",
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
    setViewDialogOpen(true);
  };

  const handleVerify = async (docId: string) => {
    try {
      await verifyMutation.mutateAsync({ id: docId });
      toast.success("Success", "Document verified successfully");
      refetch();
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Failed to verify document");
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Error", "Please provide a reason for rejection");
      return;
    }

    try {
      await rejectMutation.mutateAsync({ id: docId, reason: rejectReason });
      toast.success("Success", "Document rejected successfully");
      setRejectReason("");
      refetch();
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Failed to reject document");
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load documents. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">Manage and verify student documents</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, student name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No documents found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Documents will appear here once students start uploading
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{doc.userName}</div>
                        <div className="text-sm text-muted-foreground">{doc.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {doc.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVerify(doc._id)}
                              className="text-green-600 hover:text-green-700"
                              disabled={verifyMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) {
                                  setRejectReason(reason);
                                  handleReject(doc._id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" asChild>
                          <a href={doc.fileUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title}</DialogTitle>
            <DialogDescription>Document details and preview</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Student Name</p>
                  <p className="text-sm text-muted-foreground">{selectedDoc.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedDoc.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedDoc.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedDoc.createdAt)}
                  </p>
                </div>
              </div>
              {selectedDoc.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedDoc.description}</p>
                </div>
              )}
              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium">Document Preview</p>
                <p className="text-sm text-muted-foreground">
                  File: {selectedDoc.fileName}
                </p>
                <Button asChild className="mt-4" size="sm">
                  <a href={selectedDoc.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </a>
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
