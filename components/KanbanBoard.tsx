"use client";
import { useState } from "react";

type Task = { id: number; title: string; status: string; };
type Props = { tasks: Task[]; onMove: (id: number, status: string) => void; };

export default function KanbanBoard({ tasks, onMove }: Props) {
    const [dragOver, setDragOver] = useState("");

    const getTasks = (status: string) => tasks.filter(t => t.status === status);

    const onDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData("taskId"));
        onMove(id, status);
        setDragOver(""); // ✅ Drop ke baad highlight band!
    };

    const Box = ({ title, status }: { title: string; status: string }) => (
        <div
            className={`flex-1 rounded-2xl p-4 min-h- transition-all ${dragOver === status ? "bg-green-400/20 border-2 border-green-400" : "bg-white/5"
                }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(status); }}
            onDragLeave={() => setDragOver("")}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="text-white mb-3">{title} ({getTasks(status).length})</h3>
            {getTasks(status).map(t => (
                <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("taskId", t.id.toString())}
                    className="bg-white/10 rounded-xl p-3 mb-2 text-white text-sm cursor-grab active:cursor-grabbing"
                >
                    {t.title}
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl px-4">
            <Box title="📝 To Do" status="todo" />
            <Box title="⚡ In-Progress" status="in-progress" />
            <Box title="✅ Done" status="done" />
        </div>
    );
}