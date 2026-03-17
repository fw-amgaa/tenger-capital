"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/ui/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FormSubmission } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const columns: ColumnDef<FormSubmission>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "И-мэйл",
  },
  {
    accessorKey: "phone",
    header: "Утас",
  },
  {
    accessorKey: "hasAccount",
    header: "Данс нээлгэсэн эсэх",
    cell: ({ row }) => {
      const hasAccount = row.getValue("hasAccount") as boolean;
      return (
        <Badge variant={hasAccount ? "default" : "secondary"}>
          {hasAccount ? "Тийм" : "Үгүй"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "investAmount",
    header: "Хөрөнгө оруулалтын хэмжээ",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Илгээсэн огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
];

function exportToExcel(submissions: FormSubmission[]) {
  const rows = submissions.map((s) => ({
    "Нэр": s.name,
    "И-мэйл": s.email,
    "Утас": s.phone,
    "Данс нээлгэсэн эсэх": s.hasAccount ? "Тийм" : "Үгүй",
    "Хөрөнгө оруулалтын хэмжээ": s.investAmount ?? "",
    "Илгээсэн огноо": new Date(s.createdAt).toLocaleString("mn-MN"),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Бөглөлтүүд");
  XLSX.writeFile(wb, `маягт-бөглөлтүүд-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch("/api/form-submissions");
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Маягт бөглөлтүүд</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Маягт бөглөлтүүд
              </h1>
              <p className="text-muted-foreground">
                Вэбсайтаас ирсэн бүх хүсэлтийг энд харна.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => exportToExcel(submissions)}
              disabled={loading || submissions.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Excel татах
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Уншиж байна...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={submissions}
              searchKey="name"
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
