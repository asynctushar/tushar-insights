import { banUser, deleteUser, getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; }; }
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

        await banUser(jwt, id);

        return NextResponse.json(
            { success: true, message: "User status updated successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update user status error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Only authors can update user status." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to update user status" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; }; }
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

        await deleteUser(jwt, id);

        return NextResponse.json(
            { success: true, message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete user error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Only authors can delete users." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to delete user" },
            { status: 500 }
        );
    }
}