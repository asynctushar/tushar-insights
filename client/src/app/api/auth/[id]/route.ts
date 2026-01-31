import { banUser, deleteUser, getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; }>; }
) {
    try {
        const { id } = await params;
        const jwt = await getJwtFromCookies();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await banUser(jwt, id);
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to Ban User" },
                { status: result.error?.status || 400 }
            );
        }

        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update user status" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; }>; }
) {
    try {
        const { id } = await params;
        const jwt = await getJwtFromCookies();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await deleteUser(jwt, id);
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to Delete User" },
                { status: result.error?.status || 400 }
            );
        }

        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        console.error("Delete user error:", error);

        return NextResponse.json(
            { error: error.message || "Failed to delete user" },
            { status: 500 }
        );
    }
}