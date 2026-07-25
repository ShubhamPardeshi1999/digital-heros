import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/lib/models/lead.model";
import Activity from "@/lib/models/activity.model";
import { requireAuth } from "@/lib/auth-helpers";

// GET /api/leads/[id] — Get single lead detail (AUTHENTICATED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;

    const lead = await Lead.findById(id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .lean();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Fetch activity trail for this lead
    const activities = await Activity.find({ leadId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error("Fetch lead error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] — Update lead (status, assign, add note) (AUTHENTICATED)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const userId = session!.user.id;

    switch (action) {
      case "update_status": {
        const { status } = body;
        const validStatuses = ["new", "contacted", "qualified", "proposal", "won", "lost"];
        if (!validStatuses.includes(status)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const oldStatus = lead.status;
        lead.status = status;
        await lead.save();

        await Activity.create({
          leadId: id,
          action: "status_changed",
          performedBy: userId,
          details: `Status changed from "${oldStatus}" to "${status}"`,
        });

        break;
      }

      case "assign": {
        const { assignedTo } = body;
        const oldAssignee = lead.assignedTo;
        lead.assignedTo = assignedTo || null;
        await lead.save();

        await Activity.create({
          leadId: id,
          action: assignedTo ? "assigned" : "unassigned",
          performedBy: userId,
          details: assignedTo
            ? `Lead assigned to team member`
            : `Lead unassigned`,
        });

        break;
      }

      case "add_note": {
        const { text } = body;
        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            { error: "Note text is required" },
            { status: 400 }
          );
        }

        lead.notes.push({
          text: text.trim(),
          addedBy: userId as unknown as import("mongoose").Types.ObjectId,
          createdAt: new Date(),
        });
        await lead.save();

        await Activity.create({
          leadId: id,
          action: "note_added",
          performedBy: userId,
          details: `Note added: "${text.trim().substring(0, 50)}${text.trim().length > 50 ? "..." : ""}"`,
        });

        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: update_status, assign, add_note" },
          { status: 400 }
        );
    }

    // Return updated lead
    const updatedLead = await Lead.findById(id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .lean();

    const activities = await Activity.find({ leadId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      message: "Lead updated successfully",
      lead: updatedLead,
      activities,
    });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
