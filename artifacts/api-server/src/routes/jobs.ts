import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobsTable, insertJobSchema, updateJobSchema } from "@workspace/db";
import { eq, desc, ilike, or, and, gte, sql } from "drizzle-orm";
import {
  ListJobsQueryParams,
  CreateJobBody,
  UpdateJobBody,
  GetJobParams,
  UpdateJobParams,
  DeleteJobParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  try {
    const allJobs = await db.select().from(jobsTable);
    const total = allJobs.length;

    const byStatusMap: Record<string, number> = {};
    for (const job of allJobs) {
      byStatusMap[job.status] = (byStatusMap[job.status] || 0) + 1;
    }
    const byStatus = Object.entries(byStatusMap).map(([status, count]) => ({
      status,
      count,
    }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = allJobs.filter(
      (j) => j.createdAt >= thirtyDaysAgo
    ).length;

    res.json({ total, byStatus, recentActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/export", async (_req, res) => {
  try {
    const jobs = await db
      .select()
      .from(jobsTable)
      .orderBy(desc(jobsTable.createdAt));

    const headers = [
      "ID",
      "Company",
      "Role",
      "Status",
      "Location",
      "URL",
      "Salary",
      "Notes",
      "Applied At",
      "Created At",
    ];

    const escape = (val: string | null | undefined) => {
      if (val == null) return "";
      const s = String(val);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = jobs.map((j) => [
      j.id,
      escape(j.company),
      escape(j.role),
      j.status,
      escape(j.location),
      escape(j.url),
      escape(j.salary),
      escape(j.notes),
      j.appliedAt ? j.appliedAt.toISOString() : "",
      j.createdAt.toISOString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="job-applications.csv"'
    );
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = ListJobsQueryParams.parse(req.query);

    const conditions = [];

    if (query.status) {
      conditions.push(eq(jobsTable.status, query.status));
    }

    if (query.search) {
      conditions.push(
        or(
          ilike(jobsTable.company, `%${query.search}%`),
          ilike(jobsTable.role, `%${query.search}%`)
        )
      );
    }

    const jobs =
      conditions.length > 0
        ? await db
            .select()
            .from(jobsTable)
            .where(and(...conditions))
            .orderBy(desc(jobsTable.createdAt))
        : await db
            .select()
            .from(jobsTable)
            .orderBy(desc(jobsTable.createdAt));

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateJobBody.parse(req.body);
    const parsed = insertJobSchema.parse(body);
    const [created] = await db.insert(jobsTable).values(parsed).returning();
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetJobParams.parse({ id: Number(req.params.id) });
    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id));
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = UpdateJobParams.parse({ id: Number(req.params.id) });
    const body = UpdateJobBody.parse(req.body);
    const parsed = updateJobSchema.parse(body);

    const [updated] = await db
      .update(jobsTable)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(jobsTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeleteJobParams.parse({ id: Number(req.params.id) });
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
